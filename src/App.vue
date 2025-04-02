<!-- src/App.vue -->
<template>
  <div>
    <HeaderIndex />
    <main>
      <router-view></router-view>
      <ChatRoom @open-image="openImage"></ChatRoom>
    </main>

    <!-- 全局圖片預覽 -->
    <div v-if="showPreview" class="image-modal" @click="closeImage">
      <img :src="'data:image/jpeg;base64,' + selectedImage" class="modal-img" />
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAdminStore } from './stores/adminStore'
import HeaderIndex from './components/HeaderIndex.vue';
import ChatRoom from './components/shop/ChatRoom.vue';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

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

// ============= 預覽圖片 =============
const showPreview = ref(false);
const selectedImage = ref(null);

// 接收子元件的圖片並顯示
const openImage = (image) => {
  selectedImage.value = image;
  showPreview.value = true;
};

// 關閉圖片預覽
const closeImage = () => {
  showPreview.value = false;
  selectedImage.value = null;
};

</script>

<style scoped>
@import '/admin_static/css/previewImage.css';
</style>
