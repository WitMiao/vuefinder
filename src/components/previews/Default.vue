<template>
  <div class="flex">
    <h3 class="mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400" id="modal-title"
         :title="app.modal.data.item.path">{{ app.modal.data.item.basename }}</h3>
  </div>
  <div></div>
</template>

<script setup>

import {onMounted, inject} from 'vue';

const app = inject('ServiceContainer');

const emit = defineEmits(['success']);

onMounted(() => {
  emit('success');
});
</script>
