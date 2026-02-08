<template>
  <ClientOnly>
    <div v-if="driver" class="window-popup-only">
      <vue-finder
        id="demo-window-popup"
        :driver="driver"
        :config="{ initialPath: 'window://', persist: false }"
      >
        <template #status-bar="{ selected, count }">
          <div class="window-popup-only__status-actions">
            <button
              type="button"
              class="window-popup-only__btn"
              :disabled="!count"
              @click="sendSelectedToParent(selected)"
            >
              Select ({{ count ?? 0 }} selected)
            </button>
          </div>
        </template>
      </vue-finder>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DirEntry, Driver } from 'vuefinder';

const driver = ref<Driver | null>(null);

const sendSelectedToParent = (payload: unknown) => {
  try {
    const filesRaw = Array.isArray(payload)
      ? payload.map((it: unknown) => {
          const item = it as Record<string, unknown>;
          const path = typeof item?.path === 'string' ? item.path : '';
          return {
            path,
            name:
              (typeof item?.basename === 'string' && item.basename) ||
              (typeof item?.name === 'string' && item.name) ||
              path.split('/').pop() ||
              path,
          };
        })
      : [];

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'window-demo-files-selected', files: filesRaw }, '*');
    }
  } catch {
    // no-op
  }

  try {
    window.close();
  } catch {
    // no-op
  }
};

onMounted(async () => {
  const { ArrayDriver } = await import('vuefinder');
  const now = Date.now();
  const files: DirEntry[] = [
    {
      storage: 'window',
      dir: 'window://',
      basename: 'docs',
      extension: '',
      path: 'window://docs',
      type: 'dir',
      file_size: null,
      last_modified: now,
      mime_type: null,
      visibility: 'public',
    },
    {
      storage: 'window',
      dir: 'window://docs',
      basename: 'readme.txt',
      extension: 'txt',
      path: 'window://docs/readme.txt',
      type: 'file',
      file_size: 123,
      last_modified: now,
      mime_type: 'text/plain',
      visibility: 'public',
    },
    {
      storage: 'window',
      dir: 'window://',
      basename: 'notes.md',
      extension: 'md',
      path: 'window://notes.md',
      type: 'file',
      file_size: 456,
      last_modified: now,
      mime_type: 'text/markdown',
      visibility: 'public',
    },
  ];

  driver.value = new ArrayDriver({ files, storage: 'window' });
});
</script>

<style scoped>
.window-popup-only {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.window-popup-only__status-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.window-popup-only__btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid #047857;
  border-radius: 5px;
  background: #047857;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.window-popup-only__btn:hover:not(:disabled) {
  background: #065f46;
}

.window-popup-only__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
