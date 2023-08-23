<template>
  <div class="my-container">
    <vue-finder
      id="vue-finder"
      :url="testUrl"
      locale="zh-cn"
      maxHeight="100vh"
      class="finder"
      :api="api"
      :token="token"
    ></vue-finder>
  </div>
</template>

<script lang="ts" setup>
const testUrl = 'uploads/xxx';
const api = '/api/xxx';
const token = 'xxx';
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
