<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-xxl-3 col-lg-6 col-sm-6">
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
        <div class="col-xl-3 col-xxl-3 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-success">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-currency-dollar"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">總銷售額</p>
                  <h3 class="text-white">$ {{ totalSales }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-xxl-3 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-info">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-chat-left-text"></i>
                </span>
                <div class="media-body text-white">
                  <p class="mb-1">總評論數</p>
                  <h3 class="text-white">{{ totalReviews }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-xxl-3 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-warning">
            <div class="card-body">
              <div class="media">
                <span class="me-3">
                  <i class="bi bi-box"></i>
                </span>
                <div class="media-body text-white ">
                  <p class="mb-1">低庫存商品數</p>
                  <h3 class="text-white">{{ totalProducts }}</h3>
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
              <h4 class="card-title">銷售趨勢</h4>
            </div>
            <div class="card-body">


              <div>
                <h4>商品種類熱銷比例</h4>
                <div v-if="salesCategoryData.length > 0" class="pie-chart-container">
                  <!-- 圓餅圖 -->
                  <Pie :data="chartData" :options="chartOptions" />
                </div>
              </div>
            </div>

            <div class="card-body">
              <!-- 銷售最好前 5 名商品 -->
              <h4 class="mt-4">🔥 最熱銷 Top5</h4>
              <div class="list-group">
                <div v-for="(product, index) in top5SalesProducts" :key="product.productDetail.id"
                  class="list-group-item d-flex align-items-center">
                  <span class="rank-badge">
                    <h5>{{ index + 1 }}</h5>
                  </span>
                  <div class="ms-3 d-flex align-items-center justify-content-between w-100">
                    <div>
                      <div class="d-flex align-items-center">
                        <h5>{{ product.productDetail.name }}</h5>
                        <template v-if="product.productDetail.productCategory.name !== '無'">
                          <h5><span class="ms-2">({{ product.productDetail.productCategory.name }})</span></h5>
                        </template>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <p>銷量: {{ product.totalQuantity }}</p>
                    </div>
                  </div>
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

          <div class="card">
            <div class="card-header">
              <h4 class="card-title">喜愛排行</h4>
            </div>
            <div class="card-body">
              <!-- 評分最高的前 5 名商品 -->
              <h4 class="mt-4">🏅 最喜愛商品 Top3</h4>
              <div class="list-group">
                <div v-for="(product, index) in top5Products" :key="product.id"
                  class="list-group-item d-flex align-items-center">
                  <span class="rank-badge">
                    <h5>{{ index + 1 }}</h5>
                  </span>
                  <div class="ms-3 d-flex align-items-center justify-content-between w-100">
                    <div>
                      <div class="d-flex align-items-center">
                        <h5>{{ product.name }}</h5>
                        <template v-if="product.color !== '無' || product.size !== '無'">
                          <h5><span class="ms-2">({{ formatProductAttributes(product.color, product.size) }})</span>
                          </h5>
                        </template>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <p>⭐ ({{ product.avgRating.toFixed(1) }})</p>
                    </div>


                  </div>
                </div>
              </div>

              <!-- 評分最高的前 3 名商品種類 -->
              <h4 class="mt-4">💎 最喜愛種類 Top3</h4>
              <div class="list-group">
                <div v-for="(detail, index) in top3ProductDetails" :key="detail.id"
                  class="list-group-item d-flex align-items-center">
                  <span class="rank-badge top3">
                    <h5>{{ index + 1 }}</h5>
                  </span>
                  <div class="ms-3 d-flex align-items-center justify-content-between w-100">
                    <div>
                      <div class="d-flex align-items-center">
                        <h5>{{ detail.name }}</h5>
                        <template v-if="detail.category !== '無'">
                          <h5><span class="ms-2">({{ detail.category }})</span></h5>
                        </template>
                      </div>
                    </div>
                    <div class="d-flex align-items-center">
                      <p>⭐ ({{ detail.avgRating.toFixed(1) }})</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>

        <div class="col-xl-6 col-lg-6 col-md-6">


        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import { getTop3ProductDetailsByAverageRating, getTop5ProductsByAverageRating } from '@/api/shop/productReviewApi';
import { getTop5BestSellingProducts, getSalesData, getCategorySales } from '@/api/shop/orderApi';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

//評分最高商品
const top5Products = ref([]);
const top3ProductDetails = ref([]);

const fetchTop5Products = async () => {
  try {
    const response = await getTop5ProductsByAverageRating();
    top5Products.value = response.map(item => ({
      id: item.product.id,
      name: item.product.productDetail.name,
      color: item.product.productColor?.name || '無',
      size: item.product.productSize?.name || '無',
      avgRating: item.avgRating
    }));

  } catch (error) {
    console.error('Failed to fetch top 5 products:', error);
  }
};

const fetchTop3ProductDetails = async () => {
  try {
    const response = await getTop3ProductDetailsByAverageRating();
    top3ProductDetails.value = response.map(item => ({
      id: item.productDetail.id,
      name: item.productDetail.name,
      category: item.productDetail.productCategory?.name || '無',
      avgRating: item.avgRating
    }));

  } catch (error) {
    console.error('Failed to fetch top 3 product details:', error);
  }
};

onMounted(() => {
  fetchTop5Products();
  fetchTop3ProductDetails();
});

const formatProductAttributes = (color, size) => {
  if (color !== '無' && size !== '無') return `${color}/${size}`;
  if (color !== '無') return color;
  if (size !== '無') return size;
  return '';
};

//銷量最好
const top5SalesProducts = ref([]);

const fetchTop5BestSellingProducts = async () => {
  try {
    const response = await getTop5BestSellingProducts();
    top5SalesProducts.value = response;
  } catch (error) {
    console.error('Failed to fetch top 5 best selling products:', error);
  }
};

onMounted(() => {
  fetchTop5BestSellingProducts();
});

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




//===========================

const totalOrders = ref(0);
const totalProducts = ref(0);
const totalReviews = ref(0);

onMounted(async () => {
  totalOrders.value = 150;
  totalProducts.value = 45;
  totalReviews.value = 30;

});

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
  max-width: 450px;
  max-height: 450px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3vw;
  margin-top: 3.125em;
}
</style>