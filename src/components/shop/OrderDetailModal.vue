<template>
    <!-- 訂單詳情 Modal -->
    <div class="modal fade" id="orderDetailModal" tabindex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">訂單詳情</h5>
            <button type="button" class="btn-close" aria-label="Close"  
            data-bs-dismiss="modal" @click="closeDetail"></button>
          </div>
          <div class="modal-body" v-if="orderDetail">
            <p><strong>訂單編號#</strong> {{ orderDetail.orderId }}</p>
            <p><strong>會員編號#</strong> {{ orderDetail.memberId }}</p>
            <p><strong>商品列表：</strong></p>
            <ul>
              <li v-for="(item, index) in orderDetail.orderItems" :key="index">
                #{{item.productId}}  {{ item.productName }} ( {{ item.productColor }}, {{ item.productSize }} )  $ {{ item.discountPrice ? item.discountPrice : item.unitPrice }} x 
                <input type="text" class="form-control d-inline-block item-quantity" style="width: 70px;" 
                       v-model="item.quantity" :disabled="!isEditing">
              </li>
            </ul>
            <p><strong>商品總金額：</strong> ${{ orderDetail.subtotal }}</p>
            <p><strong>運費：</strong> ${{ orderDetail.shippingFee }}</p>
            <p><strong>優惠折扣：</strong> - ${{ orderDetail.discountAmount }}</p>
            <p><strong>訂單總金額：</strong> ${{ orderDetail.totalAmount }}</p>
            
            <p><strong>收件姓名：</strong> <input type="text" class="form-control d-inline-block" style="width: 120px;" v-model="orderDetail.shippingInfo.receiverName" :disabled="!isEditing"></p>
            <p><strong>收件電話：</strong> <input type="text" class="form-control d-inline-block" style="width: 120px;" v-model="orderDetail.shippingInfo.receiverPhone" :disabled="!isEditing"></p>
            <p><strong>收件地址：</strong>
              <select class="form-control d-inline-block" style="width: 120px;" v-model="orderDetail.shippingInfo.city" :disabled="!isEditing">
                <option value="" disabled>請選擇縣市</option>
                <option v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</option>
              </select>
  
              <input type="text" class="form-control d-inline-block" style="width:250px;" v-model="orderDetail.shippingInfo.street" :disabled="!isEditing">
            </p>
          </div>
  
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="isEditing ? saveOrder() : editOrder()">
              {{ isEditing ? '儲存' : '編輯' }}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
            @click="closeDetail">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  // 定義 props
  const props = defineProps({
    isEditing: {
      type: Boolean,
      required: true,
    },
    orderDetail: {
      type: Object,
      required: true,
    },
    cities: {
      type: Array,
      required: true,
    },
  });
  
  // 定義 emit 事件
  const emit = defineEmits(['edit-order', 'save-order']);
  
  // 編輯訂單的切換方法
  const editOrder = () => {
    emit('edit-order'); // 通知父元件切換到編輯模式
  };
  
  // 儲存訂單的邏輯
  const saveOrder = () => {
    emit('save-order', orderDetail);  // 傳遞訂單資料給父元件進行儲存
  };
  </script>
  