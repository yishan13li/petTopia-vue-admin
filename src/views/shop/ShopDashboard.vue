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
                  <p class="mb-1">總收入</p>
                  <h3 class="text-white">$ {{ totalRevenue }}</h3>
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
        <div class="col-xl-3 col-xxl-3 col-lg-6 col-sm-6">
          <div class="widget-stat card bg-warning">
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
      </div>

      <div class="row">
        <div class="col-xl-6 col-lg-6 col-md-6">

          <div class="card">
    <div class="card-header">
      <h4 class="card-title">喜愛排行</h4>
    </div>
    <div class="card-body">
      <!-- 評分最高的前 5 名商品 -->
      <h4 class="mt-4">🏆 最喜愛商品Top5</h4>
<div class="list-group">
  <div v-for="(product, index) in top5Products" :key="product.id" class="list-group-item d-flex align-items-center">
    <span class="rank-badge">{{ index + 1 }}</span>
  <div class="ms-3 d-flex align-items-center justify-content-between w-100">
    <div>
      <div class="d-flex align-items-center">
      <h5>{{ product.name }}</h5>
      <template v-if="product.color !== '無' || product.size !== '無'">
        <span class="ms-2">({{ formatProductAttributes(product.color, product.size) }})</span>
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
<h4 class="mt-4">🏅 最喜愛種類Top3</h4>
<div class="list-group">
  <div v-for="(detail, index) in top3ProductDetails" :key="detail.id" class="list-group-item d-flex align-items-center">
    <span class="rank-badge top3">{{ index + 1 }}</span>
    <div class="ms-3 d-flex align-items-center justify-content-between w-100">
      <div>
        <div class="d-flex align-items-center">
          <h5>{{ detail.name }}</h5>
          <template v-if="detail.category !== '無'">
            <span class="ms-2">({{ detail.category }})</span>
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
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">銷售趨勢</h4>
            </div>
            <div class="card-body">

              <canvas id="salesChart"></canvas>

              <!-- 銷售最好前 5 名商品 -->
<h4 class="mt-4">🏆 最熱銷Top5</h4>
<div class="list-group">
  <div v-for="(product, index) in top5SalesProducts" :key="product.productDetail.id" class="list-group-item d-flex align-items-center">
    <span class="rank-badge">{{ index + 1 }}</span>
    <div class="ms-3 d-flex align-items-center justify-content-between w-100">
      <div>
        <div class="d-flex align-items-center">
          <h5>{{ product.productDetail.name }}</h5>
          <template v-if="product.productDetail.productCategory.name !== '無'">
            <span class="ms-2">({{ product.productDetail.productCategory.name }})</span>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { getTop3ProductDetailsByAverageRating,getTop5ProductsByAverageRating } from '@/api/shop/productReviewApi';
import { getTop5BestSellingProducts } from '@/api/shop/orderApi';

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
    console.log(response.data)
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
    console.log(response.data);
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
// 定義響應式變數來儲存商品資料
const top5SalesProducts = ref([]);

// 在組件掛載時獲取銷售最高的前 5 名商品詳情
const fetchTop5BestSellingProducts = async () => {
  try {
    // 呼叫 API 來獲取數據
    const response = await getTop5BestSellingProducts();
    top5SalesProducts.value = response; // 將返回的數據設置到 top5Products 中
  } catch (error) {
    console.error('Failed to fetch top 5 best selling products:', error);
  }
};

// 在組件加載時自動執行
onMounted(() => {
  fetchTop5BestSellingProducts();
});
//===========================


const totalOrders = ref(0);
const totalRevenue = ref(0);
const totalMembers = ref(0);
const totalProducts = ref(0);
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

onMounted(async () => {
  // TODO: 從 API 獲取數據
  // 這裡先使用模擬數據
  totalOrders.value = 150;
  totalRevenue.value = 25000;
  totalMembers.value = 80;
  totalProducts.value = 45;
  
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
</style> 