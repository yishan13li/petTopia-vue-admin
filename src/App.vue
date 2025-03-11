<!-- src/App.vue -->
<template>
  <div>
<component :is="currentHeader"></component>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import HeaderIndex from './components/HeaderIndex.vue';
const route=useRoute();

// 根據path 決定顯示哪一個 header
const currentHeader = computed(() => {
  if (route.path.startsWith('/shop')) {
    return HeaderShop;  // 顯示 HeaderShop
  }
  return HeaderIndex;  // 顯示 HeaderIndex
});

</script>

<style scoped>

</style>
