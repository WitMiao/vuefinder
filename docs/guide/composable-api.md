---
outline: deep
---

# Composable API

Use `useVueFinder(id)` when you want to control a mounted VueFinder instance programmatically.

## Quick Start

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useVueFinder } from 'vuefinder';

const finder = ref<ReturnType<typeof useVueFinder> | null>(null);

onMounted(() => {
  finder.value = useVueFinder('my-local-finder');
});

const refresh = async () => {
  await finder.value?.refresh();
};

const createFolder = async () => {
  await finder.value?.createFolder('New Folder API');
};

const previewFile = () => {
  finder.value?.preview('local://docs/readme.txt');
};
</script>

<template>
  <vue-finder id="my-local-finder" :driver="driver" />
  <button @click="refresh">Refresh</button>
  <button @click="createFolder">Create Folder</button>
  <button @click="previewFile">Preview File</button>
</template>
```

## Notes

- The target instance **must be mounted**. If not, `useVueFinder(id)` throws a descriptive error.
- `select(paths)` only selects files currently loaded in the active directory.
- Core operations (`createFolder`, `rename`, `move`, etc.) delegate to the configured driver.
