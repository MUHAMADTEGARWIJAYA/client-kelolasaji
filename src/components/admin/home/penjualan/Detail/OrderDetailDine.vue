<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
    <!-- Improved Loading State -->
    <div v-if="isLoading" class="w-full max-w-xs bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <div class="animate-pulse space-y-6">
        <!-- Header Loading -->
        <div class="flex flex-col items-center space-y-3">
          <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div class="h-6 w-40 bg-gray-200 rounded"></div>
          <div class="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        <!-- Order Info Loading -->
        <div class="space-y-2 px-2 py-3 bg-gray-50 rounded">
          <div class="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
          <div class="h-3 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>

        <!-- Items Loading -->
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex justify-between">
            <div class="space-y-2 w-3/4">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>

        <!-- Total Loading -->
        <div class="flex justify-between pt-4 border-t border-gray-200">
          <div class="h-5 bg-gray-200 rounded w-16"></div>
          <div class="h-6 bg-gray-200 rounded w-20"></div>
        </div>

        <!-- Footer Loading -->
        <div class="space-y-2 pt-4 border-t border-gray-200">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Skeleton buttons -->
      <div class="mt-8 flex gap-4 justify-center">
        <div class="h-12 bg-gray-200 rounded-lg w-32"></div>
        <div class="h-12 bg-gray-200 rounded-lg w-32"></div>
      </div>
    </div>

    <div v-else-if="isError" class="text-center text-red-500 p-4 bg-red-50 rounded-lg max-w-md">
      <!-- Error state remains the same -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Gagal mengambil order:<br>
      <span class="font-medium">{{ error.message }}</span>
    </div>

    <!-- Rest of your template remains the same -->
    <div v-else ref="receiptContent" class="w-full max-w-xs bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <!-- Receipt Header -->
      <div class="text-center mb-4">
        <div class="flex justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800">STRUK PEMBAYARAN</h2>
        <p class="text-xs text-gray-500 mt-1">Toko Maju Jaya</p>
      </div>

      <!-- Customer Information -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">INFORMASI PELANGGAN</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p class="text-gray-500">Nama</p>
            <p class="font-medium text-black">{{ data.customer || '-' }}</p>
          </div>
          <!-- <div>
            <p class="text-gray-500">No. HP</p>
            <p class="font-medium">{{ data.customer_phone || '-' }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-gray-500">Email</p>
            <p class="font-medium">{{ data.customer_email || '-' }}</p>
          </div> -->
        </div>
      </div>

      <!-- Order Info -->
      <div class="text-center text-xs text-gray-600 mb-6 px-2 py-1 bg-gray-50 rounded">
        <p>ID: <span class="font-medium">{{ data.order_id }}</span></p>
        <p>{{ formatDate(data.createdAt) }}</p>
        <p class="mb-1">Meja : {{ data.table_number || 'Take Away' }}</p>
      </div>

      <!-- Items List -->
      <div class="mb-4">
        <div v-for="(item, index) in data.items" :key="index"
          class="flex justify-between items-start py-2 border-b border-gray-100">
          <div class="w-3/4">
            <p class="font-medium text-gray-800 leading-tight">{{ item.product_name }}</p>
            <p class="text-xs text-gray-500 leading-none mt-1">@ Rp{{ formatRupiah(item.price) }} × {{ item.quantity }}
            </p>
          </div>
          <p class="text-right font-medium text-gray-800">Rp{{ formatRupiah(item.total) }}</p>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="mb-3 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">INFORMASI PEMBAYARAN</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p class="text-gray-500">Metode</p>
            <p class="font-medium capitalize text-black">{{ data.payment_type || 'Tunai' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Status</p>
            <p class="font-medium capitalize text-black">{{ data.status || 'Lunas' }}</p>
          </div>
          <div v-if="data.payment_reference" class="col-span-2">
            <p class="text-gray-500">Referensi</p>
            <p class="font-medium">{{ data.payment_reference }}</p>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span class="font-bold text-gray-800">TOTAL</span>
        <span class="text-lg font-bold text-blue-600">Rp{{ formatRupiah(data.totalAmount) }}</span>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-gray-500">
        <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
        <p class="mt-2">Terima kasih telah berbelanja</p>
        <p class="mt-1 text-gray-400">www.tokomajujaya.com</p>
      </div>
    </div>

    <!-- Print Button -->
    <div v-if="!isLoading" class="mt-8 flex gap-4">
      <button @click="printReceipt"
        class="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Cetak Struk
      </button>
      <router-link to="/admin/home"
        class="flex items-center justify-center bg-quinary text-white py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105">
        <v-icon name="bi-shop" scale="1.5" class="" />
        Ke Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderDineInById } from '@/Vuex-store/user-orders-dine-in'


const route = useRoute()
const orderId = route.params.id
const { data, isLoading, isError, error } = useOrderDineInById(orderId)

const receiptContent = ref(null)

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID').format(angka)
}

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

const printReceipt = () => {
  if (!data.value) return // Add null check

  // Prepare the data for printing
  const printData = {
    customer: data.value.customer,
    status: data.value.status,
    table_number: data.value.table_number,
    order_id: data.value.order_id,
    createdAt: data.value.createdAt,
    items: data.value.items,
    totalAmount: data.value.totalAmount
  }

  const printWindow = window.open('', '', 'width=340,height=600')

  printWindow.document.write(`
  <html>
    <head>
      <title>Cetak Struk #${printData.order_id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto Mono', monospace;
          padding: 16px;
          background-color: white;
          -webkit-print-color-adjust: exact;
        }
        .receipt {
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          padding: 20px;
          border: 1px dashed #e2e8f0;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          margin-bottom: 16px;
        }
        .info-card {
          background-color: #f8fafc;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .info-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #334155;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
        }
        .info-full {
          grid-column: span 2;
        }
        .info-label {
          color: #64748b;
        }
        .info-value {
          font-weight: 500;
        }
        .order-info {
          text-align: center;
          font-size: 12px;
          margin-bottom: 16px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #e2e8f0;
        }
        .total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          padding-top: 12px;
          border-top: 2px solid #e2e8f0;
          margin-top: 8px;
        }
        .footer {
          margin-top: 24px;
          font-size: 11px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h2 style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">STRUK PEMBAYARAN</h2>
          <p style="font-size: 11px; color: #64748b;">Toko Maju Jaya</p>
        </div>

        <!-- Customer Information -->
        <div class="info-card">
          <div class="info-title">INFORMASI PELANGGAN</div>
          <div class="info-grid">
            <div>
              <p class="info-label">Nama</p>
              <p class="info-value">${printData.customer || '-'}</p>
            </div>

          </div>
        </div>

        <!-- Order Info -->
        <div class="order-info">
          <p>ID: <strong>${printData.order_id}</strong></p>
          <p>${formatDate(printData.createdAt)}</p>
          <p>Meja : ${printData.table_number || 'Take Away'}</p>
        </div>

        <!-- Items List -->
        <div class="items">
          ${printData.items.map(item => `
            <div class="item">
              <div style="width: 70%;">
                <p style="font-weight: 500; margin-bottom: 2px;">${item.product_name}</p>
                <p style="font-size: 11px; color: #64748b;">
                  @ Rp${formatRupiah(item.price)} × ${item.quantity}
                </p>
              </div>
              <p style="font-weight: 500;">Rp${formatRupiah(item.total)}</p>
            </div>
          `).join('')}
        </div>

        <!-- Payment Information -->
        <div class="info-card" style="margin-top: 16px;">
          <div class="info-title">INFORMASI PEMBAYARAN</div>
          <div class="info-grid">
            <div>
              <p class="info-label">Metode</p>
              <p class="info-value">${(printData.payment_type || 'Tunai').toLowerCase()}</p>
            </div>
            <div>
              <p class="info-label">Status</p>
              <p class="info-value">${(printData.status || 'Lunas').toLowerCase()}</p>
            </div>
            ${printData.payment_reference ? `
              <div class="info-full">
                <p class="info-label">Referensi</p>
                <p class="info-value">${printData.payment_reference}</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Total -->
        <div class="total">
          <span>TOTAL</span>
          <span style="color: #2563eb; font-size: 18px;">Rp${formatRupiah(printData.totalAmount)}</span>
        </div>

        <div class="footer">
          <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
          <p style="margin-top: 8px;">Terima kasih telah berbelanja</p>
          <p style="margin-top: 4px; color: #cbd5e1;">www.tokomajujaya.com</p>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 200);
        }
      <\/script>
    </body>
  </html>
`)

  printWindow.document.close()
}
</script>
