<template>
    <div class="content-body">
        <div class="container-fluid">
            <div class="container mt-4">
                <h2 class="mb-4">商家管理</h2>

                <!-- 搜尋與篩選 -->
                <div class="d-flex justify-content-between mb-3">
                    <table class="filter-table">
                        <thead>
                            <tr class="tr_title">
                                <td><label>搜尋店家</label></td>
                                <td><label>店家類型</label></td>
                                <td><label>狀態</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入店家名稱">
                                </td>
                                <td>
                                    <select v-model="vendorCategoryFilter" class="form-select">
                                        <option value="all">全部</option>
                                        <option value="餐飲">餐飲</option>
                                        <option value="零售">零售</option>
                                        <option value="服務">服務</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="vendorStatusFilter" class="form-select">
                                        <option value="all">全部</option>
                                        <option value="未審核">未審核</option>
                                        <option value="已審核">已審核</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 批量修改 -->
                <div>
                    <label class="revise">批次修改商家狀態：</label>
                    <select v-model="batchStatus" class="form-select d-inline-block w-auto">
                        <option value="">請選擇狀態</option>
                        <option value="未審核">未審核</option>
                        <option value="已審核">已審核</option>
                    </select>
                    <button @click="batchUpdateVendors" class="btn btn-warning">批量更新</button>
                </div>

                <!-- 商家列表 -->
                <table class="table table-bordered table-hover shadow-sm rounded" id="vendorsTable">
                    <thead>
                        <tr>
                            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
                            <th>商家ID</th>
                            <th>名稱</th>
                            <th>類別</th>
                            <th>Email</th>
                            <th>聯絡人</th>
                            <th>活動總數</th>
                            <th>等級</th>
                            <th>註冊日期</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="vendor in vendors" :key="vendor.id">
                            <td><input type="checkbox" v-model="selectedVendors" :value="vendor.id"></td>
                            <td>{{ vendor.id }}</td>
                            <td>{{ vendor.name }}</td>
                            <td>{{ vendor.vendorCategory.name }}</td>
                            <td>{{ vendor.contactEmail }}</td>
                            <td>{{ vendor.contactPerson }}</td>
                            <td>{{ vendor.eventCount }}</td>
                            <td>{{ vendor.vendorLevel }}</td>
                            <td>{{ vendor.registrationDate }}</td>
                            <td>

                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- 分頁 -->
                <!-- <nav>
                    <ul class="pagination">
                        <li class="page-item"><button @click="goToPage(1)" class="page-link">«</button></li>
                        <li class="page-item"><button @click="prevPage" class="page-link">‹</button></li>
                        <li class="page-item"><span class="page-link">第 {{ currentPage }} 頁 / 共 {{ totalPages }}
                                頁</span></li>
                        <li class="page-item"><button @click="nextPage" class="page-link">›</button></li>
                        <li class="page-item"><button @click="goToPage(totalPages)" class="page-link">»</button></li>
                    </ul>
                </nav> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';
import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'

let dataTable = null
const searchQuery = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const VITE_API_URL = import.meta.env.VITE_API_URL;
const vendors = ref([]);
const selectedVendors = ref([]);
const selectAll = ref(false);
const batchStatus = ref('');
const vendorCategoryFilter = ref('');
const vendorStatusFilter = ref('');

const initializeDataTable = () => {
    nextTick(() => {
        if (dataTable) {
            dataTable.destroy()  // 销毁旧实例
        }
        dataTable = new DataTable('#vendorsTable', {
            pageLength: 5, // 每頁顯示 5 筆資料
            lengthMenu: [5, 10, 20, 50],
            searching: true, // 啟用搜尋
            ordering: true,  // 啟用排序
            responsive: true,
            language: {
                search: "搜尋：",
                lengthMenu: "顯示 _MENU_ 筆資料",
                info: "顯示第 _START_ 筆到第 _END_ 筆，共 _TOTAL_ 筆",
                zeroRecords: "沒有找到相關資料",
                processing: "處理中...",
                infoEmpty: "目前沒有資料",
                infoFiltered: "(從 _MAX_ 筆資料過濾)",
                paginate: { first: "第一頁", last: "最後一頁", next: "下一頁", previous: "上一頁" },
                emptyTable: "目前表格內沒有資料",
                loadingRecords: "載入中...",
                paginate: {
                    first: "首頁",
                    previous: "上一頁",
                    next: "下一頁",
                    last: "最後一頁"
                }
            }
        })
    })
}

const fetchVendors = async () => {
    try {
        const response = await axios.get(`${VITE_API_URL}/api/admin/vendors`);
        vendors.value = response.data;
        console.log(vendors.value)
    } catch (error) {
        console.error('Error fetching vendors:', error);
    }
};

const batchUpdateVendors = async () => {
    if (selectedVendors.value.length === 0) {
        alert("請選擇至少一個商家");
        return;
    }
    if (!batchStatus.value) {
        alert("請選擇狀態");
        return;
    }

    try {
        const requestData = {
            vendorIds: selectedVendors.value,
            status: batchStatus.value === '已審核' // 轉換為布林值
        };
        const response = await axios.put(`${VITE_API_URL}/api/admin/vendors/status/bulk`, requestData);
        alert(response.data);
        fetchVendors(); // 重新載入數據
    } catch (error) {
        console.error('Error updating vendors:', error);
        alert('更新失敗');
    }
};

// const toggleSelectAll = () => {
//     if (selectAll.value) {
//         selectedVendors.value = vendors.value.map(vendor => vendor.id);
//     } else {
//         selectedVendors.value = [];
//     }
// };

// const filteredVendors = computed(() => {
//     return vendors.value.filter(vendor => {
//         return (
//             (vendorCategoryFilter.value === '' || vendor.category === vendorCategoryFilter.value) &&
//             (vendorStatusFilter.value === '' || vendor.status === vendorStatusFilter.value)
//         );
//     });
// });


onMounted(() => {
    fetchVendors()
    initializeDataTable()

});
</script>
