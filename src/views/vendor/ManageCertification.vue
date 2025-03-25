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
                            <th>申請標語</th>
                            <th>申請日期</th>
                            <th>原因</th>
                            <th>是否符合</th>
                            <th>審核時間</th>
                            <th>狀態</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="certification in certificationsWithTags" :key="certification.certificationId">
                            <td><input type="checkbox" v-model="selectedVendors" :value="certification.id"></td>
                            <td>{{ certification.vendor.id }}</td>
                            <td>{{ certification.vendor.name }}</td>
                            <td>{{ certification.certificationTags.tagName }}</td>
                            <td>{{ formatDate(certification.requestDate) }}</td>
                            <td>{{ certification.reason }}</td>
                            <td>{{ certification.certificationTags.meetsStandard }}</td>
                            <td>{{ certification.approvedDate }}</td>
                            <td>{{ certification.certificationStatus }}</td>
                            <td>
                                <button @click="toggleVendorStatus(certification)"
                                    :class="{ 'btn-success': !certification.status, 'btn-danger': certification.status }"
                                    class="btn btn-sm">
                                    {{ certification.status }}
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

// 定义响应数据的存储
const certificationsWithTags = ref([]);

// 定义获取数据的方法
const getCertificationsWithTags = async () => {
    try {
        // 调用后端 API 获取认证数据
        const response = await axios.get('http://localhost:8080/api/admin/certifications', {
            headers: { 'Accept': 'application/json' }
        }); // 这里的 URL 要根据实际的后端接口调整
        certificationsWithTags.value = response.data;  // 将返回的数据存储到响应式变量中
        console.log(certificationsWithTags.value)
    } catch (error) {
        console.error('获取认证申请及标签失败:', error); // 捕获错误并输出到控制台
    }
};

// 在组件加载时获取认证数据
onMounted(() => {
    getCertificationsWithTags();
    initializeDataTable()
});

</script>
