<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="mt-2">
        <h2 class="mb-4">商品評論管理</h2>
        <div class="mb-3">
          <table class="filter-table">
            <thead>
            </thead>
            <tbody>
              <tr>
                <td><select v-model="sortBy" @change="loadReviews" class="form-select">
                    <option value="time">時間</option>
                    <option value="rating">評分</option>
                    <option value="id">編號</option>
                  </select></td>
                <td>
                  <input v-model="searchKeyword" type="text" class="form-control" @keyup.enter="loadReviews"
                    placeholder="輸入評論、商品、會員編號 或 評論描述" style="width: 300px;">
                </td>

                <div class="d-flex ">
                  <button @click="loadReviews" class="btn btn-primary">查詢</button>
                  <button @click="clearFilter" class="btn btn-warning ml-3">清除</button>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 表格 -->
      <table class="table table-hover">
        <thead class="tr_list_title">
          <tr>
            <th>評論編號</th>
            <th>商品編號</th>
            <th>商品 (顏色/尺寸)</th>
            <th>會員編號</th>
            <th>評分</th>
            <th>描述</th>
            <th>評論時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews" :key="review.id">
            <td>{{ review.reviewId }}</td>
            <td>{{ review.productId }}</td>
            <td>
              {{ review.productName }}
              <br>
              <span
                v-if="(review.productColor && review.productColor !== '無') && (review.productSize && review.productSize !== '無')">
                ({{ review.productColor }}/{{ review.productSize }})
              </span>
              <span v-else-if="review.productColor && review.productColor !== '無'">
                ({{ review.productColor }})
              </span>
              <span v-else-if="review.productSize && review.productSize !== '無'">
                ({{ review.productSize }})
              </span>
            </td>


            <td>{{ review.memberId }}</td>
            <td>{{ review.rating }}</td>
            <td>
              <div class="review-content">
                <p>{{ review.reviewDescription }}</p>
                <div v-if="review.productReviewPhoto && review.productReviewPhoto.length > 0">
                  <img v-for="(photo, index) in review.productReviewPhoto" :key="index"
                    :src="`data:image/jpeg;base64,${photo.reviewPhotos}`" class="img-thumbnail" alt="Review Photo">
                </div>
              </div>
            </td>
            <td>{{ formatDate(review.reviewTime) }}</td>

            <td>
              <button class="btn btn-sm btn-danger" @click="handleDeleteReview(review.reviewId)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 顯示查無資料訊息 -->
      <div v-if="message" class="no-data-message">
        {{ message }}
      </div>

      <!-- 分頁 -->
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button @click="goToPage(1)" class="page-link">«</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button @click="prevPage" class="page-link">‹</button>
          </li>
          <li class="page-item">
            <span class="page-link">第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁</span>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button @click="nextPage" class="page-link">›</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button @click="goToPage(totalPages)" class="page-link">»</button>
          </li>
        </ul>
        <div class="total-records">
          <span>總共 <strong>{{ totalElements }}</strong> 筆 資料</span>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReviews } from '@/api/shop/productReviewApi';
import { searchReviews } from '@/api/shop/productReviewApi';
import { deleteReview } from '@/api/shop/productReviewApi';
import Swal from 'sweetalert2';

const reviews = ref([]);
const searchKeyword = ref('');

//分頁資訊
const currentPage = ref(1); // 當前頁數
const totalPages = ref(1);   // 總頁數
const totalElements = ref(0); // 總資料數
const message = ref('');
const sortBy = ref('time');

const loadReviews = async () => {
  try {
    let data;
    message.value = '';

    if (searchKeyword.value) {
      data = await searchReviews(searchKeyword.value, currentPage.value, 10);
    } else {
      data = await getReviews(currentPage.value, 10, sortBy.value); // 使用 getReviews 函數並傳入 sortBy 參數
    }

    // 確保 data 存在，避免 undefined 錯誤
    if (!data || !data.content || data.content.length === 0) {
      reviews.value = [];
      message.value = '查無資料';
      totalPages.value = 1;
      totalElements.value = 0;
      return; // 避免繼續執行
    }

    // 正常處理數據
    reviews.value = data.content;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
  } catch (error) {
    console.error('無法載入評論:', error);

    // 這裡應該是發生錯誤，而不是查無資料
    reviews.value = [];
    message.value = '載入評論資料時發生錯誤';
    totalPages.value = 1;
    totalElements.value = 0;
  }
};


const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // 使用 12 小時制
  };

  const date = new Date(dateString); // ISO 8601 格式會自動被 JavaScript Date 解析
  return date.toLocaleString('zh-TW', options); // 轉換為台灣的時間格式
};

onMounted(() => {
  loadReviews();
});

const clearFilter = () => {
  searchKeyword.value = ''; // 清空搜尋關鍵字
  currentPage.value = 1; // 回到第一頁，避免停留在錯誤的分頁
  loadReviews(); // 重新載入原始評論列表
};

//刪除評論
const handleDeleteReview = async (reviewId) => {
  // 先顯示確認彈窗
  const result = await Swal.fire({
    title: '確定要刪除這則評論嗎？',
    text: '此操作無法復原!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: '刪除',
    cancelButtonText: '取消'
  });

  // 如果使用者確認刪除
  if (result.isConfirmed) {
    try {
      const response = await deleteReview(reviewId);

      Swal.fire({
        icon: 'success',
        title: '刪除成功!',
        text: '評論已刪除',
        confirmButtonText: '確定'
      });
      loadReviews();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '刪除失敗!',
        text: '評論未刪除',
        confirmButtonText: '確定'
      });
    }
  }
};

// 下一頁
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    loadReviews();
  }
};

// 上一頁
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    loadReviews();
  }
};

// 跳到指定頁
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadReviews();
  }
};

</script>

<style>
html {
  font-size: 14px !important;
}

.popover-body {
  font-size: 12px;
}

.filter-table tr {
  margin-bottom: 10px;
}

.filter-table td {
  padding: 3px 5px;
}

th {
  font-size: 15px !important;
}

table {
  text-align: center;
}

.filter-table {
  border-collapse: collapse;
}

.filter-table td,
.filter-table th {
  padding: 0px 20px;
}

.filter-table {
  text-align: left;
  margin-left: 0;
}

input {
  text-align: center;
  vertical-align: middle;
}

option {
  text-align: center;
}

.advanced-search {
  margin: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 45%;
  min-width: 700px;
}

.form-select {
  width: 100px !important;
}

.revise-select {
  display: block;
  margin: 0 auto;
  text-align: center;
  text-align-last: center;
}

.pagination .page-item.disabled .page-link {

  background-color: #f5f3f3;
  border-color: #e9e7e7;
  cursor: not-allowed;

}

.no-data-message {
  text-align: center;
  font-size: larger;
  padding: 100px;
}

.review-content img {
  max-width: 80px;
  /* 設定圖片的最大寬度 */
  max-height: 80px;
  /* 設定圖片的最大高度 */
  margin-right: 10px;
  margin-bottom: 10px;
  object-fit: cover;
  /* 保持圖片比例不變並裁剪 */
}
</style>