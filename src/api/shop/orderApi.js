// src/api/orderApi.js
import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

//取得訂單options
export const fetchOrderOptions = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/manage/shop/orders/options`
    });
    return response.data;

  } catch (error) {
    console.error("Error fetching order options:", error);
    return null;
  }
};

//取得所有訂單
export const fetchManageOrders = async (filters) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/manage/shop/orders`,
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

//取得單一訂單詳情
export const fetchManageOrderDetail = async (orderId) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${URL}/manage/shop/orders/${orderId}`,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

//更新訂單狀態

//刪除訂單