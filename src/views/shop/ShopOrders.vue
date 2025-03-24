<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="mt-2">
        <h2 class="mb-4">訂單管理</h2>
        <div class="mb-3">

          <table class="filter-table">
            <thead>
              <tr>
                <td><label>搜尋訂單</label></td>
                <td><label>訂單狀態</label></td>
                <td><label>付款狀態</label></td>
                <td><label>日期範圍</label></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input v-model="searchOrderId" type="text" class="form-control" placeholder="輸入訂單編號"
                    style="width: 125px;">
                </td>
                <td>
                  <select v-model="orderStatus" class="form-select">
                    <option value="">全部</option>
                    <option v-for="status in orderStatusList" :key="status" :value="status">{{ status }}</option>
                  </select>
                </td>
                <td>
                  <select v-model="paymentStatus" class="form-select">
                    <option value="">全部</option>
                    <option v-for="status in paymentStatusList" :key="status" :value="status">{{ status }}</option>
                  </select>
                </td>
                <td>
                  <input v-model="startDate" type="date" class="form-control d-inline-block w-auto">
                  <span class="to-text mx-2">到</span>
                  <input v-model="endDate" type="date" class="form-control d-inline-block w-auto">
                </td>
                <div class="d-flex ">
                  <button @click="loadOrders" class="btn btn-primary">篩選</button>
                  <button @click="clearFilters" class="btn btn-secondary ms-2">清除</button>
                </div>
              </tr>
            </tbody>
          </table>

          <!-- 進階搜尋區塊 -->
          <div v-if="isAdvancedSearchVisible" class="advanced-search">
            <table class="filter-table mt-2">
              <thead>
                <tr>
                  <td><label>搜尋商品</label></td>
                  <td><label>搜尋會員</label></td>
                  <td><label>付款方式</label></td>
                  <td><label>配送方式</label></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input v-model="productKeyword" type="text" class="form-control" placeholder="輸入商品編號或名稱"
                      style="width: 200px;">
                  </td>
                  <td>
                    <input v-model="memberId" type="text" class="form-control" placeholder="輸入會員編號"
                      style="width: 125px;">
                  </td>
                  <td>
                    <select v-model="paymentCategory" class="form-select">
                      <option value="">全部</option>
                      <option v-for="category in paymentCategoryList" :key="category" :value="category">{{ category }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <select v-model="shippingCategory" class="form-select">
                      <option value="">全部</option>
                      <option v-for="category in shippingCategoryList" :key="category" :value="category">{{ category }}
                      </option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-3 ms-2">
            <!-- 進階搜尋按鈕 -->
            <button @click="isAdvancedSearchVisible = !isAdvancedSearchVisible" class="btn btn-link">
              {{ isAdvancedSearchVisible ? '隱藏進階搜尋' : '進階搜尋' }}
            </button>
          </div>
        </div>

        <div class="mb-4 ms-4">
          <label class="revise">批量更新狀態：</label>
          <select v-model="batchStatus" class="form-select d-inline-block w-auto">
            <option value="" disabled selected>請選擇狀態</option>
            <option value="已付款">已付款</option>
            <option value="配送中">配送中</option>
            <option value="待收貨">待收貨</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
          <button @click="batchUpdateOrders" class="btn btn-warning"
            style="margin-left: 10px; margin-right: 10px;">批量更新</button>
        </div>
      </div>

      <!-- 訂單表格 -->
      <table class="table table-hover">
        <thead class="tr_list_title">
          <tr>
            <th class="th_title"><input type="checkbox" v-model="selectAll" @change="toggleAll"></th>
            <th>訂單狀態</th>
            <th @click="sortBy('orderDetail.orderId')">
              訂單編號
              <i :class="sortDirection === 'orderDetail.orderId' ? (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down')
                : 'fas fa-sort'"></i>
            </th>
            <th @click="sortBy('orderDetail.orderDate')">
              訂單日期
              <i :class="sortDirection === 'orderDetail.orderDate'
                ? (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down')
                : 'fas fa-sort'">
              </i>


            </th>
            <th @click="sortBy('orderDetail.memberId')">
              會員編號
              <i :class="sortDirection === 'orderDetail.memberId' ? (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down')
                : 'fas fa-sort'"></i>
            </th>
            <th>付款狀態</th>
            <th>付款方式</th>
            <th>配送方式</th>
            <th @click="sortBy('totalAmount')">
              總金額
              <i :class="sortDirection === 'totalAmount' ? (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down')
                : 'fas fa-sort'"></i>
            </th>
            <th>備註</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderId">
            <td><input type="checkbox" v-model="selectedOrders" :value="order.orderId"></td>
            <td v-if="editingOrderId === order.orderId">
              <select v-model="editableOrder.orderStatus" class="revise-select">
                <option v-for="status in orderStatusList" :key="status" :value="status">{{ status }}</option>
              </select>
            </td>
            <td v-else>{{ order.orderStatus }}</td>
            <td>{{ order.orderId }}</td>
            <td>{{ order.orderDate }}</td>
            <td>{{ order.memberId }}</td>
            <!-- 付款狀態 -->
            <td v-if="editingOrderId === order.orderId">
              <select v-model="editableOrder.paymentStatus" class="revise-select">
                <option v-for="status in paymentStatusList" :key="status" :value="status">{{ status }}</option>
              </select>
            </td>
            <td v-else>{{ order.paymentStatus }}</td>

            <!-- 付款方式 -->
            <td v-if="editingOrderId === order.orderId">
              <select v-model="editableOrder.paymentCategory" class="revise-select">
                <option v-for="category in paymentCategoryList" :key="category" :value="category">{{ category }}
                </option>
              </select>
            </td>
            <td v-else>{{ order.paymentCategory }}</td>

            <!-- 配送方式 -->
            <td v-if="editingOrderId === order.orderId">
              <select v-model="editableOrder.shippingCategory" class="revise-select">
                <option v-for="category in shippingCategoryList" :key="category" :value="category">{{ category }}
                </option>
              </select>
            </td>
            <td v-else>{{ order.shippingCategory }}</td>

            <!-- 總金額 -->
            <td v-if="editingOrderId === order.orderId">
              <input type="text" v-model="editableOrder.totalAmount" class="revise-control" style="width: 100px;">
            </td>
            <td v-else>$ {{ order.totalAmount }}</td>

            <!-- 備註 -->
            <td v-if="editingOrderId === order.orderId">
              <textarea v-model="editableOrder.note" class="revise-control"
                style="width: 100%; height: 50px;"></textarea>
            </td>
            <td v-else>
              <span tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="top"
                :data-bs-content="order.note">
                {{ order.note && order.note.length > 10 ? order.note.substring(0, 10) + '...' : order.note }}
              </span>
            </td>

            <td>
              <button class="btn btn-sm btn-secondary" @click="viewDetail(order.orderId)">
                <i class="bi bi-eye"></i>
              </button>
              <button v-if="editingOrderId === order.orderId" class="btn btn-sm btn-success"
                @click="saveOrder(order.orderId)">
                <i class="bi bi-check-circle"></i>
              </button>
              <button v-if="editingOrderId !== order.orderId" class="btn btn-sm btn-info" @click="editOrder(order)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteOrder(order.orderId)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 顯示訂單詳情 Modal -->
      <OrderDetailModal :order-detail="orderDetail" :cities="cities" />

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
    <span>總共 <strong> &nbsp{{ totalElements }}&nbsp </strong> 筆 資料</span>
  </div>
</nav>

    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { Popover } from 'bootstrap';
import { fetchManageOrders } from '@/api/shop/orderApi';
import { fetchOrderOptions } from '@/api/shop/orderApi';
import { fetchManageOrderDetail } from '@/api/shop/orderApi';
import { updateOrder } from '@/api/shop/orderApi';
import { UpdateBatchOrders } from '@/api/shop/orderApi';
import { cities } from '@/assets/shop/city';
import OrderDetailModal from '@/components/shop/OrderDetailModal.vue';
import { deleteOneOrder } from '@/api/shop/orderApi';

//===========取得訂單options=================
const orderStatusList = ref([]);
const paymentStatusList = ref([]);
const paymentCategoryList = ref([]);
const shippingCategoryList = ref([]);
const hasFetchedOptions = ref(false);

const getOrderOptions = async () => {
  if (hasFetchedOptions.value) return; // 避免重複請求
  const data = await fetchOrderOptions();
  if (data) {
    orderStatusList.value = data.orderStatusList;
    paymentStatusList.value = data.paymentStatusList;
    paymentCategoryList.value = data.paymentCategoryList;
    shippingCategoryList.value = data.shippingCategoryList;
    hasFetchedOptions.value = true; // 標記已經請求過
  }
};

//==================取得訂單資料(包含篩選)==============
//訂單資訊
const orders = ref([]);
const searchOrderId = ref('');
const productKeyword = ref('');
const memberId = ref('');
const orderStatus = ref('');
const paymentStatus = ref('');
const paymentCategory = ref('');
const shippingCategory = ref('');
const startDate = ref('');
const endDate = ref('');

//分頁資訊
const currentPage = ref(1); // 當前頁數
const pageSize = ref(10);    // 每頁顯示的數量
const totalPages = ref(1);   // 總頁數
const totalElements = ref(0); // 總資料數

const loadOrders = async () => {
  try {
    const filters = {
      orderId: searchOrderId.value.trim() || null,
      productKeyword: productKeyword.value.trim() || null,
      memberId: memberId.value.trim() || null,
      orderStatus: orderStatus.value !== '' ? orderStatus.value : null,
      paymentStatus: paymentStatus.value !== '' ? paymentStatus.value : null,
      paymentCategory: paymentCategory.value !== '' ? paymentCategory.value : null,
      shippingCategory: shippingCategory.value !== '' ? shippingCategory.value : null,
      startDate: startDate.value || null,
      endDate: endDate.value || null,
      page: currentPage.value,   // 使用當前頁數
      size: pageSize.value,      // 每頁大小
    };
    const data = await fetchManageOrders(filters);
    if (data) {
      orders.value = data.manageOrders.content;
      totalPages.value = data.manageOrders.totalPages; // 更新總頁數
      totalElements.value = data.manageOrders.totalElements; // 更新總資料數
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
};

// 下一頁
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    loadOrders(); // 載入新頁的訂單
  }
};

// 上一頁
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    loadOrders(); // 載入新頁的訂單
  }
};

// 跳到指定頁
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadOrders(); // 載入指定頁的訂單
  }
};

// 是否顯示進階搜尋
const isAdvancedSearchVisible = ref(false);

//===========訂單詳情=============
const orderDetail = ref();

const viewDetail = async (orderId) => {
  try {
    const data = await fetchManageOrderDetail(orderId);
    orderDetail.value = data;

    const modalElement = document.getElementById('orderDetailModal');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement); // 改用 new Modal()
      myModal.show();
    } else {
      console.error("找不到 orderDetailModal，請確認 DOM 是否正確渲染");
    }
  } catch (error) {
    console.error('Failed to fetch order detail:', error);
  }
};

// // 預設縣市數據
// const citiesList = ref(cities);

onMounted(() => {
  loadOrders();
  getOrderOptions();
  initPopovers();
});

//備註的popover
const initPopovers = () => {
  nextTick(() => {
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
      new Popover(el);
    });
  });
};

// 監聽 orders 變化，確保新元素有 Popover
watch(() => orders, () => {
  initPopovers();
}, { deep: true });

//清除篩選
const clearFilters = () => {
  searchOrderId.value = '';
  productKeyword.value = '';
  memberId.value = '';
  orderStatus.value = '';
  paymentStatus.value = '';
  paymentCategory.value = '';
  shippingCategory.value = '';
  startDate.value = '';
  endDate.value = '';
  loadOrders();
};

//===============sortby===========
const sortDirection = ref('');
const isAscending = ref(true);

const sortBy = (field) => {
  if (sortDirection.value === field) {
    isAscending.value = !isAscending.value;
  } else {
    sortDirection.value = field;
    isAscending.value = true;
  }

  orders.value.sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (isAscending.value) {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

//==================編輯單一訂單=================
const editingOrderId = ref(null);
const editableOrder = ref({});

const editOrder = (order) => {
  if (editingOrderId.value !== null) {
    Swal.fire({
      icon: 'warning',
      title: '請先完成當前編輯',
      text: '請先儲存或取消當前的編輯，才能編輯其他訂單。',
      confirmButtonText: '確定'
    });
    return;
  }
  editingOrderId.value = order.orderId;
  editableOrder.value = { ...order };
};

// 儲存修改>>putmapping
const saveOrder = async (orderId) => {
  const originalOrder = orders.value.find(o => o.orderId === orderId);

  // 比對有修改過的欄位
  const modifiedOrder = {};

  // 比對每個欄位，只有不相等的欄位才會被記錄
  if (originalOrder.orderStatus !== editableOrder.value.orderStatus) {
    modifiedOrder.orderStatus = editableOrder.value.orderStatus;
  }
  if (originalOrder.paymentStatus !== editableOrder.value.paymentStatus) {
    modifiedOrder.paymentStatus = editableOrder.value.paymentStatus;
  }
  if (originalOrder.paymentCategory !== editableOrder.value.paymentCategory) {
    modifiedOrder.paymentCategory = editableOrder.value.paymentCategory;
  }
  if (originalOrder.shippingCategory !== editableOrder.value.shippingCategory) {
    modifiedOrder.shippingCategory = editableOrder.value.shippingCategory;
  }
  if (originalOrder.totalAmount !== editableOrder.value.totalAmount) {
    modifiedOrder.totalAmount = editableOrder.value.totalAmount;
  }
  if (originalOrder.note !== editableOrder.value.note) {
    modifiedOrder.note = editableOrder.value.note;
  }

  // 如果沒有任何欄位被修改
  if (Object.keys(modifiedOrder).length === 0) {
    Swal.fire({
      title: '未修改資料',
      text: '您沒有更改任何內容。',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false
    });

    // **退出編輯模式**
    editingOrderId.value = null;

    // 確保 Vue 更新完成後再重新初始化 Popover
    nextTick(() => {
      initPopovers();
    });

    return;
  }

  // 確認修改 SweetAlert
  const result = await Swal.fire({
    title: '確定要修改嗎?',
    text: '此操作無法復原!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      // 呼叫 updateOrder 函數更新訂單
      await updateOrder(orderId, modifiedOrder);

      // 更新前端資料
      const index = orders.value.findIndex(o => o.orderId === orderId);
      if (index !== -1) {
        orders.value[index] = { ...editableOrder.value };
      }
      editingOrderId.value = null;

      Swal.fire({
        title: '修改成功!',
        text: '訂單資料已更新。',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: '修改失敗!',
        text: '請稍後再試。',
        icon: 'error',
        confirmButtonText: '確定'
      });
    }
  }
};

//=============批量更新===================
const selectedOrders = ref([]);
const selectAll = ref(false);
const batchStatus = ref("");

// 監聽 selectedOrders 變化，控制 selectAll 狀態
watch(selectedOrders, (newVal) => {
  if (newVal.length === orders.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
});

// 切換全選
const toggleAll = () => {
  if (selectAll.value) {
    selectedOrders.value = orders.value.map(order => order.orderId);
  } else {
    selectedOrders.value = [];
  }
};

// 批量更新
const batchUpdateOrders = async () => {
  if (!batchStatus.value) {
    Swal.fire({
      title: '請選擇狀態',
      icon: 'warning',
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  const updatedOrders = {
    orderIds: selectedOrders.value.join(','),
    batchStatus: batchStatus.value,
  };

  try {
    const result = await Swal.fire({
      title: '確定要批量更新訂單狀態嗎?',
      text: '此操作無法復原!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await UpdateBatchOrders(updatedOrders);
      Swal.fire({
        title: '批量更新成功!',
        text: '訂單狀態已更新。',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      selectedOrders.value = [];
      selectAll.value = false;
      loadOrders(); // 重新獲取訂單列表
    }
  } catch (error) {
    Swal.fire({
      title: '批量更新失敗!',
      text: '請稍後再試。',
      icon: 'error',
      confirmButtonText: '確定',
    });
  }
};

//==============刪除單一訂單================
const deleteOrder = async (orderId) => {
  try {
    const result = await Swal.fire({
      title: '確定要刪除這筆訂單嗎?',
      text: '此操作無法復原!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteOneOrder(orderId); 

      if (deleteResult) {
        orders.value = orders.value.filter(order => order.orderId !== orderId);
        Swal.fire({
          title: '訂單刪除成功!',
          text: '訂單已被刪除。',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: '刪除訂單失敗!',
          text: '請稍後再試。',
          icon: 'error',
          confirmButtonText: '確定',
        });
      }
    }
  } catch (error) {
    Swal.fire({
      title: '刪除訂單時出錯!',
      text: '請稍後再試。',
      icon: 'error',
      confirmButtonText: '確定',
    });
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
  /* 為每行增加間隔 */
}


/* 或者增加行的內部間距 */
.filter-table td {
  padding: 3px 5px;
  /* 為每個單元格增加內部間距 */
}

th {
  font-size: 15px !important;
}

table {
  text-align: center;
}

/* 確保表格邊框合併，減少間距 */
.filter-table {
  border-collapse: collapse;
}

/* 調整表格內格子的 padding，減少上下距離 */
.filter-table td,
.filter-table th {
  padding: 0px 20px;
  /* 這裡可以根據需要調整大小 */
}

/* 表格整體靠左對齊 */
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
  /* 讓 select 變成區塊元素 */
  margin: 0 auto;
  /* 自動水平置中 */
  text-align: center;
  /* 讓內部文字置中 */
  text-align-last: center;
  /* 讓選中的 <option> 也置中 */
}

.pagination .page-item.disabled .page-link {
  background-color: #f5f3f3;  /* 淺灰色背景 */
  border-color: #e9e7e7;      /* 邊框顏色 */
  cursor: not-allowed;        /* 禁用時的光標 */
}

</style>