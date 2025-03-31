<template>
  <div class="content-body">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">{{ title }}</h2>
              <p class="card-text">此頁面正在開發中，敬請期待...</p>
              <div class="text-center mt-4">
                <i class="bi bi-gear-fill" style="font-size: 3rem;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.card {
  margin-top: 2rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.card-title {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.card-text {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.bi-gear-fill {
  color: #3498db;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 