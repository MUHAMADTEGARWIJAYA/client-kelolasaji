<template>
  <section class="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-10 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

      <router-link :to="{ name: 'menu', params: { table_id: tableId, umkm_id: umkmId } }">
        <button class="p-4 text-primary">
          <v-icon name="io-arrow-back-circle" scale="2" />
        </button>
      </router-link>

      <div class="p-6 sm:p-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="md:text-3xl font-bold text-[#222831]">Keranjang Pesanan</h1>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {{ cart.length }} item{{ cart.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <div v-if="cart.length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-gray-500 text-lg">Keranjang kamu kosong</p>
          <p class="text-gray-400 mt-2">Mulai belanja dan tambahkan item</p>
        </div>

        <div v-else>
          <div class="divide-y divide-gray-100">
            <div v-for="item in cart" :key="item.product_id" class="py-5 first:pt-0 last:pb-0">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-20 h-20 ">
                      <img :src="item.image" alt="Product Image"
                        class="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                    </div>

                    <div
                      class="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {{ item.quantity }}
                    </div>
                  </div>
                  <div>
                    <h2 class="font-semibold text-sm xl:text-lg text-[#222831]">{{ item.name }}</h2>
                    <p class="text-gray-500 text-sm mt-1">{{ formatIDR(item.price) }} per item</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div
                    class="flex flex-col md:flex-row items-center gap-2 w-12 md:w-auto bg-gray-50 rounded-lg px-2 py-1">
                    <button @click="decrement(item.product_id)"
                      class="w-7 h-7 rounded-md hover:bg-gray-200 text-lg font-bold text-gray-600 transition-colors">-</button>
                    <span class="w-6 text-center text-[#222831]">{{ item.quantity }}</span>
                    <button @click="increment(item.product_id)"
                      class="w-7 h-7 rounded-md hover:bg-gray-200 text-lg font-bold text-gray-600 transition-colors">+</button>
                  </div>
                  <button @click="removeFromCart(item.product_id)"
                    class="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mt-3 pl-24">
                <p class="font-semibold text-primary">{{ formatIDR(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8 border-t border-gray-100 pt-6">
            <div class="flex justify-between items-center text-[#222831] font-bold text-lg mb-2">
              <span>SubTotal</span>
              <span>{{ formatIDR(totalPrice) }}</span>
            </div>
            <p class="text-right text-gray-500 text-sm">Termasuk pajak dan biaya lainnya</p>
          </div>
        </div>
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
          <input v-model="customerName" type="text" placeholder="Masukkan nama customer"
            class="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div class="mt-10 flex justify-end">
          <button @click="placeOrder" :disabled="cart.length === 0"
            class="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="isOrdering">Memproses...</span>
            <span v-else>Order Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useNotifyStore } from '@/stores/notifikasi-toast'

const route = useRoute()
const cart = ref([])
const customerName = ref('')
const isOrdering = ref(false)
const notifyStore = useNotifyStore()

const showSuccess = () => {
  notifyStore.notify("success", "Pesanan berhasil diproses");
};

const showError = () => {
  notifyStore.notify("error", "Gagal memproses pesanan");
};

const showWarning = () => {
  notifyStore.notify("warn", "Nama Harus Diisi");
};

onMounted(() => {
  const storedCart = localStorage.getItem('cart')
  cart.value = storedCart ? JSON.parse(storedCart) : []
})

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

watch(cart, () => {
  saveCart()
}, { deep: true })

const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.product_id !== id)
  saveCart()
}

const increment = (id) => {
  const item = cart.value.find(i => i.product_id === id)
  if (item) {
    item.quantity++
  }
}

const decrement = (id) => {
  const item = cart.value.find(i => i.product_id === id)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})


const api = import.meta.env.VITE_API_URL
const placeOrder = async () => {
  if (cart.value.length === 0) {
    showWarning()  // Showing warning notification if cart is empty
    return
  }

  const tableId = route.params.table_id
  const umkmId = route.params.umkm_id

  if (!tableId || !umkmId) {
    showError()  // Showing error notification if tableId or umkmId is missing
    return
  }

  if (!customerName.value) {
    showWarning()  // Showing warning notification if customerName is empty
    return
  }

  const orderPayload = {
    customer: customerName.value,
    items: cart.value.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }))
  }

  if (isOrdering.value) return // prevent multiple clicks
  isOrdering.value = true

  try {
    const response = await axios.post(`${api}order/order/${tableId}/${umkmId}`, orderPayload)

    if (response.data && response.data.message === 'Order berhasil dibuat') {
      showSuccess()  // Showing success notification if order is successfully placed
      cart.value = []
      localStorage.removeItem('cart')
    }
  } catch (error) {
    console.error(error)
    showError()  // Showing error notification if there's an error during the request
  } finally {
    isOrdering.value = false
  }
}
</script>
