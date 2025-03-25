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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminStore } from './stores/adminStore'

import HeaderIndex from './components/HeaderIndex.vue';
const route=useRoute();

const adminStore = useAdminStore()

// 根據path 決定顯示哪一個 header
const currentHeader = computed(() => {
  if (route.path.startsWith('/shop')) {
    return HeaderShop;  // 顯示 HeaderShop
  }
  return HeaderIndex;  // 顯示 HeaderIndex
});

onMounted(async () => {
  // 檢查是否有 token
  const token = localStorage.getItem('adminToken')
  if (token) {
    try {
      // 獲取管理員資訊
      await adminStore.fetchAdminInfo()
    } catch (error) {
      console.error('獲取管理員資訊失敗:', error)
      // 如果獲取失敗，清除 token
      localStorage.removeItem('adminToken')
    }
  }
})
</script>

<style scoped>

</style>
