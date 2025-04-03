<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-info">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-people"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">會員數</p>
                  <h3 class="text-white">{{ totalMembers }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-success">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-shop"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">店家數</p>
                  <h3 class="text-white">{{ totalVendors }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-danger">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-calendar-event"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">活動數</p>
                  <h3 class="text-white">{{ totalActivities }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-dark">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-box"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">商品數</p>
                  <h3 class="text-white">{{ totalProducts }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-primary">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-cart-check"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">總訂單數</p>
                  <h3 class="text-white">{{ totalOrders }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-xxl-4 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-warning">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-currency-dollar"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">應收總收入</p>
                  <h3 class="text-white">$ {{ totalRevenue.toLocaleString() }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">

        <div class="col-xl-6 col-lg-6 col-md-6">

          <div class="card">
            <div class="card-header">
              <h4 class="card-title">熱銷商品種類</h4>
            </div>
            <div class="card-body">


              <div>
                <div v-if="salesCategoryData.length > 0" class="pie-chart-container">
                  <!-- 圓餅圖 -->
                  <Pie :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </div>


          </div>
        </div>

        <div class="col-xl-6 col-lg-6 col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">銷售額</h4>
            </div>
            <div class="card-body">

              <div>
                <button @click="showMonthlySales" class="mr-3" style="width: 50px;">每月</button>

                <!-- 每日銷售額按鈕（當沒有選擇月份時禁用） -->
                <button @click="showDailySales" class="mr-3" style="width: 50px;" :disabled="!selectedMonth">
                  每日
                </button>

                <!-- 月份選擇 -->
                <select v-model="selectedMonth" @change="showDailySales">
                  <option value="" disabled>選擇月份</option>
                  <option v-for="month in availableMonths" :key="month" :value="month">
                    {{ month }}
                  </option>
                </select>

                <canvas ref="chartCanvas"></canvas>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSalesData, getCategorySales } from '@/api/shop/orderApi';

const totalOrders = ref(0);
const totalMembers = ref(0);
const totalVendors = ref(0);
const totalActivities = ref(0);
const totalProducts = ref(0);
const totalRevenue = ref(0);
const recentOrders = ref([]);

const getStatusClass = (status) => {
  const classes = {
    '待付款': 'badge bg-warning',
    '已付款': 'badge bg-success',
    '配送中': 'badge bg-info',
    '已完成': 'badge bg-primary',
    '已取消': 'badge bg-danger'
  };
  return classes[status] || 'badge bg-secondary';
};

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/admin/dashboard/stats');
    const stats = response.data;

    totalOrders.value = stats.totalOrders;
    totalMembers.value = stats.totalMembers;
    totalVendors.value = stats.totalVendors;
    totalActivities.value = stats.totalActivities;
    totalProducts.value = stats.totalProducts;
    totalRevenue.value = stats.totalRevenue;
  } catch (error) {
    console.error('獲取統計數據失敗：', error);
    // 這裡可以加入錯誤提示
  }
};

onMounted(async () => {
  await fetchDashboardStats();

  // 模擬最近訂單數據
  recentOrders.value = [
    { orderId: 'ORD001', memberName: '張三', totalAmount: 1200, status: '待付款' },
    { orderId: 'ORD002', memberName: '李四', totalAmount: 2500, status: '已付款' },
    { orderId: 'ORD003', memberName: '王五', totalAmount: 1800, status: '配送中' },
    { orderId: 'ORD004', memberName: '趙六', totalAmount: 3000, status: '已完成' },
    { orderId: 'ORD005', memberName: '錢七', totalAmount: 1500, status: '已取消' }
  ];

  // 初始化銷售趨勢圖表
  const ctx = document.getElementById('salesChart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '銷售額',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});

//=====圓餅+銷售額
//==========銷售額===========
const chartCanvas = ref(null);
let chartInstance = null;  // 用來保存圖表實例
const selectedMonth = ref('');  // 預設選擇的月份
const salesData = ref(null);  // 保存原始數據
const filteredData = ref({ dailyLabels: [], dailyData: [] });  // 篩選後的數據
const availableMonths = ref([]);  // 用來保存所有的可選月份
const totalSales = ref(null);

const formatMonthLabel = (label) => {
  return parseInt(label.split('-')[1]) + '月';
};

const formatDayLabel = (label) => {
  const parts = label.split('-');
  return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
};

// 獲取銷售數據
onMounted(async () => {
  try {
    salesData.value = await getSalesData();  // 獲取銷售數據

    // 提取所有月份，格式化為 YYYY-MM
    const months = salesData.value.dailyLabels.map(label => label.substring(0, 7)); // 取前 7 個字符，例如 "2025-03"
    availableMonths.value = [...new Set(months)];  // 去重並保存可用的月份

    // 初始化顯示每月銷售額
    showMonthlySales();

    //總銷售額
    totalSales.value = salesData.value.totalSales

  } catch (error) {
    console.error('Failed to load sales data:', error);
  }
});

// 銷毀舊的圖表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();  // 銷毀舊的圖表
    chartInstance = null;  // 重設圖表實例
  }
};

// 顯示每月銷售額
const showMonthlySales = () => {
  destroyChart();  // 銷毀舊的圖表

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesData.value.monthlyLabels.map(formatMonthLabel),
      datasets: [{
        label: '2025 每月銷售額',  // 圖表的標籤
        data: salesData.value.monthlyData,  // 使用每月的銷售數據
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,   // 確保顯示標題
            text: '銷售額 (元)'  // Y 軸標題
          }
        }
      }
    }
  });
};

// 顯示每日銷售額
const showDailySales = () => {
  destroyChart();  // 銷毀舊的圖表

  // 根據選擇的月份篩選數據
  const monthlyLabels = salesData.value.dailyLabels
    .filter(label => label.startsWith(selectedMonth.value))
    .map(formatDayLabel); // 轉換成 "M/D"

  const monthlyData = salesData.value.dailyData.filter((_, index) => salesData.value.dailyLabels[index].startsWith(selectedMonth.value));

  filteredData.value = {
    dailyLabels: monthlyLabels,
    dailyData: monthlyData
  };

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: filteredData.value.dailyLabels,
      datasets: [{
        label: `${selectedMonth.value} 每日銷售額`,
        data: filteredData.value.dailyData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

//商品種類熱銷比例
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels  // 註冊插件
);

const salesCategoryData = ref([]);

onMounted(async () => {
  try {
    salesCategoryData.value = await getCategorySales();
  } catch (error) {
    console.error(error);
  }
});

const chartData = computed(() => {
  const labels = salesCategoryData.value.map((category) => category.categoryName);
  const data = salesCategoryData.value.map((category) => category.totalQuantity);

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'left',  // 設定圖例顯示在圓餅圖的左邊
      align: 'start',    // 垂直排列圖例
      labels: {
        usePointStyle: true,  // 使用點樣式來顯示圖例，這樣會顯示圓形的圖示
        font: {
          size: 14,  // 設定字型大小
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const label = tooltipItem.label || '';
          const value = tooltipItem.raw;
          return `${label}: ${value}`;
        },
      },
    },
    datalabels: {
      formatter: (value, context) => {
        const total = context.dataset.data.reduce((acc, currentValue) => acc + currentValue, 0);
        const percentage = ((value / total) * 100).toFixed(0);
        return `${context.chart.data.labels[context.dataIndex]}: ${percentage}%`;
      },
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
      },
    },
  },
};
</script>

<style scoped>
.widget-stat .media {
  align-items: center;
}

.widget-stat .media i {
  font-size: 2.5rem;
}

.badge {
  padding: 0.5em 0.75em;
}

.pie-chart-container {
  max-width: 365px;
  max-height: 365px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 7vw;
  margin-top: 3.125em;
}
</style>