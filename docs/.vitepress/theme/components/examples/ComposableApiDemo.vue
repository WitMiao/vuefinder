<template>
  <ClientOnly>
    <div v-if="driver" class="composable-demo">
      <div class="composable-demo__viewer">
        <vue-finder
          id="demo-composable-api"
          :driver="driver"
          :config="{ initialPath: 'memory://', persist: false }"
          @ready="initFinder"
          @select="handleSelect"
        />
      </div>

      <div class="composable-demo__bottom">
        <div class="composable-demo__section">
          <div class="composable-demo__section-header">
            <h3 class="composable-demo__section-title">Composable API Controls</h3>
          </div>
          <p v-if="finderError" class="composable-demo__error">{{ finderError }}</p>

          <div class="composable-demo__actions">
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="refresh">Refresh</button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="openRoot">Open Root</button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="selectFirst">Select First File</button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="selectAllCurrent">Select All Loaded</button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady || selectedPathsLive.length === 0" @click="openSelected">
              Open Selected
            </button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="printSelectedPaths">
              Print Selected Paths
            </button>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="clearSelection">Clear Selection</button>
          </div>

          <div class="composable-demo__create">
            <label class="composable-demo__field">
              <span>Folder Name</span>
              <input v-model="folderName" type="text" class="composable-demo__input" placeholder="Folder name" />
            </label>
            <button type="button" class="composable-demo__btn" :disabled="!isReady" @click="createFolder">
              Create Folder
            </button>
          </div>
        </div>

        <div class="composable-demo__info-section">
          <h3 class="composable-demo__info-title">Selected Paths</h3>
          <div v-if="selectedPathsOutput.length === 0" class="composable-demo__empty">
            No selected paths printed yet.
          </div>
          <div v-for="path in selectedPathsOutput" :key="path" class="composable-demo__path">
            {{ path }}
          </div>
        </div>
      </div>
    </div>
    <template #fallback>
      <div style="padding: 2rem; text-align: center; color: #6b7280">Loading demo...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Driver, DirEntry, VueFinderComposable } from 'vuefinder';

const driver = ref<Driver | null>(null);
const finder = ref<VueFinderComposable | null>(null);
const finderError = ref('');
const folderName = ref('New Folder API');
const selectedPathsOutput = ref<string[]>([]);
const selectedPathsLive = ref<string[]>([]);
let useVueFinderFn: ((id: string) => VueFinderComposable) | null = null;

const isReady = computed(() => Boolean(finder.value));

const initFinder = () => {
  if (finder.value || !useVueFinderFn) return;
  try {
    finder.value = useVueFinderFn('demo-composable-api');
    finderError.value = '';
  } catch (error) {
    finderError.value = error instanceof Error ? error.message : 'Failed to init useVueFinder';
  }
};

const refresh = async () => {
  await finder.value?.refresh();
};

const openRoot = async () => {
  const firstStorage = finder.value?.getStorages()[0] || 'memory';
  await finder.value?.open(`${firstStorage}://`);
};

const selectFirst = () => {
  const first = finder.value?.getFiles()[0];
  if (first) finder.value?.selectOne(first.path);
};

const selectAllCurrent = () => {
  const files = finder.value?.getFiles() || [];
  finder.value?.select(files.map((item) => item.path));
};

const openSelected = async () => {
  const firstSelected = selectedPathsLive.value[0];
  if (!firstSelected) return;
  const selectedItem = (finder.value?.getFiles() || []).find((item) => item.path === firstSelected);
  if (selectedItem?.type === 'dir') {
    await finder.value?.open(firstSelected);
    return;
  }
  const previewMethod = (finder.value as unknown as { preview?: (path: string) => void })?.preview;
  if (typeof previewMethod === 'function') {
    previewMethod(firstSelected);
    return;
  }

  // Fallback for docs when dist build is older than source API additions.
  const previewUrl = driver.value?.getPreviewUrl({ path: firstSelected });
  if (previewUrl) {
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  }
};

const clearSelection = () => {
  finder.value?.clearSelection();
};

const printSelectedPaths = () => {
  selectedPathsOutput.value = finder.value?.getSelectedPaths() || [];
};

const createFolder = async () => {
  const name = folderName.value.trim();
  if (!name) return;
  await finder.value?.createFolder(name);
};

const handleSelect = (items: DirEntry[]) => {
  selectedPathsLive.value = items.map((item) => item.path);
};

onMounted(async () => {
  const mod = await import('vuefinder');
  useVueFinderFn = mod.useVueFinder;

  const now = Date.now();
  const files: DirEntry[] = [
    {
      storage: 'memory',
      dir: 'memory://',
      basename: 'docs',
      extension: '',
      path: 'memory://docs',
      type: 'dir',
      file_size: null,
      last_modified: now,
      mime_type: null,
      visibility: 'public',
    },
    {
      storage: 'memory',
      dir: 'memory://docs',
      basename: 'readme.txt',
      extension: 'txt',
      path: 'memory://docs/readme.txt',
      type: 'file',
      file_size: 12,
      last_modified: now,
      mime_type: 'text/plain',
      visibility: 'public',
    },
  ];

  driver.value = new mod.ArrayDriver({ files, storage: 'memory' });
});
</script>

<style scoped>
.composable-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.composable-demo__viewer {
  min-height: 340px;
}

.composable-demo__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.composable-demo__section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid #8b5cf6;
  border-radius: 8px;
}

.composable-demo__section-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.composable-demo__section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.composable-demo__error {
  margin: 0 0 0.5rem 0;
  color: #b91c1c;
  font-size: 0.75rem;
}

.composable-demo__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}

.composable-demo__btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.composable-demo__btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
}

.composable-demo__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.composable-demo__create {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.composable-demo__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.composable-demo__input {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  font-size: 0.75rem;
}

.composable-demo__info-section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.composable-demo__info-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.composable-demo__path {
  padding: 0.35rem 0;
  border-top: 1px solid var(--vp-c-border);
  font-size: 0.75rem;
}

.composable-demo__empty {
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

@media (max-width: 960px) {
  .composable-demo__bottom {
    grid-template-columns: 1fr;
  }

  .composable-demo__actions {
    grid-template-columns: 1fr;
  }
}
</style>
