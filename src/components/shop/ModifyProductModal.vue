<template>
    <!-- 修改商品 Modal -->
    <div id="modifyProductModal" class="modal fade" tabindex="-1" aria-labelledby="addProductModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">新增商品</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="product">
                    <form @submit.prevent="submitOrder">

                        <div class="row">
                            <!-- 上架 -->
                            <div class="col-md-6">
                                <label class="form-label">狀態</label>
                                <select class="form-select" v-model="product.status">
                                    <option value="1">上架</option>
                                    <option value="0">下架</option>
                                </select>
                            </div>

                            <!-- 分類 -->
                            <div class="col-md-6">
                                <label class="form-label">分類</label>
                                <select class="form-select" v-model="product.productDetail.productCategory.name">
                                    <option value="食品保健">食品保健</option>
                                    <option value="日常用品">日常用品</option>
                                    <option value="服飾">服飾</option>
                                    <option value="玩具">玩具</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>

                        </div>

                        <div class="mt-3 mb-3">
                            <label class="form-label">名稱</label>
                            <input type="text" class="form-control text-start" v-model="product.productDetail.name"
                                disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">說明</label>
                            <textarea class="form-control text-start" v-model="product.productDetail.description"
                                rows="4" placeholder="請輸入商品說明"></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">尺寸</label>
                            <input type="text" class="form-control text-start" v-model="product.productSize.name"
                                disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">顏色</label>
                            <input type="text" class="form-control text-start" v-model="product.productColor.name"
                                disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">價錢</label>
                            <input type="number" class="form-control text-start" v-model="product.unitPrice">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">特價</label>
                            <input type="number" class="form-control text-start" v-model="product.discountPrice">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">庫存</label>
                            <input type="number" class="form-control text-start" v-model="product.stockQuantity">
                        </div>

                        <!-- 圖片上傳區域 -->
                        <div class="mb-2">
                            <label class="form-label">上傳一張圖片</label>
                            <input type="file" class="form-control" @change="handleImageUpload" accept="image/*">

                            <div v-if="selectedImage" class="mt-2">
                                <p>選擇的圖片：</p>
                                <img :src="selectedImage.preview" class="img-thumbnail" width="100" height="100">
                            </div>
                            <div v-else class="mt-2">
                                <p>選擇的圖片：</p>
                                <img :src="`${PATH}/manage/shop/products/api/modifyProduct/getProductPhoto?productId=${product.id}`"
                                    class="img-thumbnail" width="100" height="100">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-success" @click="onClickSubmit">修改商品</button>
                        <span class="text-danger ms-3">{{ messages }}</span>

                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const PATH = import.meta.env.VITE_API_URL;

const selectedImage = ref(null);

const messages = ref("");

const props = defineProps({

    modifyProduct: {
        type: Object,
        required: true,
    },

});

const emit = defineEmits(["updateProductList"]);


// 修改商品 body
const product = ref({});

onMounted(async () => {

});

// 監聽 props 變化，確保資料正確更新
watch(() => props.modifyProduct, (newProduct) => {
    selectedImage.value = null;
    messages.value = "";

    if (newProduct) {
        product.value = {
            id: newProduct.id || 0,
            unitPrice: newProduct.unitPrice || 0,
            discountPrice: newProduct.discountPrice || 0,
            stockQuantity: newProduct.stockQuantity || 0,
            photo: newProduct.photo || "",
            status: newProduct.status == true ? "1" : "0",
            productSize: { name: newProduct.productSize?.name || "" },
            productColor: { name: newProduct.productColor?.name || "" },
            productDetail: {
                name: newProduct.productDetail?.name || "",
                description: newProduct.productDetail?.description || "",
                productCategory: { name: newProduct.productDetail?.productCategory?.name || "" },
            }
        };
    }

}, { immediate: true }); // `immediate: true` 讓 watch 立即執行一次



// 送出form
function onClickSubmit() {

    const formData = new FormData();

    // 將 product.value 轉成 JSON 並加入 FormData
    formData.append("product", new Blob([JSON.stringify(product.value)], { type: "application/json" }));

    // 加入圖片 (如果有選擇圖片)
    if (selectedImage.value?.file) {
        formData.append("photo", selectedImage.value.file);
    }
    else {
        formData.append("photo", null);
    }

    axios({
        method: 'post',
        url: `${PATH}/manage/shop/products/api/modifyProduct`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData

    })
        .then(response => {
            // console.log(response.data);
            // messages.value = response.data.messages;
            Swal.fire({
                icon: 'success',
                title: '修改成功',
                showConfirmButton: false,
                timer: 1500
            });
            // **關閉 Modal**
            const modalElement = document.getElementById('modifyProductModal'); // 確保 ID 正確
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide(); // 關閉 Modal
                }
            }

            emit("updateProductList");

        })

        .catch(error => console.log(error));
}

// 處理圖片上傳
const handleImageUpload = (event) => {
    const file = event.target.files[0]; // 只取第一張圖片
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            selectedImage.value = {
                file: file,
                preview: reader.result
            };
        };
        reader.readAsDataURL(file);
    }

};


</script>

<style></style>