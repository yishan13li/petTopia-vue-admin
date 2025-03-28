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
                                <td><label>店家類型</label></td>
                                <td><label>狀態</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <select v-model="vendorCategoryFilter" class="form-select">
                                        <option value="">請選擇</option>
                                        <option value="all">全部</option>
                                        <option v-for="category in allcategory" :key="category.id" :value="category.id">
                                            {{
                                                category.name }}</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="vendorStatusFilter" class="form-select">
                                        <option value="">請選擇</option>
                                        <option value="all">全部</option>
                                        <option value="false">未通過</option>
                                        <option value="true">已通過</option>
                                    </select>
                                </td>
                                <td><button @click="updateDataTable" class="btn btn-warning">篩選</button></td>
                                <td><button @click="clearFilters" class="btn btn-secondary">取消篩選</button></td>

                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 批量修改 -->
                <div>
                    <label class="revise">批次修改商家狀態：</label>
                    <select v-model="batchStatus" class="form-select d-inline-block w-auto">
                        <option value="">請選擇狀態</option>
                        <option value="未通過">未通過</option>
                        <option value="已通過">已通過</option>
                    </select>
                    <button @click="batchUpdateVendors" class="btn btn-warning">批量更新</button>

                </div>
                <div>
                    <button @click="updateAllVendors('已通過')" class="btn btn-success btn-sm">全部通過</button>
                    <button @click="updateAllVendors('未通過')" class="btn btn-danger btn-sm">全部未通過</button>

                </div>

                <!-- 商家列表 -->
                <table class="table table-bordered table-hover shadow-sm rounded" id="vendorsTable"
                    :key="vendors.length">
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>商家ID</th>
                            <th>名稱</th>
                            <th>類別</th>
                            <th>Email</th>
                            <th>聯絡人</th>
                            <th>活動總數</th>
                            <th>等級</th>
                            <th>註冊日期</th>
                            <th>狀態</th>
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
                            <td>{{ formatDate(vendor.registrationDate) }}</td>
                            <td>{{ vendor.status ? '已通過' : '未通過' }}</td>
                            <td>
                                <button @click="toggleVendorStatus(vendor)"
                                    :class="{ 'btn-success': !vendor.status, 'btn-danger': vendor.status }"
                                    class="btn btn-sm ">
                                    {{ vendor.status ? '設為未通過' : '設為已通過' }}
                                </button>
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
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import DataTable from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.css'

let dataTable = null
const allcategory = ref([]);
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
            dataTable = null;  // 清空 DataTable 變數
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

// 📅 日期格式化函數
const formatDate = (dateString) => {
    let date = new Date(dateString);
    return date.toLocaleDateString("zh-TW") + " " + date.toLocaleTimeString("zh-TW", { hour: '2-digit', minute: '2-digit' });
};

const fetchAllcategory = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/vendors/allcategory`)
            .then(response => {
                allcategory.value = response.data.allcategory;
                console.log(allcategory.value)
            })
            .catch(error => {
                console.error('獲取所有類別失敗:', error);
            });

    } catch (error) {
        console.error('Error fetching Allcategory:', error);
    }
};

const fetchVendors = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/admin/vendors`, {
            withCredentials: true // 允許攜帶 Cookie
        })
            .then(response => {
                vendors.value = response.data;
                console.log(vendors.value)
                nextTick(() => {

                    initializeDataTable();  // 重新初始化 DataTable
                });
            })
            .catch(error => {
                console.error('獲取評論資料失敗:', error);
            });

    } catch (error) {
        console.error('Error fetching vendors:', error);
    }
};
const searchVendors = async () => {
    const params = {};

    // 根據篩選條件加上相應的參數
    if (vendorCategoryFilter.value !== 'all') {
        params.categoryId = vendorCategoryFilter.value;
    }

    if (vendorStatusFilter.value !== 'all') {
        params.status = vendorStatusFilter.value;
    }
    console.log('筛选条件:', params); // 打印筛选条件
    try {
        const response = await axios.get(`${VITE_API_URL}/api/admin/vendors`, { params });
        vendors.value = response.data;
        console.log(vendors.value);
        if (!dataTable) return;

        // 刪除舊的 DataTable 實例
        dataTable.destroy();
        dataTable = null;

        // 重新加載數據並初始化表格

        nextTick(() => {
            initializeDataTable();  // 重新初始化 DataTable
        });
        // nextTick(() => {

        //     // 確保資料已經更新，然後再初始化 DataTable
        //     if (vendors.value.length > 0) {
        //         setTimeout(() => {
        //             initializeDataTable(); // 延遲執行初始化
        //         }, 300);
        //     }
        // });

    } catch (error) {
        console.error('獲取商家資料失敗:', error);
    }
};

const clearFilters = () => {
    vendorCategoryFilter.value = '';  // 清空類別篩選
    vendorStatusFilter.value = '';    // 清空狀態篩選
    searchVendors();  // 重新加載數據
};

const updateDataTable = async () => {
    if (!dataTable) return;

    searchVendors()

};


const toggleVendorStatus = async (vendor) => {
    // 切換狀態
    const newStatus = !vendor.status;

    try {
        // 向後端發送請求更新狀態
        const response = await axios.put(`${VITE_API_URL}/api/admin/vendors/status/${vendor.id}`, {
            status: newStatus
        });

        if (response.status === 200) {
            // 更新成功後，直接在前端切換狀態
            vendor.status = newStatus;
            alert(response.data); // 提示更新成功
        }
    } catch (error) {
        console.error('Error updating vendor status:', error);
        alert('更新失敗');
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

    const targetStatus = batchStatus.value === '已通過'; // 轉換為布林值

    // 取得選中商家的資料
    const selectedVendorData = vendors.value.filter(vendor => selectedVendors.value.includes(vendor.id));

    // 找出需要更新的商家（目前狀態不同於目標狀態）
    const vendorsToUpdate = selectedVendorData.filter(vendor => vendor.status !== targetStatus);

    if (vendorsToUpdate.length === 0) {
        alert(`所選商家狀態已經是「${batchStatus.value}」，無需更新！`);
        return;
    }

    try {
        const requestData = {
            vendorIds: vendorsToUpdate.map(vendor => vendor.id), // 只更新需要更新的商家
            status: targetStatus
        };
        const response = await axios.put(`${VITE_API_URL}/api/admin/vendors/status/bulk`, requestData);
        alert(response.data);
        fetchVendors(); // 重新載入數據
        selectedVendors.value = [];
    } catch (error) {
        console.error('Error updating vendors:', error);
        alert('更新失敗');
    }
};



const updateAllVendors = async (status) => {
    if (vendors.value.length === 0) {
        alert("目前沒有商家資料");
        return;
    }

    if (!confirm(`確定要將所有商家狀態改為「${status}」嗎？`)) {
        return;
    }

    try {
        const requestData = {
            vendorIds: vendors.value.map(vendor => vendor.id),  // 取得所有商家的 ID
            status: status === '已通過'  // 轉換為布林值
        };

        const response = await axios.put(`${VITE_API_URL}/api/admin/vendors/status/bulk`, requestData);
        alert(response.data);

        if (!dataTable) return;

        // 刪除舊的 DataTable 實例
        dataTable.destroy();
        dataTable = null;

        // 重新加載數據並初始化表格
        fetchVendors();  // 重新載入數據
        nextTick(() => {
            initializeDataTable();  // 重新初始化 DataTable
        });
    } catch (error) {
        console.error('Error updating vendors:', error);
        alert('更新失敗');
    }
};

watch(selectedVendors, (newValue) => {
    selectAll.value = newValue.length === vendors.value.length && vendors.value.length > 0;
    console.log(selectAll.value)
});



onMounted(async () => {
    await fetchAllcategory()
    await fetchVendors()
    nextTick(() => {
        setTimeout(() => {
            initializeDataTable();  // 稍微延迟初始化 DataTable
        }, 300);  // 延迟 100 毫秒再初始化
    });
})
</script>
<style scoped>
#vendorsTable th:nth-child(11),
#vendorsTable td:nth-child(11) {
    width: 10%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}

#vendorsTable th:nth-child(3),
#vendorsTable td:nth-child(3) {
    width: 16%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}

#vendorsTable th:nth-child(9),
#vendorsTable td:nth-child(9) {
    width: 10%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}

#vendorsTable th:nth-child(10),
#vendorsTable td:nth-child(10) {
    width: 10%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}

#vendorsTable th:nth-child(6),
#vendorsTable td:nth-child(6) {
    width: 8%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}

#vendorsTable th:nth-child(4),
#vendorsTable td:nth-child(4) {
    width: 10%;
    /* 增加「操作」欄位的寬度 */
    text-align: center;
}
</style>
