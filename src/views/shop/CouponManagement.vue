<template>
    <div class="content-body">
        <div class="container-fluid">
            <div class="mt-2">
                <h2 class="mb-4">優惠券管理</h2>
                <div class="mb-3">
                    <table class="filter-table">
                        <thead>
                            <tr>
                                <td><label>搜尋優惠券</label></td>
                                <td><label>優惠券狀態</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="couponKeyword" type="text" class="form-control"
                                        placeholder="輸入優惠券名稱或代碼" style="width: 200px;">
                                </td>
                                <td>
                                    <select v-model="couponStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option value="active">啟用中</option>
                                        <option value="inactive">已停用</option>
                                        <option value="expired">已過期</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="d-flex">
                                        <button @click="loadCoupons" class="btn btn-primary">篩選</button>
                                        <button @click="clearFilters" class="btn btn-secondary ms-2">清除</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mb-4 ms-4">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCouponModal">
                        新增優惠券
                    </button>
                </div>

                <!-- 新增優惠券 Modal -->
                <div class="modal fade" id="addCouponModal" tabindex="-1" aria-labelledby="addCouponModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">新增優惠券</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="submitCoupon">
                                    <div class="mb-3">
                                        <label class="form-label">優惠券名稱 <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="newCoupon.name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">優惠類型 <span class="text-danger">*</span></label>
                                        <select class="form-control" v-model="newCoupon.discountType" required>
                                            <option :value="true">百分比折扣</option>
                                            <option :value="false">固定金額</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">優惠值 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="newCoupon.discountValue" required>
                                        <small class="form-text text-muted">
                                            {{ newCoupon.discountType ? '請輸入折扣百分比（1-100）' : '請輸入優惠金額' }}
                                        </small>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">最低訂單金額 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="newCoupon.minOrderValue" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用次數限制 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="newCoupon.limitCount" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用期限 <span class="text-danger">*</span></label>
                                        <div class="d-flex">
                                            <input type="datetime-local" class="form-control" v-model="newCoupon.validStart" required>
                                            <span class="mx-2">至</span>
                                            <input type="datetime-local" class="form-control" v-model="newCoupon.validEnd" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">發放數量 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="newCoupon.quantity" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用限制</label>
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" v-model="newCoupon.oneTimeUse">
                                            <label class="form-check-label">每人限用一次</label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-success">新增</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 編輯優惠券 Modal -->
                <div class="modal fade" id="editCouponModal" tabindex="-1" aria-labelledby="editCouponModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">編輯優惠券</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="handleUpdateCoupon">
                                    <div class="mb-3">
                                        <label class="form-label">優惠券名稱 <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="editingCoupon.name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">優惠類型 <span class="text-danger">*</span></label>
                                        <select class="form-control" v-model="editingCoupon.discountType" required>
                                            <option :value="true">百分比折扣</option>
                                            <option :value="false">固定金額</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">優惠值 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="editingCoupon.discountValue" required>
                                        <small class="form-text text-muted">
                                            {{ editingCoupon.discountType ? '請輸入折扣百分比（1-100）' : '請輸入優惠金額' }}
                                        </small>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">最低訂單金額 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="editingCoupon.minOrderValue" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用次數限制 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="editingCoupon.limitCount" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用期限 <span class="text-danger">*</span></label>
                                        <div class="d-flex">
                                            <input type="datetime-local" class="form-control" v-model="editingCoupon.validStart" required>
                                            <span class="mx-2">至</span>
                                            <input type="datetime-local" class="form-control" v-model="editingCoupon.validEnd" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">發放數量 <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" v-model="editingCoupon.quantity" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">使用限制</label>
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" v-model="editingCoupon.oneTimeUse">
                                            <label class="form-check-label">每人限用一次</label>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">優惠券狀態</label>
                                        <select class="form-control" v-model="editingCoupon.status">
                                            <option :value="true">啟用中</option>
                                            <option :value="false">已停用</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="btn btn-success">更新</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 優惠券表格 -->
            <table class="table table-hover">
                <thead class="tr_list_title">
                    <tr>
                        <th @click="sortBy('id')">
                            優惠券編號
                            <i :class="sortDirection === 'id' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th>優惠券名稱</th>
                        <th>優惠內容</th>
                        <th>使用期限</th>
                        <th>狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="coupon in coupons" :key="coupon.id">
                        <td>{{ coupon.id }}</td>
                        <td>{{ coupon.name }}</td>
                        <td>
                            {{ coupon.discountType ? `${coupon.discountValue}%` : `$${coupon.discountValue}` }}
                            <small v-if="coupon.minOrderValue" class="text-muted">
                                (最低消費 ${{ coupon.minOrderValue }})
                            </small>
                        </td>
                        <td>
                            {{ new Date(coupon.validStart).toLocaleString() }}<br>
                            至<br>
                            {{ new Date(coupon.validEnd).toLocaleString() }}
                        </td>
                        <td>
                            <span :class="getStatusBadgeClass(coupon.status)">
                                {{ getStatusText(coupon.status) }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-info" @click="editCoupon(coupon.id)">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="handleDeleteCoupon(coupon.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

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
import { ref, onMounted } from 'vue';
import { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon';

// 狀態變量
const coupons = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const sortDirection = ref('');
const isAscending = ref(true);

// 篩選變量
const couponKeyword = ref('');
const couponStatus = ref('');

// 新增優惠券表單
const newCoupon = ref({
    name: '',
    discountType: true,
    discountValue: '',
    minOrderValue: '',
    limitCount: '',
    validStart: '',
    validEnd: '',
    status: true
});

// 編輯優惠券表單
const editingCoupon = ref({
    id: null,
    name: '',
    discountType: true,
    discountValue: '',
    minOrderValue: '',
    limitCount: '',
    validStart: '',
    validEnd: '',
    status: true
});

// 方法
const loadCoupons = async () => {
    try {
        const response = await getCoupons(
            currentPage.value - 1,
            10,
            couponKeyword.value,
            couponStatus.value
        );
        
        coupons.value = response.content;
        totalPages.value = response.totalPages;
    } catch (error) {
        console.error('載入優惠券資料失敗:', error);
        alert('載入優惠券資料失敗，請稍後再試');
    }
};

const clearFilters = () => {
    couponKeyword.value = '';
    couponStatus.value = '';
    loadCoupons();
};

const submitCoupon = async () => {
    try {
        // 轉換日期格式
        const couponData = {
            ...newCoupon.value,
            validStart: new Date(newCoupon.value.validStart).toISOString(),
            validEnd: new Date(newCoupon.value.validEnd).toISOString()
        };
        
        await createCoupon(couponData);
        
        // 先關閉 Modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCouponModal'));
        if (modal) {
            modal.hide();
        }
        
        // 顯示成功訊息
        alert('優惠券新增成功！');
        
        // 重新載入整個頁面
        window.location.reload();
    } catch (error) {
        console.error('新增優惠券失敗:', error);
        alert('新增優惠券失敗，請稍後再試');
    }
};

const editCoupon = async (couponId) => {
    try {
        const coupon = await getCoupon(couponId);
        // 將獲取的優惠券資料轉換為編輯表單需要的格式
        editingCoupon.value = {
            id: coupon.id,
            name: coupon.name,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            limitCount: coupon.limitCount,
            validStart: new Date(coupon.validStart).toISOString().slice(0, 16), // 轉換為 datetime-local 格式
            validEnd: new Date(coupon.validEnd).toISOString().slice(0, 16), // 轉換為 datetime-local 格式
            status: coupon.status
        };
        
        // 顯示編輯 Modal
        const modal = new bootstrap.Modal(document.getElementById('editCouponModal'));
        modal.show();
    } catch (error) {
        console.error('獲取優惠券資料失敗:', error);
        alert('獲取優惠券資料失敗，請稍後再試');
    }
};

const handleUpdateCoupon = async () => {
    try {
        // 轉換日期格式
        const couponData = {
            ...editingCoupon.value,
            validStart: new Date(editingCoupon.value.validStart).toISOString(),
            validEnd: new Date(editingCoupon.value.validEnd).toISOString()
        };
        
        await updateCoupon(editingCoupon.value.id, couponData);
        $('#editCouponModal').modal('hide');
        loadCoupons();
    } catch (error) {
        console.error('更新優惠券失敗:', error);
        alert('更新優惠券失敗，請稍後再試');
    }
};

const handleDeleteCoupon = async (couponId) => {
    if (!confirm('確定要刪除該優惠券嗎？此操作無法復原。')) {
        return;
    }
    
    try {
        await deleteCoupon(couponId);
        loadCoupons();
    } catch (error) {
        console.error('刪除優惠券失敗:', error);
        alert('刪除優惠券失敗，請稍後再試');
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'active':
            return 'badge bg-success';
        case 'inactive':
            return 'badge bg-danger';
        case 'expired':
            return 'badge bg-warning';
        default:
            return 'badge bg-secondary';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'active':
            return '啟用中';
        case 'inactive':
            return '已停用';
        case 'expired':
            return '已過期';
        default:
            return '未知';
    }
};

const sortBy = (field) => {
    if (sortDirection.value === field) {
        isAscending.value = !isAscending.value;
    } else {
        sortDirection.value = field;
        isAscending.value = true;
    }
    loadCoupons();
};

const goToPage = (page) => {
    currentPage.value = page;
    loadCoupons();
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        loadCoupons();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadCoupons();
    }
};

// 生命週期鉤子
onMounted(() => {
    loadCoupons();
});
</script>

<style scoped>
.content-body {
    padding: 20px;
}

.filter-table {
    width: 40%;
    margin-bottom: 1rem;
}

.filter-table td {
    padding: 0.5rem;
}

.tr_list_title th {
    background-color: #f8f9fa;
    cursor: pointer;
}

.badge {
    font-size: 0.875rem;
    padding: 0.5em 0.75em;
}

.pagination {
    margin-top: 2rem;
    justify-content: center;
}

.page-link {
    cursor: pointer;
}

.btn-link {
    text-decoration: none;
    color: #0d6efd;
}

.btn-link:hover {
    text-decoration: underline;
}
</style> 