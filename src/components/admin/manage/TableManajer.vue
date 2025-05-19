<template>
  <div class="w-full bg-tertiary">
    <div class="max-w-4xl mx-auto p-6 text-black bg-tertiary">
      <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Table Management</h1>
            <p class="text-gray-600">Manage restaurant tables and generate QR codes</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <span class="text-blue-800 font-medium">Total Tables: {{ tables.length }}</span>
          </div>
        </div>

        <!-- Form Section -->
        <div class="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            {{ isEditing ? 'Edit Table' : 'Add New Table' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="tableNumber" class="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
              <input v-model="form.number" id="tableNumber" type="text" placeholder="Enter table number"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required />
            </div>
            <div class="flex space-x-3">
              <button type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {{ isEditing ? 'Update Table' : 'Add Table' }}
              </button>
              <button v-if="isEditing" @click="cancelEdit" type="button"
                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Tables List Section -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-700">Tables List</h2>
            <!-- <div class="relative">
            <input type="text" placeholder="Search tables..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div> -->
          </div>

          <div v-if="tables.length === 0" class="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              </path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No tables</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by adding a new table.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="table in tables" :key="table._id"
              class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div class="p-5">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <div class="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">Table #{{ table.number }}</h3>
                      <!-- <p class="text-sm text-gray-500">ID: {{ table._id }}</p> -->
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="startEdit(table)"
                      class="inline-flex items-center px-3 py-1.5 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      Edit
                    </button>
                    <button @click="deleteTable(table._id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                      Delete
                    </button>
                    <button @click="generateQRCode(table._id)"
                      class="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z">
                        </path>
                      </svg>
                      QR Code
                    </button>
                  </div>
                </div>

                <!-- QR Code Section -->
                <div v-if="qrCodes[table._id]"
                  class="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-inner">
                    <img :src="qrCodes[table._id].qrCodeImage" alt="QR Code" class="w-40 h-40" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">QR Code Details</h4>
                    <div class="bg-gray-50 p-3 rounded-lg">
                      <p class="text-sm text-gray-600 break-all mb-2">
                        <span class="font-medium">URL:</span> {{ qrCodes[table._id].url }}
                      </p>
                      <button @click="downloadQRCode(table)"
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/utils/axios'
import { useNotifyStore } from '@/stores/notifikasi-toast'

const notifyStore = useNotifyStore()
const form = ref({ number: '' })
const tables = ref([])
const isEditing = ref(false)
const editId = ref(null)
const qrCodes = ref({})

const showSuccess = () => {
  notifyStore.notify("success", "Tabel Berhasil ditambahkan");
};

const showError = () => {
  notifyStore.notify("error", "Gagal menambahkan tabel");
};

// const showWarning = () => {
//   notifyStore.notify("warn", "Nama Harus Diisi");
// };


const fetchTables = async () => {
  try {
    const res = await axiosInstance.get('/number/getall')
    tables.value = res.data.tables
  } catch (err) {
    alert('Failed to load tables data')
    console.error(err)
  }
}

const downloadQRCode = (table) => {
  if (!qrCodes.value[table._id]) return;

  const link = document.createElement('a');
  link.href = qrCodes.value[table._id].qrCodeImage;
  link.download = `qrcode_table_${table.number}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Untuk browser yang tidak support download attribute
  setTimeout(() => {
    const win = window.open();
    win.document.write(`<img src="${qrCodes.value[table._id].qrCodeImage}" onload="setTimeout(() => window.print(), 500)" />`);
    win.document.close();
  }, 100);
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await axiosInstance.put(`/number/update/${editId.value}`, { number: form.value.number })
      showSuccess()
    } else {
      await axiosInstance.post('/number/create', form.value)
      showSuccess()
    }
    form.value.number = ''
    isEditing.value = false
    editId.value = null
    fetchTables()
  } catch (err) {
    showError()
    console.error(err)
  }
}

const deleteTable = async (id) => {
  if (!confirm('Are you sure you want to delete this table?')) return
  try {
    await axiosInstance.delete(`/number/delete/${id}`)
    fetchTables()
  } catch (err) {
    showError()
    console.error(err)
  }
}

const startEdit = (table) => {
  form.value.number = table.number
  editId.value = table._id
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  form.value.number = ''
}

const generateQRCode = async (tableId) => {
  try {
    const res = await axiosInstance.get(`/number/generate-qr/${tableId}`)
    qrCodes.value[tableId] = {
      qrCodeImage: res.data.qrCodeImage,
      url: res.data.url
    }
  } catch (err) {
    alert('Failed to generate QR Code')
    console.error(err)
  }
}

onMounted(fetchTables)
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button,
input,
.border,
.shadow,
.bg-gray-50 {
  transition: all 0.2s ease-in-out;
}

/* Custom shadow for cards */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Hover effect for table cards */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
