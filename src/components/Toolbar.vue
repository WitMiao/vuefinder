<template>
  <div class="border-neutral-300 flex justify-end items-center py-1 text-sm">
    <div class="flex text-center items-center justify-end">
      <div
        class="mx-1.5"
        :aria-label="t('Toggle Full Screen')"
        data-microtip-position="bottom-left"
        role="tooltip"
        @click="setFullScreen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="none"
          stroke-width="1.5"
        >
          <path
            v-if="fullScreen"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFToolbar',
};
</script>

<script setup>
import { inject, ref } from 'vue';

const emitter = inject('emitter');

const usePropDarkMode = inject('usePropDarkMode');

const { getStore, setStore } = inject('storage');

const { t } = inject('i18n');

const view = ref(getStore('viewport', 'grid'));

const selectedItems = ref([]);

const fullScreen = ref(getStore('full-screen', false));

const props = defineProps({
  data: Object,
});

const searchQuery = ref('');

emitter.on('vf-search-query', ({ newQuery }) => {
  searchQuery.value = newQuery;
});

const loadingState = inject('loadingState');
const isLoading = () => loadingState.value;

const setFullScreen = () => {
  fullScreen.value = !fullScreen.value;
  emitter.emit('vf-fullscreen-toggle');
};

emitter.on('vf-nodes-selected', (items) => {
  selectedItems.value = items;
});

emitter.on('vf-view-toggle', (newView) => {
  setStore('viewport', newView);
  view.value = newView;
});
</script>
