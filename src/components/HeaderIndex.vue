<template>
  <header class="header-index">
    <div id="main-wrapper">
      <!--**********************************
            Nav header start
        ***********************************-->
      <div class="nav-header">

        <div class="nav-header">
          <a href="http://localhost:5174/" class="brand-logo">
            <img class="logo-abbr" src="/admin_static/images/logo.png" alt="">
            <img class="logo-compact" src="/admin_static/images/logo-text.png" alt="">
            <img class="brand-title" src="/admin_static/images/logo-text.png" alt="">
          </a>
        </div>

        <div class="nav-control">
          <div class="hamburger">
            <span class="line"></span><span class="line"></span><span class="line"></span>
          </div>
        </div>


        <router-link to="/dashboard" class="brand-logo">
          <img class="logo-abbr" src="/admin_static/images/logo.png" alt="">
          <img class="logo-compact" src="/admin_static/images/logo-text.png" alt="">
          <img class="brand-title" src="/admin_static/images/logo-text.png" alt="">
        </router-link>

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
                      <input class="form-control" type="search" placeholder="Search" aria-label="Search" />
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
                            <p>
                              <strong>Martin</strong> has added a
                              <strong>customer</strong>
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
                            <p>
                              <strong>Jennifer</strong> purchased Light
                              Dashboard 2.0.
                            </p>
                          </a>
                        </div>
                        <span class="notify-time">3:20 am</span>
                      </li>
                    </ul>
                    <a class="all-notification" href="#">See all notifications <i class="ti-arrow-right"></i></a>
                  </div>
                </li>
                <li class="nav-item dropdown header-profile">
                  <a class="nav-link" href="#" role="button" data-toggle="dropdown">
                    <i class="mdi mdi-account"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a href="./app-profile.html" class="dropdown-item">
                      <i class="icon-user"></i>
                      <span class="ml-2">Profile </span>
                    </a>
                    <a href="./email-inbox.html" class="dropdown-item">
                      <i class="icon-envelope-open"></i>
                      <span class="ml-2">Inbox </span>
                    </a>
                    <a href="./page-login.html" class="dropdown-item">
                      <i class="icon-key"></i>
                      <span class="ml-2">Logout </span>
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

            <li><router-link to="/manage/members" class="has-arrow" href="javascript:void()" aria-expanded="false"><i
                  class="bi bi-people"></i><span class="nav-text">會員管理</span></router-link>
              <ul aria-expanded="false">
                <li><router-link to="/manage/members">會員列表</router-link></li>
              </ul>
            </li>

            <li><router-link to="/shop/dashboard" class="has-arrow" href="javascript:void()" aria-expanded="false"><i
                  class="bi bi-cart"></i><span class="nav-text">商城管理</span></router-link>
              <ul aria-expanded="false">

                <li><router-link to="/manage/shop/products">商品管理</router-link></li>

                <li><router-link to="/manage/shop/orders">訂單管理</router-link></li>

                <li><router-link to="/manage/shop/productReviews">商品評論管理</router-link></li>

                <li><router-link to="/manage/shop/coupons">優惠券管理</router-link></li>

              </ul>
            </li>

            <li>
              <router-link to="/manage/vendor" class="has-arrow" href="javascript:void()" aria-expanded="false"><i
                  class="bi bi-cart"></i><span class="nav-text">店家管理</span></router-link>
              <ul aria-expanded="false">
                <li><router-link to="/manage/vendor">店家列表</router-link></li>
                <li>
                  <router-link to="/manage/vendor/certification">認證申請管理</router-link>
                </li>
                <li>
                  <router-link to="/manage/vendor/friendly_shop">友善店家管理</router-link>
                </li>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdminStore } from "@/stores/adminStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const router = useRouter();
const adminStore = useAdminStore();

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const response = await axios.post(
          `${API_URL}/api/admin/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("登出請求成功:", response.data);
      } catch (error) {
        console.error("登出請求失敗:", error);
      }
    }

    // 清除 store 中的資訊
    adminStore.clearAdminInfo();
    console.log("已清除管理員資訊");

    // 清除本地存儲
    localStorage.removeItem("adminToken");
    console.log("已清除管理員令牌");

    // 顯示成功訊息
    await Swal.fire({
      icon: "success",
      title: "登出成功",
      text: "感謝您的使用",
      timer: 1500,
      showConfirmButton: false,
    });
    console.log("已顯示登出成功提示");

    // 使用 window.location 進行跳轉
    window.location.href = "/login";
    console.log("已跳轉到登入頁面");
  } catch (error) {
    console.error("登出過程發生錯誤:", error);
    // 即使發生錯誤，也要確保清除狀態並跳轉
    adminStore.clearAdminInfo();
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  }
};

// 在 onMounted 中獲取管理員資訊
onMounted(async () => {
  // 檢查是否有 token
  const token = localStorage.getItem("adminToken");
  if (token) {
    try {
      // 獲取管理員資訊
      await adminStore.fetchAdminInfo();
    } catch (error) {
      console.error("獲取管理員資訊失敗:", error);
      // 如果獲取失敗，清除 token
      localStorage.removeItem("adminToken");
    }
  }
});
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

/* 新增 brand-logo 樣式 */
.brand-logo {
  transform: scale(1.5);
  transform-origin: left center;
}
</style>
