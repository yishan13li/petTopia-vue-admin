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
                                        <option value="">所有商品</option>
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
                                        <option value="20">&lt;= 20</option>
                                        <option value="50">&lt;= 50</option>
                                        <option value="100">&lt;= 100</option>
                                    </select>
                                </td>
                                <td>
                                    <input v-model="startDate" type="date" class="form-control d-inline-block w-auto">
                                    <span class="to-text mx-2">到</span>
                                    <input v-model="endDate" type="date" class="form-control d-inline-block w-auto">
                                </td>

                                <td>
                                    <div class="d-flex">
                                        <button @click="loadOrders" class="btn btn-primary">篩選</button>
                                        <button @click="clearFilters" class="btn btn-secondary ms-2">清除</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div class="mb-4 ms-4">
                    <label class="revise">批量更新狀態：</label>
                    <select v-model="batchStatus" class="form-select d-inline-block w-auto" style="min-width: 120px;">
                        <option value="" disabled selected>請選擇狀態</option>
                        <option value=1>上架</option>
                        <option value=0>下架</option>
                    </select>
                    <button @click="batchUpdateProducts" class="btn btn-warning"
                        style="margin-left: 10px; margin-right: 10px;">批量更新</button>
                    <button class="btn btn-primary" @click="addProduct">新增商品</button>
                    <span class="text-danger ms-3">{{ batchUpdateMsg }}</span>
                </div>

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
                        <th>建立日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in productList" :key="product.id">
                        <td><input type="checkbox" v-model="selectedProducts" :value="product.id"
                                @change="onChangeClickBox"></td>
                        <td :class="{ 'text-danger': !product.status }">{{ product.status ? "上架" : "下架" }}</td>
                        <td>{{ product.productDetail.name }}</td>
                        <td>{{ product.productSize?.name ?? "-" }}</td>
                        <td>{{ product.productColor?.name ?? "-" }}</td>
                        <td>$ {{ product.unitPrice }}</td>
                        <td :class="{ 'text-danger': product.discountPrice }">$ {{ product.discountPrice ?
                            product.discountPrice : "-" }}</td>
                        <td>{{ product.stockQuantity }}</td>
                        <td>{{ dayjs(product.createdTime).format("YYYY-MM-DD") }}</td>
                        <td>
                            <!-- <button class="btn btn-sm btn-secondary" @click="viewProduct(product.id)">
                                <i class="bi bi-eye"></i>
                            </button> -->
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

            <!-- 新增商品 Modal -->
            <AddProductModal ref="addProductModalRef" @updateProductList="onChangePage(currentPage)" />

            <!-- 修改商品 Modal -->
            <ModifyProductModal :modify-product="modifyProduct" @updateProductList="onChangePage(currentPage)" />

            <!-- 分頁 -->
            <div class="container" v-if="total > 0">
                <Paginate v-model="currentPage" :page-count="pages" :initial-page="currentPage" :page-range="3"
                    :margin-pages="1" :click-handler="onChangePage" :first-last-button="true"
                    prev-text="<i class= 'bi bi-chevron-left' > </i>" next-text="<i class= 'bi bi-chevron-right' > </i>"
                    first-button-text="<i class= 'bi bi-chevron-bar-left' > </i>"
                    last-button-text="<i class= 'bi bi-chevron-bar-right' > </i>">

                </Paginate>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';
import Paginate from 'vuejs-paginate-next';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

import AddProductModal from '@/components/shop/AddProductModal.vue';
import ModifyProductModal from '@/components/shop/ModifyProductModal.vue';

const PATH = import.meta.env.VITE_API_URL;

// ===================== 初始載入 =====================
const productList = ref([]);    // 加載商品

const searchProductKeyword = ref("");   // 關鍵字搜尋
const selectedCategory = ref("");   // 商品分類
const productStatus = ref("");  // 上架狀態
const isProductDiscount = ref("");  // 特價狀態
const stockQuantityLessThan = ref("");  // 庫存狀態
const startDate = ref('');
const endDate = ref('');

//  批量更新 
const selectedProducts = ref([]);    // 勾選的商品
const selectAll = ref(false);
const batchStatus = ref("");
const batchUpdateMsg = ref("");

// 新增商品 Modal
const addProductModalRef = ref(null);

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
watch([searchProductKeyword, selectedCategory, productStatus, isProductDiscount, stockQuantityLessThan, startDate, endDate], () => {
    onChangePage();
});

// #endregion =================================================

// #region Event function =================================================

// test
function onChangeClickBox() {
    // console.log(selectedProducts.value);
}

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
        "category": selectedCategory.value ? selectedCategory.value : null,
        "status": productStatus.value ? productStatus.value : null,
        "isProductDiscount": isProductDiscount.value ? isProductDiscount.value : null,
        "stockQuantityLessThan": stockQuantityLessThan.value ? stockQuantityLessThan.value : null,
        "startDate": startDate.value ? startDate.value : null,
        "endDate": endDate.value ? endDate.value : null,
    }

    // console.log(filterData);

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
            // console.log(response.data);
            productList.value = response.data.productList;

            // 分頁
            total.value = response.data.count;
            pages.value = Math.ceil(total.value / rows.value);
            lastPageRows.value = total.value % rows.value;
        })

        .catch(error => console.log("fetchProducts failed.", error));

}

// 清除篩選
const clearFilters = () => {

    searchProductKeyword.value = '';
    selectedCategory.value = '';
    productStatus.value = '';
    isProductDiscount.value = '';
    stockQuantityLessThan.value = '';
    startDate.value = '';
    endDate.value = '';

    batchUpdateMsg.value = '';

    onChangePage();

};

// 切換全選
const toggleAll = () => {
    if (selectAll.value) {
        selectedProducts.value = productList.value.map(product => product.id);
    } else {
        selectedProducts.value = [];
    }
};

// 批量更新
const batchUpdateProducts = async () => {
    if (selectedProducts.value.length === 0) {
        batchUpdateMsg.value = "請選擇商品";
        return;
    }

    if (!batchStatus.value) {
        batchUpdateMsg.value = "請選擇狀態";
        return;
    }

    const updatedProductsData = {
        productIds: selectedProducts.value.join(','),
        batchStatus: batchStatus.value
    };

    axios({
        method: 'put',
        url: `${PATH}/manage/shop/products/api/updateProductsStatus`,
        params: updatedProductsData

    })
        .then(response => {
            // console.log(response.data);
            // batchUpdateMsg.value = "批量更新成功";
            selectedProducts.value = [];
            selectAll.value = false;

            onChangePage(currentPage.value);

            Swal.fire({
                icon: 'success',
                title: '批量更新成功',
                showConfirmButton: false,
                timer: 1500,
            })

        })
        .catch(error => {
            console.log(error);
            batchUpdateMsg.value = "批量更新失敗";
        });

};


// 新增商品
function addProduct() {
    batchUpdateMsg.value = "";

    addProductModalRef.value.showModal();

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


// 修改
const modifyProduct = ref({});

function editProduct(productId) {
    batchUpdateMsg.value = "";

    axios({
        method: 'get',
        url: `${PATH}/manage/shop/products/api/modifyProduct/getProduct`,
        params: {
            productId: productId
        }

    })
        .then(response => {
            // console.log(response.data);
            modifyProduct.value = response.data;

            const modalElement = document.getElementById('modifyProductModal');
            if (modalElement) {
                const myModal = new bootstrap.Modal(modalElement); // 改用 new Modal()
                myModal.show();
            }

        })
        .catch(error => {
            console.log(error);
        });


}

function deleteProduct(productId) {
    Swal.fire({
        title: '確定要刪除嗎?',
        text: "刪除後將無法恢復!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axios({
                method: 'get',
                url: `${PATH}/manage/shop/products/api/deleteProduct`,
                params: {
                    productId: productId
                }

            })
                .then(response => {
                    // console.log(response.data);
                    onChangePage(currentPage.value);

                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}


// #endregion =================================================


</script>

<style></style>