// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';  // 引入 Home.vue
import Login from '@/views/Login.vue';
import ShopOrders from '@/views/shop/ShopOrders.vue';
import ShopProductReviews from '@/views/shop/ShopProductReviews.vue';

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
        path: '/manage/shop/productReviews',
        name: 'ShopProductReviews',
        component: ShopProductReviews
    },

    // 可以根據需要添加更多路由
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
