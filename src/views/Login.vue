<template>
  
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`, 
      {
        email: email.value,
        password: password.value
      },
      { withCredentials: true } // ✅ 確保攜帶 session
    );

    if (response.status === 200) {
      console.log('Login successful');
      router.push('/shop/');  // 成功後跳轉到首頁
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Login failed. Please try again.");
  }
};
</script>






