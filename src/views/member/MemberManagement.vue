<template>
    <div class="content-body">
        <div class="container-fluid">
            <div class="mt-2">
                <h2 class="mb-4">會員管理</h2>
                <div class="mb-3">
                    <table class="filter-table">
                        <thead>
                            <tr>
                                <td><label>搜尋會員</label></td>
                                <td><label>會員狀態</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="memberKeyword" type="text" class="form-control"
                                        placeholder="輸入會員編號或姓名" style="width: 200px;">
                                </td>
                                <td>
                                    <select v-model="memberStatus" class="form-select">
                                        <option value="">全部</option>
                                        <option value="active">正常</option>
                                        <option value="inactive">停用</option>
                                    </select>
                                </td>
                                <td>
                                    <div class="d-flex">
                                        <button @click="loadMembers" class="btn btn-primary">篩選</button>
                                        <button @click="clearFilters" class="btn btn-secondary ms-2">清除</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- 進階搜尋區塊 -->
                    <div v-if="isAdvancedSearchVisible" class="advanced-search">
                        <table class="filter-table mt-2">
                            <thead>
                                <tr>
                                    <td><label>手機號碼</label></td>
                                    <td><label>電子郵件</label></td>
                                    <td><label>消費金額</label></td>
                                    <td><label>訂單數量</label></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input v-model="phoneNumber" type="text" class="form-control"
                                            placeholder="輸入手機號碼" style="width: 200px;">
                                    </td>
                                    <td>
                                        <input v-model="email" type="text" class="form-control"
                                            placeholder="輸入電子郵件" style="width: 200px;">
                                    </td>
                                    <td>
                                        <input v-model="minSpent" type="number" class="form-control d-inline-block w-auto"
                                            placeholder="最低金額">
                                        <span class="to-text mx-2">到</span>
                                        <input v-model="maxSpent" type="number" class="form-control d-inline-block w-auto"
                                            placeholder="最高金額">
                                    </td>
                                    <td>
                                        <input v-model="minOrders" type="number" class="form-control d-inline-block w-auto"
                                            placeholder="最少訂單">
                                        <span class="to-text mx-2">到</span>
                                        <input v-model="maxOrders" type="number" class="form-control d-inline-block w-auto"
                                            placeholder="最多訂單">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-3 ms-2">
                        <button @click="isAdvancedSearchVisible = !isAdvancedSearchVisible" class="btn btn-link">
                            {{ isAdvancedSearchVisible ? '隱藏進階搜尋' : '進階搜尋' }}
                        </button>
                    </div>
                </div>

                <div class="mb-4 ms-4">
                    <label class="revise">批量操作：</label>
                    <select v-model="batchAction" class="form-select d-inline-block w-auto">
                        <option value="" disabled selected>請選擇操作</option>
                        <option value="activate">啟用會員</option>
                        <option value="deactivate">停用會員</option>
                    </select>
                    <button @click="batchUpdateMembers" class="btn btn-warning"
                        style="margin-left: 10px; margin-right: 10px;">批量更新</button>
                </div>

                <!-- 編輯會員 Modal -->
                <div class="modal fade" id="editMemberModal" tabindex="-1" aria-labelledby="editMemberModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">編輯會員</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="updateMember">
                                    <div class="mb-3">
                                        <label class="form-label">姓名</label>
                                        <input type="text" class="form-control" v-model="editingMember.name">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">電子郵件</label>
                                        <input type="email" class="form-control" v-model="editingMember.email">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">手機號碼</label>
                                        <input type="tel" class="form-control" v-model="editingMember.phone">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">生日</label>
                                        <input type="date" class="form-control" v-model="editingMember.birthday">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">地址</label>
                                        <input type="text" class="form-control" v-model="editingMember.address">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">會員狀態</label>
                                        <select class="form-control" v-model="editingMember.status">
                                            <option value="active">正常</option>
                                            <option value="inactive">停用</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="btn btn-success">更新</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 會員表格 -->
            <table class="table table-hover">
                <thead class="tr_list_title">
                    <tr>
                        <th class="th_title"><input type="checkbox" v-model="selectAll" @change="toggleAll"></th>
                        <th @click="sortBy('memberId')">
                            會員編號
                            <i :class="sortDirection === 'memberId' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th>姓名</th>
                        <th>電子郵件</th>
                        <th>手機號碼</th>
                        <th>會員狀態</th>
                        <th @click="sortBy('registrationDate')">
                            更新日期
                            <i :class="sortDirection === 'registrationDate' ? (isAscending ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''"></i>
                        </th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="member in members" :key="member.memberId">
                        <td><input type="checkbox" v-model="selectedMembers" :value="member.memberId"></td>
                        <td>{{ member.memberId }}</td>
                        <td>{{ member.name }}</td>
                        <td>{{ member.email }}</td>
                        <td>{{ member.phone }}</td>
                        <td>
                            <span :class="member.status === 'active' ? 'badge bg-success' : 'badge bg-danger'">
                                {{ member.status === 'active' ? '正常' : '停用' }}
                            </span>
                        </td>
                        <td>{{ member.registrationDate }}</td>
                        <td>
                            <button class="btn btn-sm btn-info" @click="editMember(member.memberId)">
                                <i class="bi bi-pencil"></i>
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
import axios from 'axios';
import Swal from 'sweetalert2';

// 狀態變量
const members = ref([]);
const selectedMembers = ref([]);
const selectAll = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const sortDirection = ref('');
const isAscending = ref(true);

// 篩選變量
const memberKeyword = ref('');
const memberStatus = ref('');
const isAdvancedSearchVisible = ref(false);
const phoneNumber = ref('');
const email = ref('');
const minSpent = ref('');
const maxSpent = ref('');
const minOrders = ref('');
const maxOrders = ref('');
const batchAction = ref('');

// 編輯會員表單
const editingMember = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
    status: 'active'
});

// 方法
const loadMembers = async () => {
    try {
        const response = await axios.get('/api/admin/members', {
            params: {
                page: currentPage.value - 1,  // 後端從0開始計數
                size: 10,
                keyword: memberKeyword.value,
                status: memberStatus.value,
                email: email.value
            }
        });
        
        // 處理返回的資料
        members.value = response.data.content.map(detail => ({
            memberId: detail.id,
            name: detail.name || '',
            email: detail.email,
            phone: detail.phone || '',
            status: detail.emailVerified ? 'active' : 'inactive',
            registrationDate: detail.updatedDate ? new Date(detail.updatedDate).toLocaleString() : '',
            totalSpent: 0,  // 暫時設為0
            orderCount: 0   // 暫時設為0
        }));
        
        totalPages.value = response.data.totalPages;
    } catch (error) {
        console.error('載入會員資料失敗:', error);
    }
};

const clearFilters = () => {
    memberKeyword.value = '';
    memberStatus.value = '';
    phoneNumber.value = '';
    email.value = '';
    minSpent.value = '';
    maxSpent.value = '';
    minOrders.value = '';
    maxOrders.value = '';
    loadMembers();
};

const toggleAll = () => {
    if (selectAll.value) {
        selectedMembers.value = members.value.map(member => member.memberId);
    } else {
        selectedMembers.value = [];
    }
};

const batchUpdateMembers = async () => {
    if (!batchAction.value || selectedMembers.value.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: '請選擇操作和會員',
            confirmButtonColor: '#2b4f76'
        });
        return;
    }

    try {
        await axios.post('/api/admin/members/batch-update', {
            memberIds: selectedMembers.value,
            action: batchAction.value
        });
        loadMembers();
        selectedMembers.value = [];
        selectAll.value = false;
        batchAction.value = '';
    } catch (error) {
        console.error('批量更新失敗:', error);
        Swal.fire({
            icon: 'error',
            title: '批量更新失敗',
            text: error.response?.data || '請稍後再試',
            confirmButtonColor: '#2b4f76'
        });
    }
};

const editMember = async (memberId) => {
    try {
        const response = await axios.get(`/api/admin/members/${memberId}`);
        const memberData = response.data;
        
        editingMember.value = {
            id: memberId,
            name: memberData.member?.name || '',
            email: memberData.email,
            phone: memberData.member?.phone || '',
            birthday: memberData.member?.birthdate || '',
            address: memberData.member?.address || '',
            status: memberData.emailVerified ? 'active' : 'inactive'
        };
        
        // 顯示編輯 Modal
        const modal = new bootstrap.Modal(document.getElementById('editMemberModal'));
        modal.show();
    } catch (error) {
        console.error('獲取會員資料失敗:', error);
        Swal.fire({
            icon: 'error',
            title: '獲取會員資料失敗',
            text: '請稍後再試',
            confirmButtonColor: '#2b4f76'
        });
    }
};

const updateMember = async () => {
    try {
        const updateData = {};
        
        // 只發送有修改的欄位
        if (editingMember.value.name && editingMember.value.name.trim() !== '') {
            updateData.name = editingMember.value.name;
        }
        if (editingMember.value.email && editingMember.value.email.trim() !== '') {
            updateData.email = editingMember.value.email;
        }
        if (editingMember.value.phone && editingMember.value.phone.trim() !== '') {
            updateData.phone = editingMember.value.phone;
        }
        if (editingMember.value.birthday && editingMember.value.birthday.trim() !== '') {
            updateData.birthdate = editingMember.value.birthday;
        }
        if (editingMember.value.address && editingMember.value.address.trim() !== '') {
            updateData.address = editingMember.value.address;
        }
        if (editingMember.value.status !== undefined) {
            updateData.emailVerified = editingMember.value.status === 'active';
        }

        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/admin/members/${editingMember.value.id}`,
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (response.status === 200) {
            // 關閉 Modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editMemberModal'));
            modal.hide();
            
            // 重新載入會員列表
            loadMembers();
            
            // 清空編輯資料
            editingMember.value = {
                id: null,
                name: '',
                email: '',
                phone: '',
                birthday: '',
                address: '',
                status: 'active'
            };
            
            Swal.fire({
                icon: 'success',
                title: '更新成功',
                text: '會員資料已成功更新！',
                confirmButtonColor: '#2b4f76'
            });
        }
    } catch (error) {
        console.error('更新會員資料失敗:', error);
        Swal.fire({
            icon: 'error',
            title: '更新失敗',
            text: error.response?.data || '更新會員資料失敗，請稍後再試',
            confirmButtonColor: '#2b4f76'
        });
    }
};

const sortBy = (field) => {
    if (sortDirection.value === field) {
        isAscending.value = !isAscending.value;
    } else {
        sortDirection.value = field;
        isAscending.value = true;
    }
    loadMembers();
};

const goToPage = (page) => {
    currentPage.value = page;
    loadMembers();
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        loadMembers();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        loadMembers();
    }
};

// 生命週期鉤子
onMounted(() => {
    loadMembers();
});
</script>

<style scoped>
.content-body {
    padding: 20px;
}

.filter-table {
    width: 100%;
    margin-bottom: 1rem;
}

.filter-table td {
    padding: 0.5rem;
}

.advanced-search {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.25rem;
    margin-top: 1rem;
}

.tr_list_title th {
    background-color: #f8f9fa;
    cursor: pointer;
}

.th_title {
    width: 50px;
}

.to-text {
    color: #6c757d;
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