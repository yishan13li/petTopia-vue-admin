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
              <h4 class="card-title">最近訂單</h4>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>訂單編號</th>
                      <th>會員</th>
                      <th>金額</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in recentOrders" :key="order.orderId">
                      <td>{{ order.orderId }}</td>
                      <td>{{ order.memberName }}</td>
                      <td>$ {{ order.totalAmount }}</td>
                      <td>
                        <span :class="getStatusClass(order.status)">{{ order.status }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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