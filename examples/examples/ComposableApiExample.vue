<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVueFinder } from '../../src';
import type { Driver } from '../../src/adapters';
import type { VueFinderComposable } from '../../src/types';

interface Props {
  driver: Driver;
  config: Record<string, unknown>;
  features: unknown;
}

const props = defineProps<Props>();
const finder = ref<VueFinderComposable | null>(null);
const finderError = ref('');

const folderName = ref('New Folder API');
const selectedPathsOutput = ref<string[]>([]);

const initFinder = () => {
  if (finder.value) return;
  try {
    finder.value = useVueFinder('composable_demo');
    finderError.value = '';
  } catch (error) {
    finderError.value = error instanceof Error ? error.message : 'Failed to init useVueFinder';
  }
};

const isReady = computed(() => Boolean(finder.value));

const refresh = async () => {
  await finder.value?.refresh();
};

const selectFirst = () => {
  const first = finder.value?.getFiles()[0];
  if (first) {
    finder.value?.selectOne(first.path);
  }
};

const selectAllCurrent = () => {
  const currentFiles = finder.value?.getFiles() || [];
  finder.value?.select(currentFiles.map((item) => item.path));
};

const printSelectedPaths = () => {
  selectedPathsOutput.value = finder.value?.getSelectedPaths() || [];
};

const openRoot = async () => {
  const firstStorage = finder.value?.getStorages()[0] || 'local';
  await finder.value?.open(`${firstStorage}://`);
};

const createFolder = async () => {
  const name = folderName.value.trim();
  if (!name) return;
  await finder.value?.createFolder(name);
};
</script>

<template>
  <div class="composable-api-example">
    <vue-finder
      id="composable_demo"
      :driver="props.driver"
      :config="props.config"
      :features="props.features"
      @ready="initFinder"
    />

    <div class="composable-api-example__bottom">
      <div class="composable-api-example__panel">
        <div style="font-weight: 600; margin-bottom: 8px">Composable API Controls</div>
        <div v-if="finderError" style="margin-bottom: 8px; color: #b91c1c; font-size: 12px">
          {{ finderError }}
        </div>
        <div class="composable-api-example__actions">
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="refresh">
            Refresh
          </button>
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="openRoot">Open Root</button>
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="selectFirst">
            Select First File
          </button>
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="selectAllCurrent">
            Select All Loaded
          </button>
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="printSelectedPaths">
            Print Selected Paths
          </button>
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="() => finder?.clearSelection()">
            Clear Selection
          </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center; margin-top: 8px">
          <input
            v-model="folderName"
            type="text"
            style="border: 1px solid #ccc; border-radius: 4px; padding: 6px"
            placeholder="Folder name"
          />
          <button class="btn" style="margin: 0" :disabled="!isReady" @click="createFolder">
            Create Folder
          </button>
        </div>
      </div>

      <div class="composable-api-example__panel" style="max-height: 220px; overflow: auto">
        <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px">Selected Paths</div>
        <div v-if="!selectedPathsOutput.length" style="font-size: 12px; color: #666">
          No selected paths printed yet.
        </div>
        <div v-for="path in selectedPathsOutput" :key="path" style="font-size: 12px; color: #333">
          {{ path }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.composable-api-example {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.composable-api-example__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.composable-api-example__panel {
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 10px;
}

.composable-api-example__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

@media (max-width: 900px) {
  .composable-api-example__bottom {
    grid-template-columns: 1fr;
  }

  .composable-api-example__actions {
    grid-template-columns: 1fr;
  }
}
</style>
