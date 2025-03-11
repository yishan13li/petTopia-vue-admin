<template>
<div class="content-body">
    <div class="container-fluid">
        <div class="container mt-4">
            <h2 class="mb-4">訂單管理</h2>
 <!-- 搜尋與篩選 -->
 <div class="d-flex justify-content-between mb-3">
          <table class="filter-table">
            <thead>
            <tr class="tr_title">
              <td><label>搜尋訂單</label></td>
              <td><label>訂單狀態</label></td>
              <td><label>日期範圍</label></td>
              <td></td> 
            </tr>
        </thead>
        <tbody>
            <tr>
              <td>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入訂單編號、商品名或會員">
              </td>
              <td>
                <select v-model="orderStatus" class="form-select">
                  <option value="all">全部</option>
                  <option value="待處理">待處理</option>
                  <option value="待出貨">待出貨</option>
                  <option value="待收貨">待收貨</option>
                  <option value="配送中">配送中</option>
                  <option value="已完成">已完成</option>
                  <option value="已取消">已取消</option>
                </select>
              </td>
              <td>
                <select v-model="paymentStatus" class="form-select">
                  <option value="all">全部</option>
                  <option value="已付款">已付款</option>
                  <option value="待付款">待付款</option>
                  <option value="付款失敗">付款失敗</option>
                </select>
              </td>
              <td>
                <input v-model="startDate" type="date" class="form-control d-inline-block w-auto">
                <span class="to-text">到</span>
                <input v-model="endDate" type="date" class="form-control d-inline-block w-auto">
              </td>
              <td>
                <button @click="filterOrders" class="btn btn-primary">篩選</button>
              </td>
            </tr>
        </tbody>
          </table>
        </div>

        <div>
          <label class="revise">批次修改訂單狀態：</label>
          <select v-model="batchStatus" class="form-select d-inline-block w-auto">
            <option value="none">請選擇狀態</option>
            <option value="訂單待出貨">訂單待出貨</option>
            <option value="訂單配送中">訂單配送中</option>
            <option value="訂單待收貨">訂單待收貨</option>
            <option value="訂單已完成">訂單已完成</option>
            <option value="訂單已取消">訂單已取消</option>
            <option value="已付款">已付款</option>
            <option value="未付款">未付款</option>
          </select>
          <button @click="batchUpdateOrders" class="btn btn-warning">批量更新</button>
          <button @click="openAddOrderModal" class="btn btn-success">手動新增訂單</button>
        </div>

        <button @click="isEditing = !isEditing" class="btn btn-warning">{{ isEditing ? '儲存修改' : '修改勾選訂單' }}</button>
    <button v-if="isEditing" @click="isEditing = false" class="btn btn-secondary">取消修改</button>

    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addOrderModal">新增訂單</button>

    <!-- 新增訂單 Modal -->
    <div class="modal fade" id="addOrderModal" tabindex="-1" aria-labelledby="addOrderModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增訂單</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitOrder">
              <div class="mb-3">
                <label class="form-label">會員ID</label>
                <input type="number" class="form-control" v-model="customerId" required>
                <div class="mt-2">會員編號: {{ customerName }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">商品ID</label>
                <input type="number" class="form-control" v-model="productId" required>
                <div class="mt-2">
                  商品名稱: {{ productName }}<br>
                  規格: {{ productSpecs }}<br>
                  價格: ${{ productPrice }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">數量</label>
                <input type="number" class="form-control" v-model="quantity" required>
              </div>
              <div class="mb-3">
                <button type="button" class="btn btn-primary" @click="addProduct">新增商品</button>
              </div>

              <h5>已選商品</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th>商品名稱</th>
                    <th>規格</th>
                    <th>價格</th>
                    <th>數量</th>
                    <th>總金額</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderItems" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.specs }}</td>
                    <td>${{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>${{ item.total }}</td>
                    <td>
                      <button type="button" class="btn btn-danger btn-sm" @click="removeProduct(index)">刪除</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="mb-3">
                <label class="form-label">商品總金額</label>
                <input type="text" class="form-control" :value="productTotal" readonly>
              </div>

              <div class="mb-3">
                <label class="form-label">運費</label>
                <input type="number" class="form-control" v-model="shippingFee">
              </div>
              <div class="mb-3">
                <label class="form-label">優惠折扣</label>
                <input type="number" class="form-control" v-model="discount">
              </div>

              <div class="mb-3">
                <label class="form-label">訂單總金額</label>
                <input type="text" class="form-control" :value="totalAmount" readonly>
              </div>

              <div class="mb-3">
                <label class="form-label">收件人姓名</label>
                <input type="text" class="form-control" v-model="receiverName" required>
              </div>
              <div class="mb-3">
                <label class="form-label">收件人電話</label>
                <input type="text" class="form-control" v-model="receiverPhone" required>
              </div>
              <div class="mb-3">
                <label class="form-label">收件人地址</label>
                <input type="text" class="form-control" v-model="receiverAddress" required>
              </div>

              <div class="mb-3">
                <label class="form-label">配送方式</label>
                <select class="form-control" v-model="shippingMethod">
                  <option value="宅配">宅配</option>
                  <option value="快遞">快遞</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">付款方式</label>
                <select class="form-control" v-model="paymentMethod">
                  <option value="貨到付款">貨到付款</option>
                  <option value="線上付款">線上付款</option>
                </select>
              </div>

              <button type="submit" class="btn btn-success">提交訂單</button>
            </form>
          </div>
        </div>
      </div>
    </div>

<!-- 訂單表格 -->
<label>訂單狀態：</label>
      <select v-model="orderStatusFilter">
        <option value="">全部</option>
        <option value="已付款">已付款</option>
        <option value="待付款">待付款</option>
      </select>
      <label>付款方式：</label>
      <select v-model="paymentMethodFilter">
        <option value="">全部</option>
        <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
      </select>
      <label>配送方式：</label>
      <select v-model="shippingMethodFilter">
        <option value="">全部</option>
        <option v-for="method in shippingMethods" :key="method" :value="method">{{ method }}</option>
      </select>
      <button @click="fetchOrders">篩選</button>
    </div>

    <!-- 訂單表格 -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" v-model="selectAll"></th>
          <th>訂單狀態</th>
          <th>訂單編號</th>
          <th>訂單日期</th>
          <th>會員姓名</th>
          <th>付款狀態</th>
          <th>付款方式</th>
          <th>配送方式</th>
          <th>總金額</th>
          <th>備註</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td><input type="checkbox" v-model="selectedOrders" :value="order.id"></td>
          <td>{{ order.status }}</td>
          <td>{{ order.id }}</td>
          <td>{{ order.date }}</td>
          <td>{{ order.customerName }}</td>
          <td>{{ order.paymentStatus }}</td>
          <td>{{ order.paymentMethod }}</td>
          <td>{{ order.shippingMethod }}</td>
          <td>${{ order.totalAmount }}</td>
          <td>{{ order.note }}</td>
          <td>
            <button class="btn btn-sm btn-secondary" @click="viewOrder(order.id)"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-info" @click="editOrder(order.id)"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 訂單詳情 Modal -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">訂單詳情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- 動態顯示訂單詳情 -->
            <p v-if="selectedOrder">訂單編號: {{ selectedOrder.id }}</p>
            <p v-if="selectedOrder">會員編號: {{ selectedOrder.customerName }}</p>
            <p v-if="selectedOrder">總金額: ${{ selectedOrder.totalAmount }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="editOrder(selectedOrder.id)">編輯</button>
            <button type="button" class="btn btn-success" v-if="isEditing" @click="saveOrderChanges">儲存變更</button>
            <button type="button" class="btn btn-secondary" v-if="isEditing" @click="cancelOrderChanges">取消變更</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <nav>
      <ul class="pagination">
        <li class="page-item"><button @click="goToPage(1)" class="page-link">«</button></li>
        <li class="page-item"><button @click="prevPage" class="page-link">‹</button></li>
        <li class="page-item"><span class="page-link">第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁</span></li>
        <li class="page-item"><button @click="nextPage" class="page-link">›</button></li>
        <li class="page-item"><button @click="goToPage(totalPages)" class="page-link">»</button></li>
      </ul>
    </nav>

        </div>
    </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
const VITE_API_URL=import.meta.env.VITE_API_URL

const orders = ref([]);
const selectedOrders = ref([]);
const selectAll = ref(false);
const selectedOrder = ref(null);
const isEditing = ref(false);
const orderStatusFilter = ref('');
const paymentMethodFilter = ref('');
const shippingMethodFilter = ref('');
const paymentMethods = ref([]);
const shippingMethods = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/manage/shop/orders`, {
      params: {
        orderStatus: orderStatusFilter.value,
        paymentMethod: paymentMethodFilter.value,
        shippingMethod: shippingMethodFilter.value
      }
    });
    orders.value = response.data.content;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const fetchFilterOptions = async () => {
  try {
    const response = await axios.get('/api/orderFilters');
    paymentMethods.value = response.data.paymentMethods;
    shippingMethods.value = response.data.shippingMethods;
  } catch (error) {
    console.error('Error fetching filter options:', error);
  }
};

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    return (!orderStatusFilter.value || order.status === orderStatusFilter.value) &&
           (!paymentMethodFilter.value || order.paymentMethod === paymentMethodFilter.value) &&
           (!shippingMethodFilter.value || order.shippingMethod === shippingMethodFilter.value);
  });
});

const viewOrder = (id) => {
  selectedOrder.value = orders.value.find(order => order.id === id);
};

const editOrder = (id) => {
  isEditing.value = true;
  viewOrder(id);
};

const saveOrderChanges = () => {
  isEditing.value = false;
};

const cancelOrderChanges = () => {
  isEditing.value = false;
};

const deleteOrder = async (id) => {
  try {
    await axios.delete(`/api/orders/${id}`);
    orders.value = orders.value.filter(order => order.id !== id);
  } catch (error) {
    console.error('Error deleting order:', error);
  }
};

onMounted(() => {
  fetchOrders();
  fetchFilterOptions();
});
</script>
