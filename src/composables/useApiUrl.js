import { ref } from 'vue';

const apiUrl = ref('');
const curPath = ref('');
const rootPath = ref('');

export function useApiUrl() {
  function setApiUrl(url) {
    apiUrl.value = url;
  }

  function setCurPath(path) {
    curPath.value = path;
  }

  function setRootPath(path) {
    rootPath.value = path;
  }
  return { apiUrl, setApiUrl, curPath, setCurPath, rootPath, setRootPath };
}
