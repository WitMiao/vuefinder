<template>
  <ClientOnly>
    <div class="window-demo">
      <div class="window-demo__section">
        <div class="window-demo__section-header">
          <h3 class="window-demo__section-title">Window Example</h3>
        </div>
        <p class="window-demo__description">
          Open VueFinder in a dedicated popup route, select files there, then send selection back to this page.
        </p>
        <button type="button" class="window-demo__btn" @click="openPopupWindow">
          Open VueFinder in Popup
        </button>
      </div>

      <div class="window-demo__info-section">
        <h3 class="window-demo__info-title">
          Selected Files From Popup ({{ filesFromPopup.length }})
        </h3>
        <div v-if="filesFromPopup.length === 0" class="window-demo__empty">
          No files received yet.
        </div>
        <div v-for="file in filesFromPopup" :key="file.path" class="window-demo__selection-item">
          <strong class="window-demo__selection-name">{{ file.name }}</strong>
          <small class="window-demo__selection-path">{{ file.path }}</small>
        </div>
      </div>
    </div>
    <template #fallback>
      <div style="padding: 2rem; text-align: center; color: #6b7280">Loading demo...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const filesFromPopup = ref<Array<{ path: string; name?: string }>>([]);

const openPopupWindow = () => {
  const url = new URL(`${import.meta.env.BASE_URL}examples/window-picker`, window.location.origin);
  window.open(url.toString(), 'vuefinder-window-demo', 'width=980,height=680,scrollbars=yes,resizable=yes');
};

const handleMessage = (event: MessageEvent) => {
  if (event.data?.type !== 'window-demo-files-selected') return;
  filesFromPopup.value = Array.isArray(event.data.files) ? event.data.files : [];
};

onMounted(async () => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped>
.window-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.window-demo__section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid #0ea5e9;
  border-radius: 8px;
}

.window-demo__section-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.window-demo__section-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.window-demo__description {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.window-demo__btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.window-demo__btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
}

.window-demo__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.window-demo__info-section {
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.window-demo__info-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.window-demo__empty {
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.75rem;
}

.window-demo__selection-item {
  padding: 0.375rem 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  margin-bottom: 0.25rem;
}

.window-demo__selection-name {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
}

.window-demo__selection-path {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.625rem;
  color: var(--vp-c-text-2);
}
</style>
