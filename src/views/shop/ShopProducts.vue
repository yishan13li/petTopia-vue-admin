<template>
    <div class="content-body">
        <div class="container-fluid">
            <div class="mt-2">
                <h2 class="mb-4">商品管理</h2>
                <div class="mb-3">

                    <table class="filter-table">
                        <thead>
                            <tr>
                                <td><label>搜尋商品</label></td>
                                <td><label>上架狀態</label></td>
                                <td><label>特價狀態</label></td>
                                <td><label>庫存狀態</label></td>
                                <td><label>日期範圍</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="productKeyword" type="text" class="form-control"
                                        placeholder="輸入商品編號或名稱" style="width: 200px;">
                                </td>
                                <td>
                                    <select v-model="orderStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option v-for="status in orderStatusList" :key="status" :value="status">{{
                                            status }}</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="orderStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option v-for="status in orderStatusList" :key="status" :value="status">{{
                                            status }}</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="orderStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option v-for="status in orderStatusList" :key="status" :value="status">{{
                                            status }}</option>
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
                                        <input v-model="productKeyword" type="text" class="form-control"
                                            placeholder="輸入商品編號或名稱" style="width: 200px;">
                                    </td>
                                    <td>
                                        <input v-model="memberId" type="text" class="form-control" placeholder="輸入會員編號"
                                            style="width: 125px;">
                                    </td>
                                    <td>
                                        <select v-model="paymentCategory" class="form-select">
                                            <option value="">全部</option>
                                            <option v-for="category in paymentCategoryList" :key="category"
                                                :value="category">{{ category }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select v-model="shippingCategory" class="form-select">
                                            <option value="">全部</option>
                                            <option v-for="category in shippingCategoryList" :key="category"
                                                :value="category">{{ category }}</option>
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
                        <option value="待付款">待付款</option>
                        <option value="已付款">已付款</option>
                        <option value="待處理中">待處理</option>
                        <option value="待出貨">待出貨</option>
                        <option value="配送中">配送中</option>
                        <option value="待收貨">待收貨</option>
                        <option value="已完成">已完成</option>
                        <option value="已取消">已取消</option>
                    </select>
                    <button @click="batchUpdateOrders" class="btn btn-warning"
                        style="margin-left: 10px; margin-right: 10px;">批量更新</button>


                    <button class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#addOrderModal">手動新增訂單</button>
                </div>


                <!-- 新增訂單 Modal -->
                <div class="modal fade" id="addOrderModal" tabindex="-1" aria-labelledby="addOrderModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">新增訂單</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
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
                                                    <button type="button" class="btn btn-danger btn-sm"
                                                        @click="removeProduct(index)">刪除</button>
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
            </div>


            <!-- 訂單表格 -->
            <table class="table table-hover">
                <thead class="tr_list_title">
                    <tr>
                        <th class="th_title"><input type="checkbox" v-model="selectAll" @change="toggleAll"></th>
                        <th>訂單狀態</th>
                        <th @click="sortBy('orderDetail.orderId')">
                            訂單編號
                            <i
                                :class="sortDirection === 'orderDetail.orderId' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th @click="sortBy('orderDetail.orderDate')">
                            訂單日期
                            <i
                                :class="sortDirection === 'orderDetail.orderDate' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th @click="sortBy('orderDetail.memberId')">
                            會員編號
                            <i
                                :class="sortDirection === 'orderDetail.memberId' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th>付款狀態</th>
                        <th>付款方式</th>
                        <th>配送方式</th>
                        <th @click="sortBy('totalAmount')">
                            總金額
                            <i
                                :class="sortDirection === 'totalAmount' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.orderId">
                        <td><input type="checkbox" v-model="selectedOrders" :value="orders.orderId"></td>
                        <td>{{ order.orderStatus }}</td>
                        <td>{{ order.orderId }}</td>
                        <td>{{ order.orderDate }}</td>
                        <td>{{ order.memberId }}</td>
                        <td>{{ order.paymentStatus }}</td>
                        <td>{{ order.paymentCategory }}</td>
                        <td>{{ order.shippingCategory }}</td>
                        <td>$ {{ order.totalAmount }}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" @click="viewDetail(order.orderId)">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-info" @click="editOrder(order.orderId)">
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
            <OrderDetailModal :isEditing="isEditing" :order-detail="orderDetail" :cities="cities"
                @edit-order="editOrder" @save-order="saveOrder" />

            <!-- 分頁 -->
            <nav>
                <ul class="pagination">
                    <li class="page-item"><button @click="goToPage(1)" class="page-link">«</button></li>
                    <li class="page-item"><button @click="prevPage" class="page-link">‹</button></li>
                    <li class="page-item"><span class="page-link">第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁</span>
                    </li>
                    <li class="page-item"><button @click="nextPage" class="page-link">›</button></li>
                    <li class="page-item"><button @click="goToPage(totalPages)" class="page-link">»</button></li>
                </ul>
            </nav>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

</script>

<style></style>