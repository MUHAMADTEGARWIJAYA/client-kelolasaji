<template>
  <div class="min-h-screen text-black bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Produk Saya</h1>
          <p class="text-gray-600 mt-2">Kelola produk UMKM Anda</p>
        </div>
        <button @click="openCreateModal"
          class="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
          Tambah Produk
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0 && !isLoading" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mx-auto w-24 h-24 text-gray-300 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700">Belum ada produk</h3>
        <p class="text-gray-500 mt-1 mb-4">Mulai dengan menambahkan produk pertama Anda</p>
        <button @click="openCreateModal"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Tambah Produk
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div class="bg-gray-200 h-48 w-full"></div>
          <div class="p-4">
            <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="flex justify-between">
              <div class="h-8 bg-gray-200 rounded w-20"></div>
              <div class="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-if="products.length > 0 && !isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product._id" :class="{ 'opacity-50 grayscale': !product.isActive }"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div class="relative">
            <img :src="product.image || 'https://via.placeholder.com/300x200?text=No+Image'" alt="Product Image"
              class="w-full h-48 object-cover" />
            <div class="absolute top-2 right-2">
              <span class="bg-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow">
                {{ product.kategory || 'Uncategorized' }}
              </span>
            </div>
          </div>
          <div class="p-5">
            <div class="flex justify-between items-center mb-3">
              <span v-if="!product.isActive" class="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded">
                Tidak Aktif
              </span>
              <button @click="toggleProductStatus(product)" class="text-xs text-blue-600 hover:underline">
                {{ product.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </div>

            <div class="flex justify-between items-start mb-1">
              <h3 class="text-lg font-semibold text-gray-800 line-clamp-1">{{ product.name }}</h3>
              <span class="text-lg font-bold text-blue-600 whitespace-nowrap">Rp{{ formatPrice(product.price) }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-end space-x-3">
              <button @click="openEditModal(product)"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button @click="confirmDelete(product._id)"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal container -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
                  </h3>
                  <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                      <input v-model="form.name" id="name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                      <textarea v-model="form.description" id="description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>

                    <div>
                      <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                      <input v-model="form.price" id="price" type="number" min="0" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                      <label for="kategory" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <select v-model="form.kategory" id="kategory"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Pilih Kategori</option>
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                      </select>
                    </div>


                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
                      <div class="mt-1 flex items-center">
                        <div v-if="!imagePreview && currentProduct?.image" class="mr-4">
                          <img :src="currentProduct.image" class="h-16 w-16 object-cover rounded-md" />
                          <p class="text-xs text-gray-500 mt-1">Gambar saat ini</p>
                        </div>
                        <div v-if="imagePreview" class="mr-4">
                          <img :src="imagePreview" class="h-16 w-16 object-cover rounded-md" />
                          <p class="text-xs text-gray-500 mt-1">Gambar baru</p>
                        </div>
                        <div>
                          <label for="file-upload"
                            class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span>{{ imagePreview ? 'Ganti' : 'Pilih' }} Gambar</span>
                            <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImage"
                              accept="image/*" />
                          </label>
                          <button v-if="imagePreview" @click="clearImage" type="button"
                            class="ml-2 text-sm text-red-600 hover:text-red-800">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" @click="handleSubmit" :disabled="isSubmitting"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isSubmitting">{{ isEdit ? 'Update Produk' : 'Tambah Produk' }}</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Processing...
                </span>
              </button>
              <button type="button" @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Konfirmasi Penghapusan
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" @click="deleteProduct" :disabled="isDeleting"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isDeleting">Hapus</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Menghapus...
                </span>
              </button>
              <button type="button" @click="showDeleteModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import axiosInstance from '@/utils/axios'

const products = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const productToDelete = ref(null)
const imagePreview = ref(null)

const form = ref({
  name: '',
  description: '',
  price: '',
  kategory: '',
  image: null,
})

const currentProduct = ref(null)

const fetchProducts = async () => {
  try {
    isLoading.value = true
    const res = await axiosInstance.get('product/getby-id-umkm')
    products.value = res.data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    // Show error notification in a real app
  } finally {
    isLoading.value = false
  }
}


const toggleProductStatus = async (product) => {
  try {
    const newStatus = !product.isActive;
    await axiosInstance.put(`product/set-active-status/${product._id}`, {
      isActive: newStatus,
    });

    product.isActive = newStatus; // update local state
  } catch (error) {
    console.error('Error updating product status:', error);
  }
};


const openCreateModal = () => {
  resetForm()
  isEdit.value = false
  currentProduct.value = null
  showModal.value = true
}

const openEditModal = (product) => {
  isEdit.value = true
  currentProduct.value = product
  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    kategory: product.kategory,
    image: null,
  }
  imagePreview.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

console.log(products);

const handleImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    const reader = new FileReader()
    reader.onload = (event) => {
      imagePreview.value = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  form.value.image = null
  imagePreview.value = null
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const formData = new FormData()

    // Append all form fields
    Object.entries(form.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    if (isEdit.value && currentProduct.value?._id) {
      await axiosInstance.put(`/product/update/${currentProduct.value._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      await axiosInstance.post('/product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }

    await fetchProducts()
    closeModal()
  } catch (error) {
    console.error('Error submitting product:', error)
    // Show error notification in a real app
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (id) => {
  productToDelete.value = id
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  try {
    isDeleting.value = true
    await axiosInstance.delete(`/product/delete/${productToDelete.value}`)
    await fetchProducts()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting product:', error)
    // Show error notification in a real app
  } finally {
    isDeleting.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: '',
    kategory: '',
    image: null,
  }
  currentProduct.value = null
  imagePreview.value = null
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Custom transitions and animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
