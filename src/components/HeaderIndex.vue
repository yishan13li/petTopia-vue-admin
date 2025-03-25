<template>
<header class="header-index">

  <div id="main-wrapper">

            <!--**********************************
            Nav header start
        ***********************************-->
        <div class="nav-header">
            <div class="nav-header">
                <router-link to="/dashboard" class="brand-logo">
                    <img class="logo-abbr" src="/admin_static/images/logo.png" alt="">
                    <img class="logo-compact" src="/admin_static/images/logo-text.png" alt="">
                    <img class="brand-title" src="/admin_static/images/logo-text.png" alt="">
                </router-link>
            </div>

            <div class="nav-control">
                <div class="hamburger">
                    <span class="line"></span><span class="line"></span><span class="line"></span>
                </div>
            </div>
        </div>

        <!--**********************************
            Header start
        ***********************************-->
        <div class="header">
            <div class="header-content">
                <nav class="navbar navbar-expand">
                    <div class="collapse navbar-collapse justify-content-between">
                        <div class="header-left">
                            <div class="search_bar dropdown">
                                <span class="search_icon p-3 c-pointer" data-toggle="dropdown">
                                    <i class="mdi mdi-magnify"></i>
                                </span>
                                <div class="dropdown-menu p-0 m-0">
                                    <form>
                                        <input class="form-control" type="search" placeholder="Search"
                                            aria-label="Search">
                                    </form>
                                </div>
                            </div>
                        </div>

                        <ul class="navbar-nav header-right">
                            <li class="nav-item dropdown notification_dropdown">
                                <a class="nav-link" href="#" role="button" data-toggle="dropdown">
                                    <i class="mdi mdi-bell"></i>
                                    <div class="pulse-css"></div>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <ul class="list-unstyled">
                                        <li class="media dropdown-item">
                                            <span class="success"><i class="ti-user"></i></span>
                                            <div class="media-body">
                                                <a href="#">
                                                    <p><strong>Martin</strong> has added a <strong>customer</strong>
                                                        Successfully
                                                    </p>
                                                </a>
                                            </div>
                                            <span class="notify-time">3:20 am</span>
                                        </li>
                                        <li class="media dropdown-item">
                                            <span class="primary"><i class="ti-shopping-cart"></i></span>
                                            <div class="media-body">
                                                <a href="#">
                                                    <p><strong>Jennifer</strong> purchased Light Dashboard 2.0.</p>
                                                </a>
                                            </div>
                                            <span class="notify-time">3:20 am</span>
                                        </li>
                                    </ul>
                                    <a class="all-notification" href="#">See all notifications <i
                                            class="ti-arrow-right"></i></a>
                                </div>
                            </li>
                            <li class="nav-item dropdown header-profile">
                                <a class="nav-link" href="javascript:void()" role="button" data-bs-toggle="dropdown">
                                    <div class="header-info">
                                        <img src="/admin_static/images/profile/profile.png" alt="管理員頭像">
                                        <div class="header-details">
                                            <h5>{{ adminStore.getAdminName }}</h5>
                                            <span>{{ adminStore.getAdminRole }}</span>
                                        </div>
                                    </div>
                                </a>
                                <div class="dropdown-menu dropdown-menu-end">
                                    <a href="javascript:void()" class="dropdown-item" @click="handleLogout">
                                        <i class="bi bi-box-arrow-right"></i> 登出
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>


        <!--**********************************
            Sidebar start
        ***********************************-->
        <div class="quixnav">
            <div class="quixnav-scroll">
                <ul class="metismenu" id="menu">
                    <li class="nav-label first">Main Menu</li>

                    <li><router-link to="/manage/shop/orders" class="has-arrow" href="javascript:void()" aria-expanded="false"><i
                                class="bi bi-cart"></i><span class="nav-text">商城管理</span></router-link>
                        <ul aria-expanded="false">
                            <li><router-link to="/manage/shop/products">商品列表</router-link></li>
                            <li><router-link to="/manage/shop/inventory">庫存管理</router-link></li>
                            <li><router-link to="/manage/shop/orders">訂單管理</router-link></li>
                            <li><router-link to="/manage/shop/coupons">優惠券管理</router-link></li>
                            <li><router-link to="/manage/shop/customer-service">客服管理</router-link></li>
                            <li><router-link to="/manage/shop/reports">報表分析</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-label"></li>
                </ul>
            </div>
        </div>
      </div>

</header>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter();
const adminStore = useAdminStore()

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    if (token) {
      await axios.post(`${API_URL}/api/admin/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
    
    // 清除 store 中的資訊
    adminStore.clearAdminInfo()
    
    // 清除本地存儲
    localStorage.removeItem('adminToken')
    
    // 跳轉到登入頁
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// 在 onMounted 中獲取管理員資訊
onMounted(async () => {
  await adminStore.fetchAdminInfo()
})
</script>
<style scoped>
.header-profile .nav-link {
    display: flex;
    align-items: center;
    color: #333;
    text-decoration: none;
}

.dropdown-menu {
    min-width: 200px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    color: #333;
    text-decoration: none;
    transition: background-color 0.3s;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.dropdown-item i {
    margin-right: 0.5rem;
    font-size: 1.1rem;
}
</style>