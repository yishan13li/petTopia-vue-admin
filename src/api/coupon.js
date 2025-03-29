import axios from 'axios';

const API_URL = '/api/admin/coupons';

// 獲取優惠券列表
export const getCoupons = async (page = 0, size = 10, keyword = '', status = '') => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                page,
                size,
                keyword,
                status
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 獲取單個優惠券
export const getCoupon = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 新增優惠券
export const createCoupon = async (couponData) => {
    try {
        const response = await axios.post(API_URL, couponData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 更新優惠券
export const updateCoupon = async (id, couponData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, couponData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 刪除優惠券
export const deleteCoupon = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw error;
    }
}; 