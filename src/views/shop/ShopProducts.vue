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
                                <td><label>商品種類</label></td>
                                <td><label>上架狀態</label></td>
                                <td><label>特價狀態</label></td>
                                <td><label>庫存狀態</label></td>
                                <td><label>日期範圍</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="searchProductKeyword" type="text" class="form-control"
                                        placeholder="輸入商品名稱" style="width: 200px;">
                                </td>
                                <td>
                                    <select v-model="selectedCategory" class="form-select">
                                        <option value="所有商品">所有商品</option>
                                        <option value="食品保健">食品保健</option>
                                        <option value="日常用品">日常用品</option>
                                        <option value="服飾">服飾</option>
                                        <option value="玩具">玩具</option>
                                        <option value="其他">其他</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="productStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option value="1">上架</option>
                                        <option value="0">下架</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="isProductDiscount" class="form-select">
                                        <option value="">全部</option>
                                        <option value="1">特價商品</option>
                                        <option value="0">原價商品</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="stockQuantityLessThan" class="form-select">
                                        <option value="">全部</option>
                                        <option value="20">&lt; 20</option>
                                        <option value="50">&lt; 50</option>
                                        <option value="100">&lt; 100</option>
                                    </select>
                                </td>
                                <td>
                                    <input v-model="startDate" type="date" class="form-control d-inline-block w-auto">
                                    <span class="to-text mx-2">到</span>
                                    <input v-model="endDate" type="date" class="form-control d-inline-block w-auto">
                                </td>
                                <div class="d-flex ">
                                    <button @click="" class="btn btn-primary">篩選</button>
                                    <button @click="clearFilters" class="btn btn-secondary ms-2">清除</button>
                                </div>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div class="mb-4 ms-4">
                    <label class="revise">批量更新狀態：</label>
                    <select v-model="batchStatus" class="form-select d-inline-block w-auto">
                        <option value="" disabled selected>請選擇狀態</option>
                        <option value=1>上架</option>
                        <option value=0>下架</option>
                    </select>
                    <button @click="batchUpdateOrders" class="btn btn-warning"
                        style="margin-left: 10px; margin-right: 10px;">批量更新</button>


                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addOrderModal">新增商品</button>
                </div>


                <!-- 新增訂單 Modal -->
                <!-- <div class="modal fade" id="addOrderModal" tabindex="-1" aria-labelledby="addOrderModalLabel"
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
                </div> -->
            </div>


            <!-- 商品表格 -->
            <table class="table table-hover">
                <thead class="tr_list_title">
                    <tr>
                        <th class="th_title"><input type="checkbox" v-model="selectAll" @change="toggleAll"></th>
                        <th @click="sortBy('orderDetail.orderId')">
                            狀態
                            <!-- <i :class="sortDirection === 'orderDetail.orderId' ? (isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down')
                                : 'fas fa-sort'"></i> -->
                        </th>
                        <th>名稱</th>
                        <th @click="sortBy('orderDetail.orderDate')">
                            尺寸
                            <!-- <i
                                :class="sortDirection === 'orderDetail.orderDate' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i> -->
                        </th>
                        <th @click="sortBy('orderDetail.memberId')">
                            顏色
                            <!-- <i
                                :class="sortDirection === 'orderDetail.memberId' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i> -->
                        </th>
                        <th>價錢</th>
                        <th>特價</th>
                        <th @click="sortBy('orderDetail.memberId')">
                            庫存
                            <!-- <i
                                :class="sortDirection === 'orderDetail.memberId' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i> -->
                        </th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in productList" :key="product.id">
                        <td><input type="checkbox" v-model="selectedProducts" :value="product.id"></td>
                        <td>{{ product.status ? "上架" : "下架" }}</td>
                        <td>{{ product.productDetail.name }}</td>
                        <td>{{ product.productSize?.name ?? "-" }}</td>
                        <td>{{ product.productColor?.name ?? "-" }}</td>
                        <td>$ {{ product.unitPrice }}</td>
                        <td>$ {{ product.discountPrice ? product.discountPrice : "-" }}</td>
                        <td>{{ product.stockQuantity }}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" @click="viewProduct(product.id)">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-info" @click="editProduct(product.id)">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 顯示訂單詳情 Modal -->
            <!-- <OrderDetailModal :isEditing="isEditing" :order-detail="orderDetail" :cities="cities"
                @edit-order="editOrder" @save-order="saveOrder" /> -->

            <!-- 分頁 -->
            <div class="container" v-if="total > 0">
                <Paginate v-model="currentPage" :page-count="pages" :initial-page="currentPage" :page-range="3"
                    :margin-pages="1" :click-handler="onChangePage" :first-last-button="true">

                </Paginate>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Paginate from 'vuejs-paginate-next';
import axios from 'axios';

const PATH = import.meta.env.VITE_API_URL;

// ===================== 初始載入 =====================
const productList = ref([]);    // 加載商品
const selectedProducts = ref([]);    // 勾選的商品

const searchProductKeyword = ref("");   // 關鍵字搜尋
const selectedCategory = ref("所有商品");   // 商品分類
const productStatus = ref("");  // 上架狀態
const isProductDiscount = ref("");  // 特價狀態
const stockQuantityLessThan = ref("");  // 庫存狀態
const startDate = ref('');
const endDate = ref('');



// 分頁
const currentPage = ref(1); // 目前在第幾頁
const pages = ref(0);   // 總共有幾頁
const total = ref(0);   // 總共有幾筆
const rows = ref(10);   // 每頁顯示幾筆
const start = ref(0);   // 從第幾筆資料開始
const lastPageRows = ref(0); // 最後一頁有幾筆

// #region 初始化 & 監聽 =================================================

onMounted(async () => {
    onChangePage();
});

// 監聽所有過濾選項
watch([searchProductKeyword, selectedCategory, productStatus, isProductDiscount], () => {
    onChangePage();
});

// #endregion =================================================

// #region Event function =================================================

// 分頁切換 => 加載商品
function onChangePage(page) {
    if (page) {
        currentPage.value = page;
        start.value = (page - 1) * rows.value;
    } else {
        currentPage.value = 1;
        start.value = 0;
    }

    const filterData = {
        "start": start.value,
        "rows": rows.value,
        "keyword": searchProductKeyword.value ? searchProductKeyword.value : null,
        "category": selectedCategory.value,
        "status": productStatus.value ? productStatus.value : null,
        "isProductDiscount": isProductDiscount.value ? isProductDiscount.value : null,
    }

    getProducts(filterData);

}

// #endregion =================================================

// #region general function =================================================

// 加載商品
async function getProducts(filterData) {
    await axios({
        method: 'get',
        url: `${PATH}/manage/shop/products`,
        params: filterData
    })
        .then(response => {
            console.log(response.data);
            productList.value = response.data.productList;

            // 分頁
            total.value = response.data.count;
            pages.value = Math.ceil(total.value / rows.value);
            lastPageRows.value = total.value % rows.value;
        })

        .catch(error => console.log("fetchProducts failed.", error));

}


// ===============sortby===========
const sortDirection = ref('');
const isAscending = ref(true);

const sortBy = (field) => {
    if (sortDirection.value === field) {
        isAscending.value = !isAscending.value;
    } else {
        sortDirection.value = field;
        isAscending.value = true;
    }

    productList.value.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (isAscending.value) {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
};

// 操作
function viewProduct() {

}

function editProduct() {

}

function deleteProduct() {

}


// #endregion =================================================


</script>

<style></style>