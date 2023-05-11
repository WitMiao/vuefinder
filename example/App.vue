<template>
  <div class="my-container">
    <vue-finder id="vue-finder" :url="testUrl" locale="zh-cn" maxHeight="100vh" class="finder"></vue-finder>
  </div>
</template>

<script lang="ts" setup>
const testUrl = '/uploads/feedback/60f45368b31459e112a21da9b1a1359e_05111125/';
</script>

<style>
.my-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.finder {
  width: 50%;
}
</style>
