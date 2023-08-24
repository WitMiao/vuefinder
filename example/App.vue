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
const testUrl = 'uploads/feedback/ac606427e43bf6c6f96d75d1a835cbff_08231127/';
const api = '/api/v1/crash/path';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVVUlEIjoiNDZjY2YxNGMtMDM1OC00MDliLTk5YTYtZTIzOWY1OTY1M2I4IiwiSUQiOjEsIlVzZXJuYW1lIjoiYWRtaW4iLCJOaWNrTmFtZSI6IueuoeeQhuWRmCIsIkF1dGhvcml0eUlkIjoiMTAyNCIsIkJ1ZmZlclRpbWUiOjg2NDAwLCJleHAiOjE2OTMzNzc0OTYsIm5iZiI6MTY5MjI1MzI1MH0.a5nYvbjGWScte5R6sxTMHFR792_GHIrTNqqgJWoLS3w';
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
