import { BaseAdapter } from './Adapter';
import { ArrayDriver } from './ArrayDriver';
import type {
  DeleteParams,
  DeleteResult,
  FileOperationResult,
  FileContentResult,
  ArchiveParams,
  SaveParams,
  RenameParams,
  TransferParams,
  UploaderContext,
} from './types';
import type { DirEntry, FsData } from '../types';

export interface IndexedDBDriverConfig {
  dbName?: string; // defaults to 'vuefinder'
  storage?: string; // defaults to 'indexeddb'
  readOnly?: boolean;
  version?: number; // defaults to 1
}

type ContentRecord = { path: string; content: string | ArrayBuffer };

// IndexedDB driver backed by ArrayDriver logic.
// ArrayDriver owns all file behavior and this class only persists state.
export class IndexedDBDriver extends BaseAdapter {
  private dbName: string;
  private storage: string;
  private readOnly: boolean;
  private version: number;
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private entries: DirEntry[] = [];
  private contentStore = new Map<string, string | ArrayBuffer>();
  private driver: ArrayDriver;
  private readyPromise: Promise<void> | null = null;

  constructor(config: IndexedDBDriverConfig = {}) {
    super();
    this.dbName = config.dbName || 'vuefinder';
    this.storage = config.storage || 'indexeddb';
    this.readOnly = Boolean(config.readOnly);
    this.version = config.version || 1;

    this.driver = new ArrayDriver({
      files: this.entries,
      storage: this.storage,
      readOnly: this.readOnly,
      contentStore: this.contentStore,
    });

    // Start loading immediately so uploader callbacks do not race with initial state load.
    this.readyPromise = this.loadSnapshotFromDB();
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'path' });
          filesStore.createIndex('storage', 'storage', { unique: false });
          filesStore.createIndex('dir', 'dir', { unique: false });
        }

        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'path' });
        }
      };
    });

    return this.dbPromise;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return this.initDB();
  }

  private requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private waitTransaction(transaction: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  private async loadSnapshotFromDB(): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(['files', 'content'], 'readonly');

    const filesStore = tx.objectStore('files');
    const contentStore = tx.objectStore('content');

    let filesRequest: IDBRequest<DirEntry[]>;
    if (filesStore.indexNames.contains('storage')) {
      filesRequest = filesStore.index('storage').getAll(this.storage) as IDBRequest<DirEntry[]>;
    } else {
      filesRequest = filesStore.getAll() as IDBRequest<DirEntry[]>;
    }

    const [files, contentRows] = await Promise.all([
      this.requestToPromise(filesRequest),
      this.requestToPromise(contentStore.getAll() as IDBRequest<ContentRecord[]>),
    ]);

    await this.waitTransaction(tx);

    this.entries.length = 0;
    this.entries.push(...files.filter((entry) => entry.storage === this.storage));

    this.contentStore.clear();
    for (const row of contentRows) {
      if (!row?.path || !row.path.startsWith(`${this.storage}://`)) continue;
      this.contentStore.set(row.path, row.content);
    }
  }

  private async persistSnapshot(): Promise<void> {
    if (this.readOnly) return;

    const db = await this.getDB();
    const tx = db.transaction(['files', 'content'], 'readwrite');
    const filesStore = tx.objectStore('files');
    const contentStore = tx.objectStore('content');

    filesStore.clear();
    contentStore.clear();

    for (const entry of this.entries) {
      if (entry.storage !== this.storage) continue;
      filesStore.put(entry);
    }

    for (const [path, content] of this.contentStore.entries()) {
      if (!path.startsWith(`${this.storage}://`)) continue;
      contentStore.put({ path, content });
    }

    await this.waitTransaction(tx);
  }

  private async ensureReady(): Promise<void> {
    if (!this.readyPromise) {
      this.readyPromise = this.loadSnapshotFromDB();
    }
    await this.readyPromise;
  }

  async list(params?: { path?: string }): Promise<FsData> {
    await this.ensureReady();
    return this.driver.list(params);
  }

  async delete(params: DeleteParams): Promise<DeleteResult> {
    await this.ensureReady();
    const result = await this.driver.delete(params);
    await this.persistSnapshot();
    return result;
  }

  async rename(params: RenameParams): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.rename(params);
    await this.persistSnapshot();
    return result;
  }

  async copy(params: TransferParams): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.copy(params);
    await this.persistSnapshot();
    return result;
  }

  async move(params: TransferParams): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.move(params);
    await this.persistSnapshot();
    return result;
  }

  async archive(params: ArchiveParams): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.archive(params);
    await this.persistSnapshot();
    return result;
  }

  async unarchive(params: { item: string; path: string }): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.unarchive(params);
    await this.persistSnapshot();
    return result;
  }

  async createFile(params: { path: string; name: string }): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.createFile(params);
    await this.persistSnapshot();
    return result;
  }

  async createFolder(params: { path: string; name: string }): Promise<FileOperationResult> {
    await this.ensureReady();
    const result = await this.driver.createFolder(params);
    await this.persistSnapshot();
    return result;
  }

  getPreviewUrl(params: { path: string }): string {
    return this.driver.getPreviewUrl(params);
  }

  async getContent(params: { path: string }): Promise<FileContentResult> {
    await this.ensureReady();
    return this.driver.getContent(params);
  }

  getDownloadUrl(params: { path: string }): string {
    return this.driver.getDownloadUrl(params);
  }

  async search(params: {
    path?: string;
    filter: string;
    deep?: boolean;
    size?: 'all' | 'small' | 'medium' | 'large';
  }): Promise<DirEntry[]> {
    await this.ensureReady();
    return this.driver.search(params);
  }

  async save(params: SaveParams): Promise<string> {
    await this.ensureReady();
    const result = await this.driver.save(params);
    await this.persistSnapshot();
    return result;
  }

  configureUploader?(uppy: any, context: UploaderContext): void {
    void this.ensureReady();
    this.driver.configureUploader?.(uppy, context);
    if (!uppy) return;

    uppy.on('upload-success', async () => {
      try {
        await this.ensureReady();
        await this.persistSnapshot();
      } catch {
        // Keep uploader flow resilient for local drivers.
      }
    });
  }
}
