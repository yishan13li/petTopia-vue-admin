<template>
    <div class="content-body">
        <div class="container-fluid">
            <div class="container mt-4">
                <h2 class="mb-4">認證管理</h2>

                <!-- 商家列表 -->
                <table class="table table-bordered table-hover shadow-sm rounded" id="vendorsTable">
                    <thead>
                        <tr>
                            <th>#</th>
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
                        <tr v-for="(certification, index) in filteredCertifications"
                            :key="certification.certificationId">
                            <td>{{ index + 1 }}</td>
                            <td>{{ certification.vendor.id }}</td>
                            <td>{{ certification.vendor.name }}</td>
                            <td>{{ certification.certificationTags[0]?.tagName || '無標籤' }}</td>
                            <td>{{ formatDate(certification.requestDate) }}</td>
                            <td>{{ certification.reason || '尚無原因' }}</td>
                            <td>{{ certification.certificationTags[0]?.meetsStandard ? '符合' : '不符合' }}</td>
                            <td>{{ formatDate(certification.approvedDate) || '尚未審核' }}</td>
                            <td>{{ certification.certificationStatus }}</td>
                            <td>
                                <!-- 只有在状态为 "申請中" 时才显示按钮 -->
                                <button v-if="certification.certificationStatus === '申請中'"
                                    @click="openModal(certification, '已認證')" class="btn btn-success btn-sm">
                                    認證
                                </button>
                                <button v-if="certification.certificationStatus === '申請中'"
                                    @click="openModal(certification, '未通過')" class="btn btn-danger btn-sm">
                                    未通過
                                </button>
                                <!-- 如果已经认证，按钮不显示 -->
                                <span v-if="certification.certificationStatus === '已認證'" class="text-success"></span>
                                <!-- 如果未通过，按钮不显示 -->
                                <span v-if="certification.certificationStatus === '未通過'" class="text-danger"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- 模态框: 用于输入原因 -->
                <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">輸入原因</h5>
                                <button type="button" class="close" @click="closeModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="submitCertificationStatus">
                                    <div class="form-group">
                                        <label for="reason">原因</label>
                                        <textarea v-model="reason" id="reason" class="form-control" rows="3"
                                            required></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary">提交</button>
                                    <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                                    <button class="btn btn-secondary"
                                        @click="operationType === '已認證' ? updateDemoData1() : updateDemoData2()"
                                        type="button">Demo</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

let dataTable = null;
const showModal = ref(false);
const reason = ref('');
let currentCertification = null;
let currentStatus = '';
const operationType = ref('');

const updateDemoData1 = () => {
    reason.value = '符合認證標準';
};
const updateDemoData2 = () => {
    reason.value = '未符合認證標準';
};

// 定义响应数据的存储
const certificationsWithTags = ref([]);
const selectedFilters = ref({
    certificationStatus: 'all' // 默认选择全部
});

// 打开模态框
const openModal = (certification, status) => {
    currentCertification = certification;
    currentStatus = status;
    operationType.value = status;  // 设置操作类型
    showModal.value = true;
};

// 关闭模态框
const closeModal = () => {
    showModal.value = false;
    reason.value = '';  // 清空原因
};

// 提交状态更新
const submitCertificationStatus = async () => {
    if (!reason.value) {
        alert('請輸入原因');
        return;
    }

    try {
        // 发送 PUT 请求更新认证状态
        await axios.put(`http://localhost:8080/api/admin/certification/status/update/${currentCertification.certificationId}`, null, {
            params: {
                status: currentStatus,
                reason: reason.value
            }
        });

        // 更新认证状态后关闭模态框
        alert('更新成功');
        closeModal();
        // 重新获取数据，或者根据你的逻辑刷新认证列表
        await getCertificationsWithTags();
        initializeDataTable();
    } catch (error) {
        console.error('更新失敗:', error);
        alert('更新失敗');
    }
};

// 定义获取数据的方法
const getCertificationsWithTags = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/admin/certification', {
            headers: { 'Accept': 'application/json' }
        });
        certificationsWithTags.value = response.data;
        certificationsWithTags.value.sort((a, b) => {
            if (a.certificationStatus === '申請中' && b.certificationStatus !== '申請中') {
                return -1; // 将“申請中”排在前面
            } else if (a.certificationStatus !== '申請中' && b.certificationStatus === '申請中') {
                return 1;  // 将“申請中”排在前面
            }
            return 0; // 如果两者状态相同，则不排序
        });

        console.log(certificationsWithTags.value);
    } catch (error) {
        console.error('获取认证申请及标签失败:', error);
    }
};

// 在组件加载时获取认证数据
onMounted(async () => {
    await getCertificationsWithTags();
    initializeDataTable();
});


// 初始化 DataTable
const initializeDataTable = () => {
    nextTick(() => {
        if (dataTable) {
            dataTable.destroy();  // 销毁当前实例
            dataTable = null;
        }
        dataTable = new DataTable('#vendorsTable', {
            pageLength: 20,
            lengthMenu: [20, 30, 40, 50],
            searching: true,
            ordering: true,
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
        });
    });
};

// 日期格式化函數
const formatDate = (dateString) => {
    if (!dateString) { // 如果 dateString 是 null 或 undefined，返回 '尚未審核'
        return null;
    }
    let date = new Date(dateString);
    return date.toLocaleDateString("zh-TW") + " " + date.toLocaleTimeString("zh-TW", { hour: '2-digit', minute: '2-digit' });
};

// 过滤后的认证数据
const filteredCertifications = computed(() => {
    return certificationsWithTags.value.filter(certification => {
        // 过滤 "審核狀態"
        if (selectedFilters.value.certificationStatus !== 'all' && certification.certificationStatus !== selectedFilters.value.certificationStatus) {
            return false;
        }
        return true;
    });
});

</script>
<style scoped>
.modal {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
}

.modal-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.modal-content {
    width: 400px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header .close {
    font-size: 1.5rem;
    color: #000;
}
</style>
