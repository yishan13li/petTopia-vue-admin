// src/api/orderApi.js
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

//取得所有訂單
export const fetchManageOrders = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/manage/shop/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  //取得單一訂單詳情

  //更新訂單狀態

  //刪除訂單