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

//更新單一訂單
export const updateOrder = async (orderId, modifiedOrder) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${URL}/manage/shop/orders/${orderId}/update`,
      data: modifiedOrder
    })

    return response.data;  // 回傳成功的回應資料
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;  // 這邊可以重新丟出錯誤，讓調用的地方處理
  }
};

//批量更新訂單狀態
export const UpdateBatchOrders = async (updatedOrders) => {

  try {
    const response = await axios({
      method: 'PUT',
      url: `${URL}/manage/shop/orders/updateBatch`,
      params: updatedOrders
    })

    return response.data;
  } catch (error) {
    console.error("批量更新訂單失敗:", error);
    throw error;
  }
};

//刪除訂單