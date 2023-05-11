<template>
  <div class="vuefinder">
    <div :class="darkMode ? 'dark' : ''">
      <div
        :class="fullScreenMode ? 'fixed w-screen inset-0 z-20' : 'relative rounded-md'"
        :style="!fullScreenMode ? `max-height: ${maxHeight}` : ''"
        class="border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"
        @mousedown="emitter.emit('vf-contextmenu-hide')"
        @touchstart="emitter.emit('vf-contextmenu-hide')"
      >
        <v-f-toolbar :data="fetchData" />
        <v-f-breadcrumb :data="fetchData" />
        <v-f-explorer :view="view" :data="fetchData" />
        <v-f-statusbar :data="fetchData" />
      </div>

      <component v-if="modal.active" :is="'v-f-modal-' + modal.type" :selection="modal.data" :current="fetchData" />
      <v-f-context-menu :current="fetchData" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueFinder',
};
</script>

<script setup>
import mitt from 'mitt';
import { onMounted, provide, reactive, ref } from 'vue';
import VFBreadcrumb from '../components/Breadcrumb.vue';
import VFContextMenu from '../components/ContextMenu.vue';
import VFExplorer from '../components/Explorer.vue';
import VFStatusbar from '../components/Statusbar.vue';
import VFToolbar from '../components/Toolbar.vue';
import { useApiUrl } from '../composables/useApiUrl.js';
import { useI18n } from '../composables/useI18n.js';
import { useStorage } from '../composables/useStorage.js';
import ajax from '../utils/ajax.js';
import { downloadByUrl } from '../utils/download.js';
const props = defineProps({
  url: {
    type: [String],
  },
  id: {
    type: String,
    default: 'vf',
  },
  dark: {
    type: Boolean,
    default: false,
  },
  locale: {
    type: String,
    default: 'en',
  },
  maxHeight: {
    type: String,
    default: '600px',
  },
  maxFileSize: {
    type: String,
    default: '10mb',
  },
  postData: {
    type: Object,
    default: {},
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});
const emitter = mitt();
const { setStore, getStore } = useStorage(props.id);
const adapter = ref(getStore('adapter'));

provide('emitter', emitter);
provide('storage', useStorage(props.id));
provide('postData', props.postData);
provide('adapter', adapter);
provide('maxFileSize', props.maxFileSize);

// Lang Management
const i18n = useI18n(props.id, props.locale, emitter);
const { t } = i18n;
provide('i18n', i18n);

const { apiUrl, setApiUrl } = useApiUrl();
setApiUrl(props.url);
const apiPrefix = '/uploads';
const curPath = ref(apiUrl.value);

const fetchData = reactive({ adapter: adapter.value, storages: [], dirname: '.', files: [] });

// View Management
const view = ref(getStore('viewport', 'grid'));
const darkMode = ref(getStore('darkMode', props.dark));

emitter.on('vf-darkMode-toggle', () => {
  darkMode.value = !darkMode.value;
  setStore('darkMode', darkMode.value);
});

const loadingState = ref(false);

provide('loadingState', loadingState);

const fullScreenMode = ref(getStore('full-screen', props.fullScreen));

emitter.on('vf-fullscreen-toggle', () => {
  fullScreenMode.value = !fullScreenMode.value;
  setStore('full-screen', fullScreenMode.value);
});

emitter.on('vf-view-toggle', (newView) => {
  view.value = newView;
});

// Modal Management
const modal = reactive({
  active: false,
  type: 'delete',
  data: {},
});

emitter.on('vf-modal-close', () => {
  modal.active = false;
});

emitter.on('vf-modal-show', (item) => {
  modal.active = true;
  modal.type = item.type;
  modal.data = item;
});

const updateItems = (data) => {
  Object.assign(fetchData, data);
  emitter.emit('vf-nodes-selected', {});
  emitter.emit('vf-explorer-update');
};

let controller;
emitter.on('vf-fetch-abort', () => {
  controller.abort();
  loadingState.value = false;
});

function parseFileList(html) {
  // Create an empty file list
  const fileList = [];

  // Use a regular expression to match all <a> tags in the string
  const matches = html.matchAll(/<a href="(.+?)">(.+?)<\/a>/g);

  // Iterate over the matches, extract each file's properties, and add it to the file list
  for (const match of matches) {
    const filePath = match[1];
    const fileName = match[2];
    const fileType = fileName.includes('.') ? fileName.split('.').pop() : 'dir';
    const fileProps = {
      type: fileType === 'dir' ? 'dir' : 'file',
      basename: fileType === 'dir' ? fileName.split('/')[0] : fileName,
      path: filePath,
      extension: fileType === 'dir' ? '' : fileType,
    };
    fileList.push(fileProps);
  }

  return fileList;
}

emitter.on('vf-fetch', ({ params, onSuccess = null, onError = null }) => {
  let curUrl = apiUrl.value + '';
  if (['index', 'search'].includes(params.q)) {
    if (controller) {
      controller.abort();
    }
    loadingState.value = true;
    if (params.path === adapter.value + '://' || (adapter.value && !params.path)) {
      curUrl = `${apiPrefix}/${adapter.value}/`;
    } else if (params.path?.startsWith('/')) {
      curUrl = apiPrefix + params.path;
    } else {
      curUrl = curPath.value + (params.path || '');
    }
    curPath.value = curUrl;
  }
  controller = new AbortController();
  const signal = controller.signal;
  ajax(curUrl, { params, signal })
    .then((res) => {
      const dirname = curUrl.replace(apiPrefix, '');
      adapter.value = dirname.split('/')[1];
      if (['index', 'search'].includes(params.q)) {
        loadingState.value = false;
      }
      // 获取testData中的文件夹和文件
      const files = parseFileList(res);
      const getData = { adapter: adapter.value, storages: [], dirname, files };
      emitter.emit('vf-modal-close');
      updateItems(getData);
      onSuccess(getData);
    })
    .catch((e) => {
      if (onError) {
        onError(e);
      }
    })
    .finally(() => {});
});

emitter.on('vf-download', (path) => {
  console.log('curPath.value + path: ', curPath.value + path);
  downloadByUrl(curPath.value + path);
  emitter.emit('vf-modal-close');
});

onMounted(() => {
  emitter.emit('vf-fetch', { params: { q: 'index', adapter: adapter.value } });
});
</script>
