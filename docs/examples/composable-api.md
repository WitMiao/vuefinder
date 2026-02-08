---
outline: deep
---

# Composable API

Example showing how to control a mounted VueFinder instance with `useVueFinder(id)`.

## Live Demo

<ClientOnly>
  <ComposableApiDemo />
</ClientOnly>

## Code Example

```vue
<template>
  <div class="composable-api-example">
    <vue-finder
      id="composable_demo"
      :driver="driver"
      :config="{ initialPath: 'memory://', persist: false }"
      @ready="initFinder"
    />

    <div class="composable-api-example__bottom">
      <section class="composable-api-example__card">
        <h3 class="composable-api-example__title">Composable API Controls</h3>

        <button :disabled="!isReady" @click="refresh">Refresh</button>
        <button :disabled="!isReady" @click="openRoot">Open Root</button>
        <button :disabled="!isReady" @click="selectAllCurrent">Select All Loaded</button>
        <button :disabled="!isReady" @click="printSelectedPaths">Print Selected Paths</button>
      </section>

      <section class="composable-api-example__card composable-api-example__card--log">
        <h3 class="composable-api-example__title">Selected Paths</h3>
        <div v-if="!selectedPathsOutput.length">No selected paths printed yet.</div>
        <div v-for="path in selectedPathsOutput" :key="path">{{ path }}</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrayDriver, useVueFinder } from 'vuefinder';
import type { DirEntry, VueFinderComposable } from 'vuefinder';

const files = ref<DirEntry[]>([
  {
    storage: 'memory',
    dir: 'memory://',
    basename: 'docs',
    extension: '',
    path: 'memory://docs',
    type: 'dir',
    file_size: null,
    last_modified: Date.now(),
    mime_type: null,
    visibility: 'public',
  },
]);

const driver = new ArrayDriver({ files, storage: 'memory' });
const finder = ref<VueFinderComposable | null>(null);
const selectedPathsOutput = ref<string[]>([]);

const initFinder = () => {
  if (!finder.value) finder.value = useVueFinder('composable_demo');
};

const isReady = computed(() => Boolean(finder.value));

const refresh = async () => {
  await finder.value?.refresh();
};

const openRoot = async () => {
  const firstStorage = finder.value?.getStorages()[0] || 'memory';
  await finder.value?.open(`${firstStorage}://`);
};

const selectAllCurrent = () => {
  const currentFiles = finder.value?.getFiles() || [];
  finder.value?.select(currentFiles.map((item) => item.path));
};

const printSelectedPaths = () => {
  selectedPathsOutput.value = finder.value?.getSelectedPaths() || [];
};
</script>
```

## Notes

- Initialize the composable after the instance is mounted. Using `@ready` is the safest pattern.
- `select(paths)` selects only items currently loaded in the active directory.
- `getSelectedPaths()` returns the current selected paths snapshot.

See:

- [Guide - Composable API](../guide/composable-api.md)
- [API Reference - Types](../api-reference/types.md)
