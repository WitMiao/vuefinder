<template>
  <ClientOnly>
    <div v-if="driver" class="composable-demo">
      <div class="composable-demo__viewer">
        <vue-finder
          id="demo-composable-api"
          :driver="driver"
          :config="{ initialPath: 'memory://', persist: false }"
          @ready="initFinder"
        />
      </div>

      <div class="composable-demo__bottom">
        <div class="composable-demo__panel">
          <h3 class="composable-demo__title">Composable API Controls</h3>
          <p v-if="finderError" class="composable-demo__error">{{ finderError }}</p>

          <div class="composable-demo__actions">
            <button type="button" :disabled="!isReady" @click="refresh">Refresh</button>
            <button type="button" :disabled="!isReady" @click="openRoot">Open Root</button>
            <button type="button" :disabled="!isReady" @click="selectFirst">Select First File</button>
            <button type="button" :disabled="!isReady" @click="selectAllCurrent">Select All Loaded</button>
            <button type="button" :disabled="!isReady" @click="printSelectedPaths">
              Print Selected Paths
            </button>
            <button type="button" :disabled="!isReady" @click="clearSelection">Clear Selection</button>
          </div>

          <div class="composable-demo__create">
            <input v-model="folderName" type="text" placeholder="Folder name" />
            <button type="button" :disabled="!isReady" @click="createFolder">Create Folder</button>
          </div>
        </div>

        <div class="composable-demo__panel composable-demo__selected">
          <h4>Selected Paths</h4>
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
  gap: 0.75rem;
}

.composable-demo__viewer {
  min-height: 340px;
}

.composable-demo__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.composable-demo__panel {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.composable-demo__title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
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

.composable-demo__create {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.4rem;
  margin-top: 0.6rem;
}

.composable-demo__selected h4 {
  margin: 0 0 0.4rem 0;
  font-size: 0.75rem;
}

.composable-demo__empty {
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

.composable-demo__path {
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
