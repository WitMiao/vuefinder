<template>
  <div ref="textRef" class="flex items-center" v-bind="$attrs">
    <span ref="ellipsisTextRef" class="inline-block truncate">
      {{ text.slice(0, -getSliceNumber(text)) }}
    </span>
    <bdi dir="rtl" class="inline-block overflow-hidden whitespace-nowrap">
      <bdi dir="ltr" style="margin-left: 4px;">{{ text.slice(-getSliceNumber(text)) }}</bdi>
    </bdi>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineOptions({
  name: 'EllipsisMiddle',
});

defineProps({
  text: {
    type: String,
    required: true,
  },

});

const tippyFunc = ref();
const textRef = ref();
const ellipsisTextRef = ref();

// 获取截取的字符数
function getSliceNumber(str: string) {
  const num = Math.floor((str?.length || 3) / 3);

  return num > 0 ? num : 1;
}


</script>
