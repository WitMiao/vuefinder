<template>
  <div class="p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none">
    <div class="flex leading-5 items-center">
      <div class="ml-3">
        <span v-if="searchQuery.length">{{ data.files.length }} items found. </span>
        <span class="ml-1">{{ selectedItemCount > 0 ? selectedItemCount + ' ' + t('item(s) selected.') : '' }}</span>
      </div>
    </div>
    <div class="flex leading-5 items-center">
      <select
        v-model="locale"
        @change="changeLocale($event.target.value)"
        class="py-0.5 text-sm text-slate-500 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8 mr-3"
      >
        <option value="" disabled>{{ t('Language') }}</option>
        <option value="zh-cn">Chinese</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="fa">Persian</option>
        <option value="ru">Russian</option>
        <option value="tr">Turkish</option>
        <option value="tr">Hebrew</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFStatusbar',
};
</script>

<script setup>
import { inject, ref } from 'vue';

const props = defineProps({
  data: Object,
});

const emitter = inject('emitter');
const { getStore, setStore } = inject('storage');
const selectedItemCount = ref(0);
const adapter = inject('adapter');

const { t, changeLocale } = inject('i18n');

const locale = ref(getStore('locale', ''));

const handleStorageSelect = () => {
  emitter.emit('vf-search-exit');
  emitter.emit('vf-fetch', { params: { q: 'index', adapter: adapter.value } });
  setStore('adapter', adapter.value);
};

emitter.on('vf-nodes-selected', (items) => {
  selectedItemCount.value = items.length;
});

const searchQuery = ref('');

emitter.on('vf-search-query', ({ newQuery }) => {
  searchQuery.value = newQuery;
});
</script>
