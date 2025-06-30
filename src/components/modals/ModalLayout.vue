<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="v-f-modal relative z-30"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    @keyup.esc="emitter.emit('vf-modal-close')"
    tabindex="0"
  >
    <div class="fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity"></div>

    <div class="fixed z-10 inset-0 overflow-hidden">
      <div
        class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
        @mousedown.self="emitter.emit('vf-modal-close')"
      >
        <div
          class="relative bg-white dark:bg-gray-800  text-left overflow-hidden shadow-xl transform transition-all w-full"
          :class="{ 'max-w-100%': fullScreen, 'sm:max-w-4xl md:max-w-2xl sm:my-8 rounded-lg': !fullScreen }"
        >
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <slot />
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <slot name="buttons" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';

const emitter = inject('emitter');
const { setStore, getStore } = inject('storage');
const fullScreen = ref(false);
onMounted(() => {
  const inputElements = document.querySelector('.v-f-modal input');
  if (inputElements) {
    inputElements.focus();
  }
});
emitter.on('vf-fullscreen-text-toggle', () => {
  fullScreen.value = !fullScreen.value;
});
</script>
