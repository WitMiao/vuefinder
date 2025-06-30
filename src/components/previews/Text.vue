<template>
  <div class="flex">
    <div class="mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400" id="modal-title"
      :aria-label="selection?.item?.path" data-microtip-position="bottom-right" role="tooltip">
      {{ selection?.item?.basename }}
    </div>
    <div class="ml-auto mb-2">
     <div
        class="mx-1.5"
        :aria-label="fullScreen ? '收起': '展开'"
        data-microtip-position="bottom-left"
        role="tooltip"
        @click="setFullScreen"
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 md:h-6 md:w-6 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300"
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
  <div>
    <template v-if="!isFileToLarge">
      <!-- <pre
        v-if="!showEdit"
        class="p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
        >{{ content }}</pre
      > -->
      <div id="container" v-if="!showEdit" :style="{ height: !fullScreen ? '500px' : 'calc(100vh - 170px)' }"></div>
      <div v-else>
        <textarea ref="editInput" v-model="contentTemp"
          class="w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs"
          name="text" id="" cols="30" rows="10"></textarea>
      </div>
    </template>
    <message v-if="message.length" @hidden="message = ''" :error="isError">{{ message }}</message>
  </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { inject, nextTick, onMounted, ref } from 'vue';
import { useApiUrl } from '../../composables/useApiUrl';
import ajax from '../../utils/ajax';
import Message from '../Message.vue';

const emit = defineEmits(['load']);
const content = ref('');
const contentTemp = ref('');
const editInput = ref<HTMLTextAreaElement | null>(null);
const showEdit = ref(false);
const { apiUrl, curPath } = useApiUrl();
const { getStore } = inject('storage');
const props = defineProps({
  selection: Object,
});
const message = ref('');
const isError = ref(false);
const isFileToLarge = ref(false);
const { t } = inject('i18n');
const fullScreen = ref(false);
const emitter = inject('emitter') as VueEvents;
onMounted(() => {
  if (props.selection?.item?.file_size > 1024 * 1024 * 50) {
    message.value = t('The selected file exceeds the maximum preview file size, please download to preview.');
    emit('load');
    isFileToLarge.value = true;
  } else {
    ajax(props.selection?.item?.path as string, {
      json: false,
    }).then((data) => {
      content.value = data;

      monaco.editor.create(document.getElementById("container") as HTMLElement, {
        value: content.value,
        language: "python",
        automaticLayout: true,
        readOnly: true,
        roundedSelection: true,
        minimap: {
          enabled: false,
        },
      });

      emit('load');
    });
  }
});

const editMode = () => {
  showEdit.value = !showEdit.value;
  contentTemp.value = content.value;
  if (showEdit.value == true) {
    nextTick(() => {
      editInput.value?.focus();
    });
  }
};

const postData = inject('postData');
const setFullScreen = () => {
  fullScreen.value = !fullScreen.value;
  emitter.emit('vf-fullscreen-text-toggle');
};
const save = () => {
  message.value = '';
  isError.value = false;

  ajax(apiUrl.value, {
    method: 'POST',
    params: Object.assign(postData as Record<string, string>, {
      q: 'save',
      adapter: props.selection?.adapter,
      path: props.selection?.item?.path,
      content: contentTemp.value,
    }),
    json: false,
  })
    .then((data) => {

      message.value = t('Updated.');
      content.value = data;
      emit('load');
      showEdit.value = !showEdit.value;
    })
    .catch((e) => {
      message.value = t(e.message);
      isError.value = true;
    });
};
</script>