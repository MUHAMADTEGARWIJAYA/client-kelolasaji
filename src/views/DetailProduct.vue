<template>
  <div class="min-h-screen bg-gray-50 flex  justify-center p-4">
    <div class="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Back Button -->
      <div class="px-2 pt-6">
        <button @click="goBack" class="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Back to previous page">
          <v-icon name="io-arrow-back-circle" scale="1.8" />
        </button>
      </div>

      <!-- Product Section -->
      <div v-if="product" class="container mx-auto px-4 py-6 md:py-8">
        <div class="max-w-6xl mx-auto md:flex gap-8">
          <!-- Product Image -->
          <div class="md:w-1/2 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
            <img :src="productData.image" :alt="productData.name"
              class="h-64 w-full object-cover md:h-80 lg:h-96 transition-all duration-300 hover:scale-105"
              loading="lazy" />
          </div>

          <!-- Product Details -->
          <div class="md:w-1/2 py-6 md:py-8">
            <div class="flex flex-col space-y-4">
              <div>
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wider mb-2"
                  :class="{
                    'bg-green-500': productData.kategory === 'makanan',
                    'bg-blue-500': productData.kategory === 'minuman',
                    'bg-purple-500': productData.kategory === 'lainnya'
                  }">
                  {{ productData.kategory }}
                </span>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ productData.name }}
                </h1>
                <div class="mt-2 flex items-center">
                  <span class="text-2xl font-bold text-[#FFBF01]">
                    Rp {{ productData.price.toLocaleString('id-ID') }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-4 border-t border-gray-100 pt-6">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                <p class="text-gray-600 leading-relaxed whitespace-pre-line">
                  {{ productData.description }}
                </p>
              </div>

              <!-- Add to Cart Button -->
              <div class="mt-8">
                <button @click="handleAddToCart(product.product)"
                  class="w-full bg-gradient-to-r from-[#FFBF01] to-amber-400 hover:from-amber-400 hover:to-[#FFBF01] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
                  <div class="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center h-96">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-[#FFBF01] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
const route = useRoute()
const productId = route.params.product_id

const product = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/product/getby-id/${productId}`)
    product.value = res.data
  } catch (error) {
    console.error('Gagal mengambil data produk:', error)
  }
})
console.log(product)
const handleAddToCart = (product) => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existingItem = cart.find(item => item.product_id === product._id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        product_id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Produk ditambahkan ke keranjang (disimpan di localStorage)')
  } catch (error) {
    console.error('Gagal menyimpan ke keranjang:', error)
  }
}

const productData = computed(() => product.value?.product)

</script>

<style scoped>
.bg-primary {
  background-color: #00ADB5;
}

.bg-primary-dark {
  background-color: #00878c;
}
</style>
