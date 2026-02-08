<template>
  <ClientOnly>
    <div v-if="driver" class="notifications-demo">
      <div class="notifications-demo__viewer">
        <vue-finder
          id="demo-notifications"
          :driver="driver"
          :config="config"
          @ready="initFinder"
          @notify="handleNotify"
        />
      </div>

      <div class="notifications-demo__bottom">
        <div class="notifications-demo__section">
          <div class="notifications-demo__section-header">
            <h3 class="notifications-demo__section-title">Notification Settings</h3>
          </div>

          <label class="notifications-demo__field notifications-demo__field--inline">
            <input v-model="notificationsEnabled" type="checkbox" />
            <span>Enable toasts</span>
          </label>

          <label class="notifications-demo__field">
            <span>Position</span>
            <select v-model="notificationPosition" class="notifications-demo__input">
              <option value="top-left">top-left</option>
              <option value="top-center">top-center</option>
              <option value="top-right">top-right</option>
              <option value="bottom-left">bottom-left</option>
              <option value="bottom-center">bottom-center</option>
              <option value="bottom-right">bottom-right</option>
            </select>
          </label>

          <label class="notifications-demo__field">
            <span>Duration (ms)</span>
            <input
              v-model.number="notificationDuration"
              class="notifications-demo__input"
              type="number"
              min="500"
              step="250"
            />
          </label>

          <label class="notifications-demo__field">
            <span>Max toasts</span>
            <input
              v-model.number="notificationVisibleToasts"
              class="notifications-demo__input"
              type="number"
              min="1"
              max="10"
            />
          </label>

          <label class="notifications-demo__field notifications-demo__field--inline">
            <input v-model="notificationRichColors" type="checkbox" />
            <span>Rich colors</span>
          </label>

          <button
            type="button"
            class="notifications-demo__clear-btn"
            @click="testNotification"
          >
            Test Notification
          </button>

          <button
            type="button"
            class="notifications-demo__clear-btn"
            :disabled="notifyEvents.length === 0"
            @click="notifyEvents = []"
          >
            Clear event log
          </button>
        </div>

        <div class="notifications-demo__info-section">
          <h3 class="notifications-demo__info-title">@notify event log</h3>
          <p class="notifications-demo__hint">
            Trigger file actions (rename/delete/create) from VueFinder UI to produce notifications.
          </p>
          <div v-if="notifyEvents.length === 0" class="notifications-demo__empty">
            No notifications yet.
          </div>
          <div
            v-for="(entry, index) in notifyEvents"
            :key="`${entry.at}-${index}`"
            class="notifications-demo__entry"
          >
            <small>{{ entry.at }} · {{ entry.type }}</small>
            <div>{{ entry.message }}</div>
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
import type { Driver, DirEntry, NotifyPayload } from 'vuefinder';

const driver = ref<Driver | null>(null);

const notificationsEnabled = ref(true);
const notificationPosition = ref<
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
>('bottom-center');
const notificationDuration = ref(3000);
const notificationVisibleToasts = ref(4);
const notificationRichColors = ref(true);
const notifyEvents = ref<Array<NotifyPayload & { at: string }>>([]);
const finder = ref<{ notify?: (type: NotifyPayload['type'], message: string) => void } | null>(null);

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

const initFinder = async () => {
  if (finder.value) return;
  try {
    const mod = await import('vuefinder');
    finder.value = mod.useVueFinder('demo-notifications') as typeof finder.value;
  } catch {
    finder.value = null;
  }
};

const testNotification = () => {
  if (finder.value?.notify) {
    finder.value.notify('success', 'Test notification from composable API');
    return;
  }

  // Fallback for docs when dist build is older than source API additions.
  handleNotify({
    type: 'info',
    message: 'Test notification (event log fallback)',
  });
};

onMounted(async () => {
  const { ArrayDriver } = await import('vuefinder');
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
  driver.value = new ArrayDriver({ files, storage: 'memory' });
});
</script>

<style scoped>
.notifications-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notifications-demo__viewer {
  min-height: 340px;
}

.notifications-demo__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.notifications-demo__section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
}

.notifications-demo__section-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.notifications-demo__section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.notifications-demo__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.8125rem;
}

.notifications-demo__field:first-of-type {
  margin-top: 0;
}

.notifications-demo__field--inline {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.notifications-demo__input {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  font-size: 0.75rem;
}

.notifications-demo__clear-btn {
  margin-top: 0.5rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;
  font-size: 0.75rem;
}

.notifications-demo__clear-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
}

.notifications-demo__clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notifications-demo__info-section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.notifications-demo__info-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.notifications-demo__hint {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

.notifications-demo__empty {
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
}

.notifications-demo__entry {
  padding: 0.45rem 0;
  border-top: 1px solid var(--vp-c-border);
  font-size: 0.8125rem;
}

@media (max-width: 1100px) {
  .notifications-demo__bottom {
    grid-template-columns: 1fr;
  }
}
</style>
