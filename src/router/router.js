// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';  // 引入 Home.vue
import Login from '@/views/Login.vue';
import ShopOrders from '@/views/shop/ShopOrders.vue';


import ManageVendor from '@/views/vendor/ManageVendor.vue';
import ManageCertification from '@/views/vendor/ManageCertification.vue';


import ShopProducts from '@/views/shop/ShopProducts.vue';


const routes = [
    {
        path: '/',       // 當用戶訪問根路徑 (/) 時，顯示 Home 頁面
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/manage/shop/orders',
        name: 'ShopOrders',
        component: ShopOrders
    },
    {
        path: '/manage/shop/products',
        name: 'ShopProducts',
        component: ShopProducts
    },
    {
        path: '/manage/vendor/certification',
        name: 'ManageCertification',
        component: ManageCertification
    },
    {
        path: '/manage/vendor',
        name: 'ManageVendor',
        component: ManageVendor
    },
    {
        path: '/manage/shop/products',
        name: 'ShopProducts',
        component: ShopProducts
    },

    // 可以根據需要添加更多路由
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
