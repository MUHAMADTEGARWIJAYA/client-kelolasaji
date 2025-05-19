<template>
  <section class="bg-gray-100 min-h-screen py-10 px-4 sm:px-6">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div class="flex justify-between items-center">\
            <router-link to="/admin/home">
              <button class="p-4 text-primary">
                <v-icon name="io-arrow-back-circle" scale="2" />
              </button>
            </router-link>
            <div>
              <h2 class="text-xl font-bold text-gray-800">ORDER #{{ data.order_id }}</h2>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(data.createdAt) }}</p>
            </div>

          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Customer Info -->
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Customer</p>
                <p class="text-black font-semibold">{{ data.customer || 'Walk-in Customer' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Table</p>
                <p class="font-semibold text-black">T{{ data.table_number }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <div class="grid grid-cols-4 bg-gray-800 p-3 text-xs font-medium text-white rounded-t-lg">
              <span class="col-span-2">ITEM</span>
              <span class="text-center">QTY</span>
              <span class="text-right">PRICE</span>
            </div>

            <div class="divide-y border-x border-b border-gray-200 rounded-b-lg">
              <div v-for="(item, index) in data.items" :key="index" class="grid grid-cols-4 p-3 text-sm">
                <span class="col-span-2 font-medium text-black">{{ item.product_name }}</span>
                <span class="text-center text-black">{{ item.quantity }}</span>
                <span class="text-right font-medium text-black">Rp{{ item.price.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="space-y-4">
            <!-- <div class="border-t border-b border-gray-200 py-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="text-gray-800">Rp{{ data.totalAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Tax (0%)</span>
                <span class="text-gray-800">Rp0</span>
              </div>
            </div> -->

            <div class="flex justify-between items-center pt-2">
              <span class="text-lg font-bold text-gray-800">TOTAL</span>
              <span class="text-xl font-bold text-blue-600">Rp{{ data.totalAmount.toLocaleString() }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select :value="data.payment_type" @change="updateOrder(data.order_id, $event.target.value)" class="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none
                shadow-sm">
                <option value="" selected disabled hidden class="text-gray-400">Select payment method</option>
                <option value="cash" class="py-2">Cash</option>
                <option value="qris" class="py-2">QRIS</option>
              </select>
            </div>

            <router-link :to="`/order-detail-dine/${data.order_id}`"
              class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg">
              Process Payment
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { useOrderDineInById } from '@/Vuex-store/user-orders-dine-in'
import { useUpdateOrderDineInStatus } from '@/Vuex-store/user-orders-dine-in'
const route = useRoute()


const orderId = route.params.id
const { data, isLoading, isError, error } = useOrderDineInById(orderId)
const { mutate: updateStatus, } = useUpdateOrderDineInStatus()

const updateOrder = (orderId, payment_type) => {
  const status = 'completed'
  updateStatus({ orderId, status, payment_type })
}
// const formatRupiah = (angka) => {
//   return new Intl.NumberFormat('id-ID').format(angka)
// }


const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('id-ID', options)
}



</script>
