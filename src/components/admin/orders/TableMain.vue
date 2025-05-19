<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Today's Orders</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Jika tidak ada order -->
        <div v-if="todayOrders.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
          <!-- Contoh SVG ilustrasi -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l1-1h4l1 1h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-semibold">Belum ada orderan masuk</p>
          <p class="text-sm text-gray-400 mt-1">Silakan tunggu pelanggan melakukan pesanan.</p>
        </div>

        <div v-for="order in todayOrders" :key="order.order_id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
          <!-- Order Card -->
          <div class="p-5 space-y-4 flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="bg-quinary text-white px-3 py-1 rounded-lg font-semibold text-sm">
                  T{{ order.table_number }}
                </div>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Dine in</span>

              </div>

              <div class="text-right">
                <span :class="statusBadgeClass(order.status)" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {{ translateStatus(order.status) }}
                </span>
                <!-- <p class="text-xs text-gray-400 mt-1">{{ getStatusSubtext(order.status) }}</p> -->
              </div>

            </div>
            <h1 class="text-sm text-gray-500"> Customer: <span class="text-quinary font-semibold">{{ order.customer
            }}</span></h1>

            <!-- Date & Time -->
            <div class="flex justify-between text-xs text-gray-500 border-b pb-3">
              <span>{{ formatDate(order.createdAt) }}</span>
              <span>{{ formatTime(order.createdAt) }}</span>
            </div>

            <!-- Item list -->
            <div class="flex-grow">
              <div class="text-sm space-y-3">
                <div class="grid grid-cols-4 font-medium text-gray-500 pb-2 border-b">
                  <span class="col-span-2">Item</span>
                  <span class="text-center">Qty</span>
                  <span class="text-right">Price</span>
                </div>

                <div class="space-y-2 pt-1">
                  <div v-for="(item, idx) in order.items.slice(0, 3)" :key="idx" class="grid grid-cols-4 text-gray-700">
                    <span class="col-span-2 truncate" :title="item.product_name">
                      {{ item.product_name }}
                    </span>
                    <span class="text-center">{{ item.quantity }}</span>
                    <span class="text-right">Rp{{ item.price.toLocaleString() }}</span>
                  </div>

                  <div v-if="order.items.length > 3" class="text-xs text-gray-400 pt-1">
                    +{{ order.items.length - 3 }} more items
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-3 border-t flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-700">Total</span>
              <span class="text-base font-bold text-gray-900">Rp{{ order.totalAmount.toLocaleString() }}</span>
            </div>

            <!-- Actions -->
            <div class="pt-3 flex justify-between items-center">
              <button @click="openModal(order)"
                class="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>

              <div class="relative">
                <select v-model="order.status" @change="updateOrder(order.order_id, order.status)"
                  class="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
                  :class="{
                    'text-amber-600 bg-amber-50 border-amber-200': order.status === 'pending',
                    'text-emerald-600 bg-emerald-50 border-emerald-200': order.status === 'completed',
                    'text-rose-600 bg-rose-50 border-rose-200': order.status === 'cancelled'
                  }">
                  <option value="pending" class="bg-white text-amber-600">On Progress</option>
                  <option value="completed" class="bg-white text-emerald-600">Completed</option>
                  <option value="cancelled" class="bg-white text-rose-600">Cancelled</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 space-y-5">
          <!-- Modal Header -->
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-bold text-gray-800">Order Details</h2>

              <p class="text-xs text-gray-500">Order ID: {{ selectedOrder.order_id }}</p>
            </div>
            <button @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Customer Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <h1 class="text-sm text-gray-500">Customer</h1>
                <h1 class="text-black font-semibold">{{ selectedOrder.customer }}</h1>

              </div>

              <div>
                <p class="text-black">Date</p>
                <p class="font-medium text-black"> {{ formatDate(selectedOrder.createdAt) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Table</p>
                <p class="font-medium text-black">T{{ selectedOrder.table_number }}</p>
              </div>
              <div>
                <p class="text-gray-500">Status</p>
                <p :class="statusBadgeClass(selectedOrder.status)" class="font-medium inline-flex items-center">
                  {{ translateStatus(selectedOrder.status) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="border rounded-lg overflow-hidden">
            <div class="grid grid-cols-4 bg-gray-100 p-3 text-xs font-medium text-gray-500">
              <span class="col-span-2">Item</span>
              <span class="text-center">Qty</span>
              <span class="text-right">Price</span>
            </div>

            <div class="divide-y text-black">
              <div v-for="(item, index) in selectedOrder.items" :key="index" class="grid grid-cols-4 p-3 text-sm">
                <span class="col-span-2 font-medium">{{ item.product_name }}</span>
                <span class="text-center">{{ item.quantity }}</span>
                <span class="text-right">Rp{{ item.price.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="space-y-2 pt-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span class="text-black">Rp{{ selectedOrder.totalAmount.toLocaleString() }}</span>
            </div>
            <!-- <div class="flex justify-between text-sm">
              <span class="text-gray-500">Tax</span>
              <span>Rp0</span>
            </div> -->
            <div class="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>Rp{{ selectedOrder.totalAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrdersDineIn } from '@/Vuex-store/user-orders-dine-in';
import { ref } from 'vue';
import { computed } from 'vue'
import { useUpdateOrderDineInStatus } from '@/Vuex-store/user-orders-dine-in';
import { onMounted, onUnmounted } from 'vue'
// Ambil tanggal hari ini (format: YYYY-MM-DD)
const { orders, refetch } = useOrdersDineIn()
const { mutate: updateStatus, } = useUpdateOrderDineInStatus()
const selectedOrder = ref(null)

console.log(orders)
let intervalId

onMounted(() => {
  intervalId = setInterval(() => refetch(), 5000) // 5000ms = 5 detik
})

onUnmounted(() => {
  clearInterval(intervalId)
})


function openModal(order) {
  selectedOrder.value = order
}
const formatDateOnly = (dateInput) => {
  const date = new Date(dateInput)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).split('/').reverse().join('-') // jadi format YYYY-MM-DD
}

const today = new Date()
const selectedDate = ref(formatDateOnly(today))
// Filter orders yang hanya untuk hari ini
const todayOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []
  return orders.value.filter(order => {
    const orderDate = formatDateOnly(order.createdAt)
    return orderDate === selectedDate.value && order.status === 'pending'
  })
})

const formatDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('id-ID', options)
}

const formatTime = (date) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleTimeString('id-ID', options)
}

console.log(orders)

const updateOrder = (orderId, status) => {
  updateStatus({ orderId, status })
}

const translateStatus = (status) => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'pending': return 'Menunggu'
    case 'cancelled': return 'Dibatalkan'
    default: return status
  }
}

const statusBadgeClass = (status) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold'
  switch (status) {
    case 'completed': return `${base} bg-green-100 text-green-700`
    case 'pending': return `${base} bg-yellow-100 text-yellow-700`
    case 'cancelled': return `${base} bg-red-100 text-red-700`
    default: return `${base} bg-gray-100 text-gray-600`
  }
}

</script>
