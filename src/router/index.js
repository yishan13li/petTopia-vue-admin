import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "../stores/adminStore";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import ShopProducts from "@/views/shop/ShopProducts.vue";
import ShopOrders from "@/views/shop/ShopOrders.vue";
import ShopProductReviews from "@/views/shop/ShopProductReviews.vue";

import MemberManagement from "@/views/member/MemberManagement.vue";
import CouponManagement from "@/views/shop/CouponManagement.vue";
import PlaceholderPage from "@/components/PlaceholderPage.vue";
import ManageVendor from "@/views/vendor/ManageVendor.vue";
import ManageCertification from "@/views/vendor/ManageCertification.vue";
import FriendlyShop from "@/views/vendor/FriendlyShop.vue";
const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/members",
    name: "MemberManagement",
    component: MemberManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/products",
    name: "ShopProducts",
    component: ShopProducts,
    props: { title: "商品管理" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/orders",
    name: "ShopOrders",
    component: ShopOrders,
    props: { title: "訂單管理" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/productReviews",
    name: "ShopProductReviews",
    component: ShopProductReviews,
    props: { title: "庫存管理" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/coupons",
    name: "Coupons",
    component: CouponManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/customer-service",
    name: "CustomerService",
    component: PlaceholderPage,
    props: { title: "客服管理" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/shop/reports",
    name: "Reports",
    component: PlaceholderPage,
    props: { title: "報表分析" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/vendor/certification",
    name: "ManageCertification",
    component: ManageCertification,
    props: { title: "認證申請" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/vendor",
    name: "ManageVendor",
    component: ManageVendor,
    props: { title: "店家管理" },
    meta: { requiresAuth: true },
  },
  {
    path: "/manage/vendor/friendly_shop",
    name: "FriendlyShop",
    component: FriendlyShop,
    props: { title: "友善店家" },
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const adminStore = useAdminStore();
  const token = localStorage.getItem("adminToken");

  // 如果路由需要認證
  if (to.meta.requiresAuth) {
    // 如果有 token
    if (token) {
      // 如果還沒有獲取管理員資訊，先獲取
      if (!adminStore.isAuthenticated) {
        try {
          await adminStore.fetchAdminInfo();
        } catch (error) {
          console.error("獲取管理員資訊失敗:", error);
          localStorage.removeItem("adminToken");
          next("/login");
          return;
        }
      }
      next();
    } else {
      next("/login");
    }
  } else {
    // 如果路由不需要認證（如登入頁）
    if (token && adminStore.isAuthenticated) {
      // 如果已經登入，重定向到儀表板
      next("/dashboard");
    } else {
      next();
    }
  }
});

export default router;
