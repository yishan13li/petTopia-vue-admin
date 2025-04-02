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

    if (response.status === 204) {
      return { status: 204 };  
    }

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

// 刪除訂單
export const deleteOneOrder = async (orderId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${URL}/manage/shop/orders/${orderId}/delete`,  
    });
    return response.data; 
  } catch (error) {
    console.error('Error deleting order:', error);
    return null;  
  }
};

//銷量最好的已完成訂單商品
export const getTop5BestSellingProducts = async () => {
  try {
    const response = await axios.get(`${URL}/manage/shop/orders/top5BestSellingProducts`);
    return response.data; // 返回 API 回傳的數據
  } catch (error) {
    console.error('Error fetching top 5 best selling products:', error);
    throw error; // 重新拋出錯誤，讓呼叫方處理
  }
};

//每日、每月、每年銷售額
export async function getSalesData() {
  try {
      const response = await axios.get(`${URL}/manage/shop/orders/sales`);
      return response.data;
  } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
  }
}

//商品種類銷量
export const getCategorySales = async () => {
  try {
    const response = await axios.get(`${URL}/manage/shop/orders/category-sales`);
    return response.data.data;  
  } catch (error) {
    console.error('Error fetching category sales data:', error);
    throw new Error('Could not fetch category sales data.');
  }
};