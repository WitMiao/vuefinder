---
outline: deep
---

# Notifications

Example showing how to:

- Toggle built-in toast notifications
- Customize toast position and duration
- Listen to `@notify` events for external UI/logging

## Live Demo

<ClientOnly>
  <NotificationsDemo />
</ClientOnly>

## Code Example

```vue
<template>
  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px">
    <vue-finder
      id="notify-demo"
      :driver="driver"
      :config="config"
      @notify="handleNotify"
    />

    <div class="panel">
      <h3>Notification Settings</h3>

      <label>
        <input v-model="notificationsEnabled" type="checkbox" />
        Enable toasts
      </label>

      <label>
        Position
        <select v-model="notificationPosition">
          <option value="top-left">top-left</option>
          <option value="top-center">top-center</option>
          <option value="top-right">top-right</option>
          <option value="bottom-left">bottom-left</option>
          <option value="bottom-center">bottom-center</option>
          <option value="bottom-right">bottom-right</option>
        </select>
      </label>

      <label>
        Duration (ms)
        <input v-model.number="notificationDuration" type="number" min="500" step="250" />
      </label>

      <label>
        Max visible toasts
        <input v-model.number="notificationVisibleToasts" type="number" min="1" max="10" />
      </label>

      <label>
        <input v-model="notificationRichColors" type="checkbox" />
        Rich colors
      </label>

      <button @click="clearNotifyEvents">Clear event log</button>

      <h4>@notify event log</h4>
      <div v-if="notifyEvents.length === 0">No notifications yet.</div>
      <div v-for="(entry, index) in notifyEvents" :key="`${entry.at}-${index}`">
        <small>{{ entry.at }} · {{ entry.type }}</small>
        <div>{{ entry.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrayDriver } from 'vuefinder';
import type { DirEntry, NotifyPayload } from 'vuefinder';

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
  {
    storage: 'memory',
    dir: 'memory://docs',
    basename: 'readme.txt',
    extension: 'txt',
    path: 'memory://docs/readme.txt',
    type: 'file',
    file_size: 12,
    last_modified: Date.now(),
    mime_type: 'text/plain',
    visibility: 'public',
  },
]);

const driver = new ArrayDriver({
  files,
  storage: 'memory',
});

const notificationsEnabled = ref(true);
const notificationPosition = ref<
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
>('bottom-center');
const notificationDuration = ref(3000);
const notificationVisibleToasts = ref(4);
const notificationRichColors = ref(true);

const notifyEvents = ref<Array<NotifyPayload & { at: string }>>([]);

const config = computed(() => ({
  initialPath: 'memory://',
  persist: false,
  notificationsEnabled: notificationsEnabled.value,
  notificationPosition: notificationPosition.value,
  notificationDuration: Number(notificationDuration.value) || 3000,
  notificationVisibleToasts: Number(notificationVisibleToasts.value) || 4,
  notificationRichColors: notificationRichColors.value,
}));

const handleNotify = (payload: NotifyPayload) => {
  notifyEvents.value.unshift({
    ...payload,
    at: new Date().toLocaleTimeString(),
  });
  notifyEvents.value = notifyEvents.value.slice(0, 20);
};

const clearNotifyEvents = () => {
  notifyEvents.value = [];
};
</script>
```

## Notes

- `@notify` emits `{ type, message }` even when `notificationsEnabled` is `false`.
- `notificationsEnabled` controls only toast rendering.
- This is useful when you want to render notifications in your own custom UI.

See:

- [Guide - Configuration](../guide/configuration.md)
- [Guide - Events](../guide/events.md)
- [API Reference - Events](../api-reference/events.md)
