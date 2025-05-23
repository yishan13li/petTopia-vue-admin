<template>
    <!-- 新增商品 Modal -->
    <div ref="addProductModalRef" id="addProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">新增商品</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
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
                                @blur="onBlurName">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">說明</label>
                            <textarea class="form-control text-start" v-model="product.productDetail.description"
                                rows="4" placeholder="請輸入商品說明"></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">尺寸</label>
                            <input type="text" class="form-control text-start" v-model="product.productSize.name">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">顏色</label>
                            <input type="text" class="form-control text-start" v-model="product.productColor.name">
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
                        </div>

                        <button type="submit" class="btn btn-success" @click="onClickSubmit">新增商品</button>
                        <button class="btn btn-primary ms-3" @click="onDemoCreate(1)">Demo新增1</button>
                        <button class="btn btn-primary ms-3" @click="onDemoCreate(2)">Demo新增2</button>
                        <button class="btn btn-primary ms-3" @click="onDemoCreate(3)">Demo新增3</button>
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

const addProductModalRef = ref(null);
const addProductModal = ref(null);

const selectedImage = ref(null);

const messages = ref("");

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

const emit = defineEmits(["updateProductList"]);

onMounted(async () => {
    addProductModal.value = new bootstrap.Modal(addProductModalRef.value);
});

defineExpose({
    showModal,
    hideModal
});

// 如果有同名商品直接獲取Description
function onBlurName() {
    axios({
        method: 'get',
        url: `${PATH}/manage/shop/products/api/insertProduct/getDescription`,
        params: { productDetailName: product.value.productDetail.name }

    })
        .then(response => {
            // console.log(response.data.description);
            product.value.productDetail.description = response.data.description;
        })

        .catch(error => console.log(error));
}

// 送出form
function onClickSubmit() {

    const formData = new FormData();

    // 將 product.value 轉成 JSON 並加入 FormData
    formData.append("product", new Blob([JSON.stringify(product.value)], { type: "application/json" }));

    // 加入圖片 (如果有選擇圖片)
    if (selectedImage.value?.file) {
        formData.append("photo", selectedImage.value.file);
    }

    axios({
        method: 'post',
        url: `${PATH}/manage/shop/products/api/insertProduct`,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData

    })
        .then(response => {
            // console.log(response.data);
            messages.value = response.data.messages;
            if (messages.value == "新增商品成功") {
                Swal.fire({
                    icon: 'success',
                    title: '新增商品成功',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    messages.value = "";
                    emit("updateProductList");
                });
            }

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

    // **關鍵：清空 input，確保能重新選擇相同檔案**
    event.target.value = "";
};

// Demo新增商品
function onDemoCreate(number) {

    if (number === 1) {
        product.value = {
            unitPrice: 120,
            discountPrice: 100,
            stockQuantity: 30,
            photo: "",
            status: "1",
            productSize: { name: "小" },
            productColor: { name: "" },
            productDetail: {
                name: "寵物黑色陶瓷碗",
                description: `必買特點 都市傳說~~ 用黑色的碗貓咪比較喜歡喝水~~
1、釉面細膩，美觀易清洗：清潔便利，不易滋生細菌
2、利用視差吸引貓咪喝水：貓咪視力較弱，黑碗容易反射水波的光線，進而吸引貓咪飲用
3、陶瓷材質：耐高溫，方便清洗，不易卡油漬
4、黃金高度：穩重底座與完美高度，貓咪吃飯不再蜷縮進食`,
                productCategory: { name: "其他" },
            }
        }
    }
    if (number === 2) {
        product.value = {
            unitPrice: 150,
            discountPrice: 0,
            stockQuantity: 20,
            photo: "",
            status: "1",
            productSize: { name: "中" },
            productColor: { name: "" },
            productDetail: {
                name: "寵物黑色陶瓷碗",
                description: `必買特點 都市傳說~~ 用黑色的碗貓咪比較喜歡喝水~~
1、釉面細膩，美觀易清洗：清潔便利，不易滋生細菌
2、利用視差吸引貓咪喝水：貓咪視力較弱，黑碗容易反射水波的光線，進而吸引貓咪飲用
3、陶瓷材質：耐高溫，方便清洗，不易卡油漬
4、黃金高度：穩重底座與完美高度，貓咪吃飯不再蜷縮進食`,
                productCategory: { name: "其他" },
            }
        }
    }
    if (number === 3) {
        product.value = {
            unitPrice: 180,
            discountPrice: 0,
            stockQuantity: 10,
            photo: "",
            status: "1",
            productSize: { name: "大" },
            productColor: { name: "" },
            productDetail: {
                name: "寵物黑色陶瓷碗",
                description: `必買特點 都市傳說~~ 用黑色的碗貓咪比較喜歡喝水~~
1、釉面細膩，美觀易清洗：清潔便利，不易滋生細菌
2、利用視差吸引貓咪喝水：貓咪視力較弱，黑碗容易反射水波的光線，進而吸引貓咪飲用
3、陶瓷材質：耐高溫，方便清洗，不易卡油漬
4、黃金高度：穩重底座與完美高度，貓咪吃飯不再蜷縮進食`,
                productCategory: { name: "其他" },
            }
        }
    }



}

function showModal() {
    addProductModal.value.show();
    // product.value.productDetail.productCategory.name = "食品保健";
    // product.value.status = "1";
    selectedImage.value = null;
    messages.value = "";

    product.value = {
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
            productCategory: { name: "食品保健" },
        }
    };

}

function hideModal() {
    addProductModal.value.hide();
}



</script>

<style></style>