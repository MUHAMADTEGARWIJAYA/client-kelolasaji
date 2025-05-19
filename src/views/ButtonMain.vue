<template>
  <section class=" bg-tertiary flex items-center flex-col w-full h-fit pb-20">
    <div class="flex flex-col items-start justify-end w-full  max-w-7xl px-4 xl:px-7 pb-12 h-52">
      <img src="" alt="">
      <h1 class="text-3xl font-bold w-80  text-[#222831]">Lets order some delicious <span
          class="text-primary">FOOD</span>
      </h1>
    </div>
    <div class="flex flex-col items-center w-full min-h-screen">

      <!-- Tabs -->
      <div class="flex md:flex-row flex-col-reverse items-center w-full md:px-7  xl:px-7 px-4 max-w-7xl ">
        <div class="flex flex-row gap-3 md:w-96 w-full">
          <button v-for="tab in tabs" :key="tab.id"
            class="flex items-center space-x-2 px-4 py-2 text-sm rounded-xl flex-row font-medium transition-all"
            :class="activeTab === tab.id ? 'text-tertiary bg-primary  border-white' : 'text-[#222831] bg-white hover:bg-primary hover:text-tertiary'"
            @click="activeTab = tab.id">
            <v-icon :name="tab.icon" scale="1.5" />
            <span>{{ tab.name }}</span>
          </button>
        </div>

        <div class="w-full flex gap-3 pb-5 md:pb-0">
          <div
            class="flex items-center border w-full  focus-within:border-primary transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
            <input v-model="searchQuery" type="text" placeholder="Search for products"
              class="w-full h-full pl-4 outline-none text-black placeholder-gray-500 text-sm" />
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 30 30"
              fill="#6B7280">
              <path
                d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z">
              </path>
            </svg>
          </div>

          <router-link :to="{ name: 'cart', params: { table_id: tableId, umkm_id: umkmId } }" class=" flex items-center
            gap-3">
            <button
              class="flex items-center space-x-2 px-4 py-2 text-sm rounded-xl flex-row font-medium transition-all text-[#222831] bg-white hover:bg-primary hover:text-tertiary"><v-icon
                name="la-shopping-cart-solid" scale="1.5" /></button>
          </router-link>
        </div>
      </div>


      <!-- Content -->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 md:px-7 p-3 gap-4 mt-6 place-items-center w-full max-w-7xl">
        <div v-for="item in contentMap[activeTab]" :key="item.id"
          class="flex flex-col w-44 xl:w-56 h-auto  bg-white  items-start justify-center rounded-md py-1 px-1 xl:py-1 xl:px-2 transition">
          <router-link :to="`/detail-produk/${item._id}`">
            <img :src="item.image" alt="" class="w-56 h-56 object-cover rounded-md" />
          </router-link>

          <div>
            <h1 class="text-[#222831] text-sm xl:text-sm h-14 line-clamp-2  font-semibold">{{ item.name }}</h1>
          </div>

          <div class="flex  justify-between w-full items-center">
            <h2 class=" text-xs md:text-sm text-primary font-semibold">{{ formatIDR(item.price) }}</h2>
            <button @click="handleAddToCart(item)" class="text-primary hover:bg-primary hover:text-tertiary rounded-sm">
              <v-icon name="bi-plus-square" scale="1.5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifyStore } from '@/stores/notifikasi-toast'

const notifyStore = useNotifyStore()

const showSuccess = () => {
  notifyStore.notify("success", "Produk berhasil ditambahkan ke keranjang");
};

const showError = () => {
  notifyStore.notify("error", "Gagal menambahkan produk ke keranjang");
};


const tabs = [
  { id: 1, name: 'Food', icon: 'gi-bowl-of-rice' },
  { id: 2, name: 'Drinks', icon: 'gi-coffee-cup' },
]



const searchQuery = ref("");

// Filter berdasarkan search dan tab aktif
const filteredProducts = computed(() => {
  return products.value.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchName;
  });
});

const contentMap = computed(() => {
  return {
    1: filteredProducts.value.filter(item => item.kategory === 'makanan'),
    2: filteredProducts.value.filter(item => item.kategory === 'minuman'),
  }
});


const activeTab = ref(1)

const products = ref([])
const route = useRoute()
const fetchproduct = async () => {
  try {
    const umkmId = route.params.umkm_id
    const response = await axios.get(`http://localhost:8080/product/getby-id-umkm-param/${umkmId}`)
    products.value = response.data.products
    console.log(products)
  } catch (error) {
    console.log(error)
  }
}


const handleAddToCart = (product) => {
  try {
    // Ambil cart yang sudah ada dari localStorage, atau array kosong
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Cek apakah produk sudah ada di cart
    const existingItem = cart.find(item => item.product_id === product._id);

    if (existingItem) {
      // Jika produk sudah ada, tambahkan quantity-nya
      existingItem.quantity += 1;
    } else {
      // Jika belum, tambahkan sebagai item baru
      cart.push({
        product_id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    showSuccess()
  } catch (error) {
    showError()
    console.error("Gagal menyimpan ke keranjang:", error);
  }
};

onMounted(() => {
  fetchproduct()
})

const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}
</script>
