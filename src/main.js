// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';  // 引入 router
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia';

import '@fortawesome/fontawesome-free/css/all.css';

axios.defaults.withCredentials = true; // 設定攜帶 cookie

const app = createApp(App);
app.use(router);  // 使用 Vue Router
app.use(createPinia());

app.mount('#app');
