<!-- src/App.vue -->
<template>
  <div>
    <HeaderIndex />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from './stores/adminStore'
import HeaderIndex from './components/HeaderIndex.vue';

const adminStore = useAdminStore()

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
