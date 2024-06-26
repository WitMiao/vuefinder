<template>
  <ModalLayout>
    <div>
      <ModalHeader :icon="MoveSVG" :title="t('Move files')"></ModalHeader>
      <div class="mt-3 text-center sm:mt-0 sm:text-left w-full ">
        <p class="text-sm text-gray-500 pb-1">{{ t('Are you sure you want to move these files?') }}</p>
        <div class="max-h-[200px] overflow-y-auto vf-scrollbar text-left">
          <div v-for="node in items" class="flex text-sm text-gray-800 dark:text-gray-400">
            <div>
             <svg v-if="node.type === 'dir'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-1.5">{{ node.path }}</div>
          </div>
        </div>
          <h4 class="font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider">{{ t('Target Directory') }}</h4>
          <p class="flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            <span class="ml-1.5 overflow-auto">{{ app.modal.data.items.to.path }}</span>
          </p>
          <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
      </div>
    </div>


    <template v-slot:buttons>
      <button type="button" @click="move" class="vf-btn vf-btn-primary">
        {{ t('Yes, Move!') }}</button>
      <button type="button" @click="app.modal.close()" class="vf-btn vf-btn-secondary">
        {{ t('Cancel') }}</button>

      <div class="m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center">
        {{ t('%s item(s) selected.', items.length) }}
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from './ModalLayout.vue';
import {inject, ref} from 'vue';
import Message from '../Message.vue';
import ModalHeader from "./ModalHeader.vue";
import MoveSVG from "../icons/move.svg";

const app = inject('ServiceContainer');
const {t} = app.i18n;

const items = ref(app.modal.data.items.from);
const message = ref('');

const move = () => {

  if (items.value.length) {
    app.emitter.emit('vf-fetch', {
      params: {
        q: 'move',
        m: 'post',
        adapter: app.fs.adapter,
        path: app.fs.data.dirname,
      },
      body: {
        items: items.value.map(({path, type}) => ({path, type})),
        item: app.modal.data.items.to.path
      },
      onSuccess: () => {
        app.emitter.emit('vf-toast-push', {label: t('Files moved.', app.modal.data.items.to.name)});
      },
      onError: (e) => {
        message.value = t(e.message);
      }
    });
  }
};

</script>
