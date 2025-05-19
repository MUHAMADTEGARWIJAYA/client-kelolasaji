<template>
  <div class="p-6 max-w-7xl mx-auto bg-tertiary">
    <div class="bg-quinary text-white rounded-lg p-4 w-64 shadow-md relative overflow-hidden">
      <div class="text-sm font-medium">Total uang masuk Take Away</div>
      <div v-if="isLoading" class="text-lg mt-1">Loading...</div>

      <div v-else class="text-2xl font-bold mt-1">{{ formatIDR(totalIncome) }}</div>

      <!-- Decorative Circles -->
      <div class="absolute -bottom-4 -left-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
      <div class="absolute -bottom-2 right-0 w-28 h-28 bg-white opacity-20 rounded-full"></div>
    </div>
    <div class="flex justify-between items-center mb-2 mt-10">
      <h2 class="text-3xl font-bold text-quaternary">Daftar Pesanan Cashier</h2>
      <div class="flex gap-3">
        <!-- <button @click="printTable"
          class="bg-quinary text-white px-4 py-2 rounded-lg text-sm font-medium shadow non-print">
          <v-icon name="bi-printer" scale="1.5" />
        </button> -->

        <!-- Tombol Export Excel dengan kelas non-print -->
        <button @click="exportToExcel"
          class="bg-quinary text-white px-4 py-2 rounded-lg text-sm font-medium shadow non-print">
          <v-icon name="bi-file-earmark-excel-fill" scale="1.5" class="inline-block mr-1" />
          Export Excel
        </button>
      </div>
    </div>

    <!-- Filter Tanggal -->
    <div class="mb-4 flex items-center gap-4">
      <label for="date" class="text-quaternary text-sm font-medium">Filter Tanggal:</label>
      <input id="date" type="date" v-model="selectedDate"
        class="border border-gray-300 rounded px-3 py-1 text-sm text-quaternary" />
    </div>

    <div v-if="isLoading" class="text-center py-10 text-quaternary">Loading data...</div>

    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table class="min-w-full text-sm text-quaternary">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left font-semibold">#</th>
            <th class="px-6 py-4 text-left font-semibold">Customer</th>
            <th class="px-6 py-4 text-left font-semibold">Total</th>
            <th class="px-6 py-4 text-left font-semibold">Status</th>
            <th class="px-6 py-4 text-left font-semibold">Jumlah Item</th>
            <th class="px-6 py-4 text-left font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedOrders.length === 0">
            <td colspan="8" class="text-center py-10 text-gray-500">
              Tidak ada pesanan yang ditemukan untuk tanggal ini.
            </td>
          </tr>
          <tr v-for="(order, index) in paginatedOrders" :key="order._id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-6 py-4 font-medium text-blue-600">
              {{ order.customer }}
            </td>

            <td class="px-6 py-4 text-green-700 font-semibold">Rp{{ order.totalAmount.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span :class="statusBadgeClass(order.status)">
                {{ translateStatus(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <ul>
                <li v-for="(item, idx) in order.items" :key="idx">
                  Nama : {{ item.product_name }} <br /> Total item : {{ item.quantity }} <br> harga satuan: Rp{{
                    item.price.toLocaleString() }}
                </li>
              </ul>
            </td>

            <td class="px-6 py-4 space-y-3 ">
              <!-- Dropdown Status with SVG indicators -->
              <div class="relative">
                <select v-model="order.status" @change="updateOrder(order.order_id, order.status)"
                  class="appearance-none border w-full border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm  bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                  :class="{
                    // 'text-amber-500 bg-amber-50': order.status === 'pending',
                    'text-emerald-600 bg-emerald-50': order.status === 'completed',
                    'text-rose-600 bg-rose-50': order.status === 'cancelled'
                  }">
                  <!-- <option value="pending" class="bg-white text-amber-500">On Progress</option> -->
                  <option value="completed" class="bg-white text-emerald-600">Completed</option>
                  <option value="cancelled" class="bg-white text-rose-600">Cancelled</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <!-- Action Buttons with SVG icons -->
              <div class="flex items-center gap-3">
                <!-- View Detail Button -->
                <router-link :to="`/order-detail-take/${order.order_id}`" class="group bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 px-4 py-2 rounded-lg
                  text-sm flex items-center gap-2 transition-all duration-200 border border-green-100
                  hover:border-green-200 shadow-xs hover:shadow-sm">
                  <!-- <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg> -->
                  <v-icon name="bi-printer" scale="0.9" />
                </router-link>

                <button class="group bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg
                  text-sm flex items-center gap-2 transition-all duration-200 border border-blue-100
                  hover:border-blue-200 shadow-xs hover:shadow-sm" @click="openModal(order)">
                  <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </svg>
                </button>


                <!-- Delete Button -->
                <!-- <button
                  class="group bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 border border-rose-100 hover:border-rose-200 shadow-xs hover:shadow-sm">
                  <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>

                </button> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders?.length" class="flex justify-between items-center mt-6 text-sm">
      <p class="text-quaternary">
        Total {{ filteredOrders.length }} Orders pada {{ selectedDate }}
      </p>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded border bg-quinary">
          <v-icon name="md-skipprevious-round" scale="1.5" />
        </button>
        <span class="px-3 py-1 text-quaternary">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 rounded border bg-quinary">
          <v-icon name="md-skipnext-round" scale="1.5" />
        </button>
      </div>
    </div>

    <!-- Modal  -->
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
              <!-- <div>
                <p class="text-gray-500">Table</p>
                <p class="font-medium text-black">T{{ selectedOrder.table_number }}</p>
              </div> -->
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
    <!-- Modal End -->
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useOrders } from '@/Vuex-store/use-orders'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useUpdateOrderStatus } from '@/Vuex-store/use-orders'

const selectedOrder = ref(null)


// Ambil data dari store
const { orders, isLoading, refetch } = useOrders()


const { mutate: updateStatus, } = useUpdateOrderStatus()

console.log(orders)

const updateOrder = (orderId, status) => {
  updateStatus({ orderId, status }, {
    onSuccess: () => {
      refetch() // panggil ulang data pesanan
    },
    onError: (err) => {
      console.error('Gagal update status:', err)
    }
  })
}

function openModal(order) {
  selectedOrder.value = order
}


const currentPage = ref(1)
const itemsPerPage = 10

// Format tanggal lokal (WIB)
const formatDateOnly = (dateInput) => {
  const date = new Date(dateInput)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).split('/').reverse().join('-') // jadi format YYYY-MM-DD
}

// Tanggal default hari ini
const today = new Date()
const selectedDate = ref(formatDateOnly(today))

const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// Dapatkan tanggal hari ini dalam format YYYY-MM-DD

// Hitung total income hari ini
const totalIncome = computed(() => {
  return filteredOrders.value
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
})
// Filter berdasarkan tanggal lokal (WIB)
const filteredOrders = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return []
  return orders.value.filter(order => {
    const orderDate = formatDateOnly(order.createdAt)
    return orderDate === selectedDate.value
  })
})

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Export ke Excel
const exportToExcel = () => {
  const data = filteredOrders.value.map((order, index) => ({
    No: index + 1,
    Customer: order.customer,
    Total: order.totalAmount,
    Status: translateStatus(order.status),
    JumlahItem: order.items.reduce((total, item) => total + item.quantity, 0),
    Tanggal: formatDate(order.createdAt),
    // Menggabungkan detail item dalam satu kolom
    Items: order.items.map(item => `Nama: ${item.product_name}, Jumlah: ${item.quantity}, Harga: Rp${item.price.toLocaleString()}`).join(' | '),
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, `Daftar_Pesanan_${selectedDate.value}.xlsx`)
}

// Translate status dan styling badge
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

// Format tanggal tampil
const formatDate = (isoDate) => {
  const date = new Date(isoDate)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  })
}

// Print
// const printTable = () => {
//   window.print()
// }
</script>


<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  table,
  table * {
    visibility: visible;
  }

  table {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  button,
  .pagination,
  .non-print {
    display: none !important;
  }
}
</style>
