<template>
  <!-- 訂單詳情 Modal -->
  <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">訂單詳情</h5>
          <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"
            @click="closeDetail"></button>
        </div>
        <div class="modal-body" v-if="orderDetail">

          <p class="order-info">
            <strong>訂單編號 #&nbsp</strong> {{ orderDetail.orderId }}
            <span class="order-date"><strong>訂單日期:</strong> {{ orderDetail.createdTime }}</span>
          </p>
          <div class="member-info">
            <p><strong>會員編號 #</strong> {{ orderDetail.memberId }}</p>
            <p class="order-update"><strong>更新日期:</strong> {{ orderDetail.updatedDate }}</p>
          </div>
          <p> <strong>訂單狀態：</strong>{{ orderDetail.orderStatus }}, {{ orderDetail.paymentInfo.paymentStatus }}</p>
          <p><strong>付款方式：</strong>{{ orderDetail.paymentInfo.paymentCategory }}</p>
          <p><strong>配送方式：</strong>{{ orderDetail.shippingInfo.shippingCategory }}</p>
          <p><strong>商品列表：</strong></p>
          <ul class="product-list">
            <li v-for="(item, index) in orderDetail.orderItems" :key="index" class="product-item">
              <div class="product-info">
                #{{ item.productId }} {{ item.productName }}
                <template v-if="item.productColor || item.productSize">
                  (
                  <template v-if="item.productColor">{{ item.productColor }}</template>
                  <template v-if="item.productColor && item.productSize">, </template>
                  <template v-if="item.productSize">{{ item.productSize }}</template>
                  )
                </template>
              </div>

              <div class="product-price">
                <span v-if="item.discountPrice">
                  <del>$ {{ item.unitPrice }}</del> <strong>$ {{ item.discountPrice }}</strong>
                </span>
                <span v-else>
                  $ {{ item.unitPrice }}
                </span>
                <span class="product-quantity">x {{ item.quantity }}</span>
              </div>
            </li>
          </ul>
          <p><strong>商品總金額：</strong> ${{ orderDetail.subtotal }}</p>
          <p><strong>運費：</strong> ${{ orderDetail.shippingFee }}</p>
          <p><strong>優惠折扣：</strong> - ${{ orderDetail.discountAmount }}</p>
          <p><strong>訂單總金額：</strong> ${{ orderDetail.totalAmount }}</p>

          <p><strong>收件姓名：</strong>
            {{ orderDetail.shippingInfo.receiverName }}</p>
          <p><strong>收件電話：</strong> {{ orderDetail.shippingInfo.receiverPhone }}</p>
          <p><strong>收件地址：</strong>{{ orderDetail.shippingInfo.city }}{{ orderDetail.shippingInfo.street }}
          </p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeDetail">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定義 props
const props = defineProps({

  orderDetail: {
    type: Object,
    required: false,

  },

});

</script>

<style>
.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 保持垂直對齊 */
  width: 100%;
}

.order-date {
  margin-left: auto;
  /* 確保它推到最右邊 */
}

.member-info {
  display: flex;
  justify-content: space-between;
  /* 左右對齊 */
  align-items: center;
  /* 垂直置中 */
  width: 100%;
  /* 確保區塊占滿整行 */
}

.product-list {
  list-style: none;
  /* 移除預設的圓點 */
  padding: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  /* 讓商品名稱在左，價格和數量在右 */
  align-items: center;
  padding: 5px 0;
  /* 增加一點間距 */
}

.product-info {
  flex: 1;
  /* 讓左側的產品資訊占據可用空間 */
}

.product-price {
  display: flex;
  align-items: center;
  gap: 200px;
  /* 讓價格與數量之間保留間距 */
}

.product-quantity {
  margin-left: 30px;
  /* 調整數量與價格的間距 */
}
</style>