import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

// 取得所有評論，根據 reviewTime 降冪排序（分頁）
export const getReviews = async (page = 1, size = 10,sortBy) => {
    try {
      const response = await axios.get(`${URL}/manage/shop/reviews`, {
        params: {
          page,
          size,
          sortBy,
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching reviews by time:', error);
      throw error;
    }
  };

  // 搜尋評論（商品 ID、會員 ID、評論 ID 或評論描述）
export const searchReviews = async (keyword, page = 1, size = 5) => {
    try {
      const response = await axios.get(`${URL}/manage/shop/reviews/search`, {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching reviews:', error);
      throw new Error('Error searching reviews');
    }
  };

  //刪除評論
  export const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${URL}/manage/shop/review/${reviewId}/delete`);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        throw new Error(error.response.data);
      } else {
        // Network or other issues
        throw new Error('An error occurred while deleting the review.');
      }
    }
  };

  //==============評分統計===================

  // 獲取評分最高的前 5 名商品
export const getTop5ProductsByAverageRating = async () => {
  try {
      const response = await axios.get(`${URL}/manage/shop/review/ratingTop5Product`);
      return response.data; // 返回商品資料
  } catch (error) {
      console.error('Error fetching top 5 products:', error);
      throw error; // 丟出錯誤
  }
};

// 獲取評分最高的前 3 名商品種類
export const getTop3ProductDetailsByAverageRating = async () => {
  try {
      const response = await axios.get(`${URL}/manage/shop/review/ratingTop3ProductDetail`);
      return response.data; // 返回商品種類資料
  } catch (error) {
      console.error('Error fetching top 3 product details:', error);
      throw error; // 丟出錯誤
  }
};