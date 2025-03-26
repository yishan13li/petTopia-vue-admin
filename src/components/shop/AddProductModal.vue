<template>
    <!-- 新增商品 Modal -->
    <div ref="addProductModalRef" class="modal fade" tabindex="-1" aria-labelledby="addProductModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">新增商品</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitOrder">

                        <div class="mb-3">
                            <label class="form-label">分類</label>
                            <select class="form-select" v-model="product.productDetail.productCategory.name">
                                <option value="食品保健">食品保健</option>
                                <option value="日常用品">日常用品</option>
                                <option value="服飾">服飾</option>
                                <option value="玩具">玩具</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">名稱</label>
                            <input type="text" class="form-control" v-model="product.productDetail.name">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">說明</label>
                            <input type="text" class="form-control" v-model="product.productDetail.description">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">尺寸</label>
                            <input type="text" class="form-control" v-model="product.productSize.name">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">顏色</label>
                            <input type="text" class="form-control" v-model="product.productColor.name">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">價錢</label>
                            <input type="number" class="form-control" v-model="product.unitPrice">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">特價</label>
                            <input type="number" class="form-control" v-model="product.discountPrice">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">庫存</label>
                            <input type="number" class="form-control" v-model="product.stockQuantity">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">圖片</label>
                            <input type="text" class="form-control" v-model="product.photo">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">上架</label>
                            <select class="form-select" v-model="product.status">
                                <option value="1">上架</option>
                                <option value="0">下架</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-success" @click="onClickSubmit">建立商品</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import axios from 'axios';

const PATH = import.meta.env.VITE_API_URL;

const addProductModalRef = ref(null);
const addProductModal = ref(null);

// 新增商品 body
const product = ref({
    unitPrice: 0,
    discountPrice: 0,
    stockQuantity: 0,
    photo: "",
    status: "1",
    productSize: { name: "" },
    productColor: { name: "" },
    productDetail: {
        name: "",
        description: "",
        productCategory: { name: "" },
    }
});

onMounted(async () => {
    addProductModal.value = new bootstrap.Modal(addProductModalRef.value);
});

defineExpose({
    showModal,
    hideModal
});

function onClickSubmit() {
    console.log(product.value);
    axios({
        method: 'post',
        url: `${PATH}/manage/shop/products/api/insertProduct`,
        data: product.value,

    })
        .then(response => {
            console.log(response.data);

        })

        .catch(error => console.log(error));
}

function showModal() {
    addProductModal.value.show();
    product.value.productDetail.productCategory.name = "食品保健";
    product.value.status = "1";

}

function hideModal() {
    addProductModal.value.hide();
}

</script>

<style>
.order-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 保持垂直對齊 */
    width: 100%;
}

.order-date {
    margin-left: auto;
    /* 確保它推到最右邊 */
}

.member-info {
    display: flex;
    justify-content: space-between;
    /* 左右對齊 */
    align-items: center;
    /* 垂直置中 */
    width: 100%;
    /* 確保區塊占滿整行 */
}

.product-list {
    list-style: none;
    /* 移除預設的圓點 */
    padding: 0;
}

.product-item {
    display: flex;
    justify-content: space-between;
    /* 讓商品名稱在左，價格和數量在右 */
    align-items: center;
    padding: 5px 0;
    /* 增加一點間距 */
}

.product-info {
    flex: 1;
    /* 讓左側的產品資訊占據可用空間 */
}

.product-price {
    display: flex;
    align-items: center;
    gap: 200px;
    /* 讓價格與數量之間保留間距 */
}

.product-quantity {
    margin-left: 30px;
    /* 調整數量與價格的間距 */
}
</style>