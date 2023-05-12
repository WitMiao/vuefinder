import { ref } from 'vue';

const apiUrl = ref('');
const curPath = ref('');
const apiPrefix = '/uploads';

export function useApiUrl() {
  function setApiUrl(url) {
    apiUrl.value = url;
  }

  function setCurPath(path) {
    curPath.value = path;
  }
  return { apiUrl, setApiUrl, curPath, setCurPath, apiPrefix };
}
