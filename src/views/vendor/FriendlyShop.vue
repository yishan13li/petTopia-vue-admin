<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="container mt-4">
        <h2 class="mb-4">友善店家</h2>

        <div style="margin-bottom: 10px">
          <button
            @click="openAdd"
            class="btn btn-primary"
            style="margin-right: 10px"
          >
            新增店家
          </button>
        </div>

        <!-- 商家列表 -->
        <table class="table table-bordered table-hover shadow-sm rounded">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>名稱</th>
              <th>店家類別</th>
              <th>地址</th>
              <th>經度</th>
              <th>緯度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(shop, index) in friendlyShopList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span v-if="shop.vendor?.id">{{ shop.vendor?.id }}</span
                ><span v-else style="color: #c0c0c0">N/A</span>
              </td>
              <td>{{ shop.name }}</td>
              <td>
                <span v-if="shop.vendorCategory?.id">{{
                  shop.vendorCategory?.name
                }}</span
                ><span v-else style="color: #c0c0c0">N/A</span>
              </td>
              <td>{{ shop.address }}</td>
              <td>{{ shop.longitude }}</td>
              <td>{{ shop.latitude }}</td>
              <td>
                <button
                  class="btn btn-sm btn-success"
                  @click="openModify(shop.id, index + 1)"
                  style="margin-right: 10px"
                >
                  修改
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deletefriendlyShop(shop.id)"
                >
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 友善店家視窗 -->
    <div v-if="isPopupVisible" class="overlay">
      <div class="popup">
        <div style="text-align: left">
          <h3><b v-if="isAdd">新增友善店家</b></h3>
          <h3><b v-if="isModify">修改友善店家</b></h3>
          <br />
        </div>

        <div>
          <div v-if="isModify">
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default"
                >#</span
              >
              <input
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="formId"
                disabled="true"
                required
              />
            </div>
          </div>

          <div v-if="isModify">
            <div class="input-group mb-3">
              <span class="input-group-text" id="inputGroup-sizing-default"
                >ID</span
              >
              <input
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="formVendorId"
                disabled="true"
                required
              />
            </div>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-default"
              >名稱</span
            >
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              v-model="formName"
            />
          </div>

          <div class="input-group mb-3">
            <label class="input-group-text" for="categoryList">類別</label>
            <select
              class="form-select"
              id="categoryList"
              v-model="formCategoryId"
            >
              <option
                v-for="(category, index) in categoryList"
                :key="index"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text" id="inputGroup-sizing-default"
              >地址</span
            >
            <input
              type="text"
              class="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              v-model="formAddress"
              req
            />
          </div>

          <div style="text-align: right">
            <button
              class="btn btn-primary"
              style="margin-right: 10px"
              @click="demo()"
            >
              DEMO
            </button>
            <button
              class="btn btn-danger"
              style="margin-right: 10px"
              @click="close()"
            >
              關閉
            </button>
            <button
              v-if="isAdd"
              class="btn btn-success"
              @click="addFriendlyShop()"
            >
              新增
            </button>
            <button
              v-if="isModify"
              class="btn btn-success"
              @click="modifyFriendlyShop()"
            >
              修改
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 友善店家視窗 -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Swal from "sweetalert2";

/* 0. 初始化圖表 */
onMounted(() => {
  nextTick(() => {
    console.log(document.getElementById("chart-container"));
  });
});

/* 1. 友善店家資料 */
const friendlyShopList = ref();
const fetchfriendlyShopList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/all/coordinate`
    );

    const data = await response.json();
    friendlyShopList.value = data;
  } catch (error) {
    console.error("獲取友善店家清單失敗:", error);
  }
};
onMounted(fetchfriendlyShopList);

/* 2. 店家類型 */
const categoryList = ref();
const fetchCategoryList = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/category/for/friendly_shop`
    );

    const data = await response.json();
    categoryList.value = data;
  } catch (error) {
    console.error("獲取友善店家清單失敗:", error);
  }
};
onMounted(fetchCategoryList);

/* 3. 新增友善店家 */
const isPopupVisible = ref(false);
const isAdd = ref(false);
const isModify = ref(false);

const formId = ref("");
const formVendorId = ref("");
const formName = ref("");
const formCategoryId = ref("");
const formAddress = ref("");

const modifyId = ref();

const openAdd = () => {
  isPopupVisible.value = true;
  isAdd.value = true;
};
const close = () => {
  isPopupVisible.value = false;
  isAdd.value = false;
  isModify.value = false;
  formVendorId.value = "";
  formName.value = "";
  formCategoryId.value = "";
  formAddress.value = "";
};

const addFriendlyShop = async () => {
  const form = {
    name: formName.value,
    categoryId: formCategoryId.value,
    address: formAddress.value,
  };

  if (
    formName.value.trim() == "" ||
    formCategoryId.value == null ||
    formAddress.value.trim() == ""
  ) {
    await Swal.fire({
      title: "欄位不得為空",
      icon: "warning",
      confirmButtonText: "關閉",
    });
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/friendly_shop/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const result = await response.json();

    if (result.error) {
      await Swal.fire({
        title: "新增失敗",
        text: "地址格式錯誤",
        icon: "error",
        confirmButtonText: "關閉",
      });
      return;
    }

    close();

    const confirm = await Swal.fire({
      title: "新增成功",
      icon: "success",
      confirmButtonText: "關閉",
    });

    if (confirm.isConfirmed) {
      window.location.reload();
    }
  } catch (error) {
    console.error("新增友善店家失敗:", error);
  }
};

/* 4. 修改友善店家 */
const openModify = async (id, index) => {
  isPopupVisible.value = true;
  isModify.value = true;
  modifyId.value = id;
  formId.value = index;

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/friendly_shop/${id}`
    );
    const data = await response.json();
    formVendorId.value = data.vendor?.id;
    formName.value = data.name;
    formCategoryId.value = data.vendorCategory?.id;
    formAddress.value = data.address;
  } catch (error) {
    console.error("獲取友善店家失敗:", error);
  }
};

const modifyFriendlyShop = async () => {
  const form = {
    name: formName.value,
    categoryId: formCategoryId.value,
    address: formAddress.value,
  };

  if (
    formName.value.trim() == "" ||
    formCategoryId.value == null ||
    formAddress.value.trim() == ""
  ) {
    await Swal.fire({
      title: "欄位不得為空",
      icon: "warning",
      confirmButtonText: "關閉",
    });
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/friendly_shop/${modifyId.value}/modify`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const result = await response.json();

    if (result.error) {
      await Swal.fire({
        title: "新增失敗",
        text: "地址格式錯誤",
        icon: "error",
        confirmButtonText: "關閉",
      });
      return;
    }

    close();

    await Swal.fire({
      title: "修改成功",
      icon: "success",
      confirmButtonText: "關閉",
    });

    const updatedShop = friendlyShopList.value.find(
      (shop) => shop.id === modifyId.value
    );
    if (updatedShop) {
      updatedShop.name = result.name;
      updatedShop.vendorCategory.name = result.vendorCategory.name;
      updatedShop.address = result.address;
      updatedShop.longitude = result.longitude;
      updatedShop.latitude = result.latitude;
    }
  } catch (error) {
    console.error("修改友善店家失敗:", error);
  }
};

/* 5. 刪除友善店家 */
const deletefriendlyShop = async (id) => {
  const ask = await Swal.fire({
    title: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
    reverseButtons: true,
  });
  if (!ask.isConfirmed) {
    return;
  }

  const response = await fetch(
    `http://localhost:8080/api/vendor/friendly_shop/${id}/delete`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  Swal.fire({
    title: "成功刪除",
    icon: "success",
    confirmButtonText: "關閉",
  });

  friendlyShopList.value = friendlyShopList.value.filter(
    (shop) => shop.id !== id
  );
};

/* 6. DEMO */
const demo = () => {
  formName.value = "朵兒寵物生活館";
  formCategoryId.value = 1;
  formAddress.value = "花蓮縣花蓮市進豐街91號";
};
</script>

<style scoped>
.overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;

  z-index: 1;
}

.popup {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;

  width: 500px;
  max-width: 90%;
}
</style>
