---
outline: deep
---

# Composable API

Use `useVueFinder(id)` when you want to control a mounted VueFinder instance programmatically.

## Quick Start

```vue
<script setup lang="ts">
import { useVueFinder } from 'vuefinder';

const finder = useVueFinder('my-local-finder');

const refresh = async () => {
  await finder.refresh();
};

const createFolder = async () => {
  await finder.createFolder('New Folder API');
};
</script>

<template>
  <vue-finder id="my-local-finder" :driver="driver" />
  <button @click="refresh">Refresh</button>
  <button @click="createFolder">Create Folder</button>
</template>
```

## Notes

- The target instance **must be mounted**. If not, `useVueFinder(id)` throws a descriptive error.
- `select(paths)` only selects files currently loaded in the active directory.
- Core operations (`createFolder`, `rename`, `move`, etc.) delegate to the configured driver.
