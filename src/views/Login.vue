<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>PetTopia 後台管理系統</h2>
        <p>管理員登入</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">
            <i class="bi bi-envelope"></i> 電子郵件
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="請輸入電子郵件"
          />
        </div>
        <div class="form-group">
          <label for="password">
            <i class="bi bi-lock"></i> 密碼
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="請輸入密碼"
          />
        </div>
        <button type="submit" class="login-btn">
          <i class="bi bi-box-arrow-in-right"></i> 登入
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    // 先檢查是否需要初始化 SA 帳號
    if (email.value === 'sa@pettopia.com' && !localStorage.getItem('sa_initialized')) {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/init-sa`);
      localStorage.setItem('sa_initialized', 'true');
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/login`,
      {
        email: email.value,
        password: password.value
      },
      { withCredentials: true }
    );

    if (response.status === 200 && response.data.token) {
      // 儲存 token
      localStorage.setItem('admin_token', response.data.token);
      // 儲存管理員資訊
      localStorage.setItem('admin_info', JSON.stringify({
        id: response.data.adminId,
        email: response.data.email,
        role: response.data.role
      }));

      await Swal.fire({
        icon: 'success',
        title: '登入成功！',
        text: '歡迎回來，管理員',
        timer: 1500,
        showConfirmButton: false
      });

      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      text: error.response?.data?.error || '請檢查您的帳號密碼是否正確',
    });
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #7f8c8d;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #34495e;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
}

.login-btn {
  background: #3498db;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover {
  background: #2980b9;
}
</style>






