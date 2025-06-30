<template>
  <div class="vuefinder" ref="root">
    <div :class="darkMode ? 'dark' : ''">
      <div
        :class="fullScreenMode ? 'fixed w-screen inset-0 z-20' : 'relative rounded-md'"
        :style="!fullScreenMode ? `max-height: ${maxHeight}` : ''"
        class="border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"
        @mousedown="emitter.emit('vf-contextmenu-hide')"
        @touchstart="emitter.emit('vf-contextmenu-hide')"
      >
        <v-f-toolbar :data="fetchData" v-if="showToolbar" />
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
import { computed, onMounted, provide, reactive, ref } from 'vue';
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
  api: {
    type: [String],
  },
  token: {
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
  usePropDarkMode: {
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
  showToolbar: {
    type: Boolean,
    default: true,
  },
});
const emitter = mitt();
const { setStore, getStore } = useStorage(props.id);
const adapter = ref(getStore('adapter'));
const root = ref(null);
provide('root', root);
provide('emitter', emitter);
provide('storage', useStorage(props.id));
provide('postData', props.postData);
provide('adapter', adapter);
provide('maxFileSize', props.maxFileSize);
provide('usePropDarkMode', props.usePropDarkMode);

// Lang Management
const i18n = useI18n(props.id, props.locale, emitter);
const { t } = i18n;
provide('i18n', i18n);

const { apiUrl, setApiUrl, curPath, setCurPath, rootPath, setRootPath } = useApiUrl();

setApiUrl(props.api);
setCurPath(props.url);
setRootPath(props.url.split('/').slice(0, -2).join('/'));
const fetchData = reactive({ adapter: adapter.value, storages: [], dirname: '.', files: [] });

// View Management
const view = ref(getStore('viewport', 'grid'));
const darkMode = props.usePropDarkMode ? computed(() => props.dark) : ref(getStore('darkMode', props.dark));

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

function parseFileList(list) {
  // Create an empty file list
  const fileList = [];
  // Iterate recursively through the file list
  list.forEach((e) => {
    const filePath = e.path;
    const fileName = e.name;
    const fileType = e.type === 'dir' ? 'dir' : fileName.split('.').pop();
    let mime_type = '';
    switch (fileType) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        mime_type = 'image';
        break;
      case 'mp3':
      case 'wav':
      case 'ogg':
        mime_type = 'audio';
        break;
      case 'mp4':
      case 'webm':
      case 'mov':
      case 'avi':
      case 'wmv':
      case 'mpg':
      case 'mpeg':
        mime_type = 'video';
        break;
      case 'pdf':
        mime_type = 'application/pdf';
        break;
      case 'zip':
        mime_type = 'application/zip';
        break;
      case 'dir':
        mime_type = 'dir';
        break;
      case 'txt':
      case 'md':
      case 'py':
      case 'log':
      case 'json':
        mime_type = 'text';
        break;
      default:
        mime_type = 'file';
    }
    const fileProps = {
      type: e.type,
      basename: fileType === 'dir' ? fileName.split('/')[0] : fileName,
      path: fileType === 'dir' ? filePath + '/' : filePath,
      extension: fileType === 'dir' ? '' : fileType,
      mime_type,
      file_size: e.size,
      last_modified: e.time,
    };
    fileList.push(fileProps);
  });
  return fileList;
}

emitter.on('vf-fetch', ({ params, onSuccess = null, onError = null }) => {
  let curUrl = curPath.value + '';
  if (['index', 'search'].includes(params.q)) {
    if (controller) {
      controller.abort();
    }
    loadingState.value = true;
    params.path = params.path
      ? params.path?.startsWith(rootPath.value)
        ? params.path
        : rootPath.value + params.path
      : curUrl;
    setCurPath(params.path);
  }
  controller = new AbortController();
  const signal = controller.signal;
  ajax(apiUrl.value, { params, signal, token: props.token })
    .then((res) => {
      const result = JSON.parse(res);
      if (result?.code !== 0) {
        emitter.emit('vf-toast-push', {
          label: t('No permission'),
        });
        return;
      }
      const dirname = params.path.replace(rootPath.value, '');
      adapter.value = dirname.split('/')[1];
      if (['index', 'search'].includes(params.q)) {
        loadingState.value = false;
      }
      // 获取testData中的文件夹和文件
      const files = parseFileList(result?.data?.data);
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
  downloadByUrl({ url: path });
});

onMounted(() => {
  emitter.emit('vf-fetch', { params: { q: 'index', adapter: adapter.value } });
});
</script>
