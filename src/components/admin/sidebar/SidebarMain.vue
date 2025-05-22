<template>
  <div class="">
    <button @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 p-2 bg-quinary rounded-lg transition-all duration-300  ease-in-out md:hidden"
      :class="isSidebarOpen ? 'translate-x-24' : 'translate-x-0'">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- Sidebar -->
    <div :class="[
      'fixed top-0 left-0 h-screen w-24 pt-5 justify-between flex flex-col bg-white shadow-lg border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0' // tetap tampil di xl ke atas
    ]">
      <!-- Logo/Sidebar Header -->
      <div class="flex items-center justify-center h-16 px-2 border-b border-gray-200">
        <img src="/logo.png" alt="">
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 px-4 md:py-6 md:space-y-7">
        <router-link to="/admin/home" class="flex items-center flex-col p-3 rounded-lg transition-all cursor-pointer"
          :class="{ 'bg-[#f44c31] text-white font-bold': route.path === '/admin/home', 'text-gray-700 hover:bg-[#f44b3180] hover:text-white': route.path !== '/admin/home' }">
          <v-icon name="bi-shop" scale="1.5" class="" />
          <p class="font-medium text-xs pt-2">Home</p>
        </router-link>

        <router-link to="/admin/orders"
          class="flex items-center flex-col p-3 rounded-lg transition-all cursor-pointer relative"
          :class="{ 'bg-[#f44c31] text-white font-bold': route.path === '/admin/orders', 'text-gray-700 hover:bg-[#f44b3180] hover:text-white': route.path !== '/admin/orders' }">
          <v-icon name="bi-chat-left-heart" scale="1.5" />
          <span class="font-medium text-xs pt-2">Orders</span>
          <!-- <span class="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">5</span> -->
        </router-link>

        <router-link to="/admin/menumanaje"
          class="flex items-center flex-col p-3 rounded-lg transition-all cursor-pointer"
          :class="{ 'bg-[#f44c31] text-white font-bold': route.path === '/admin/menumanaje', 'text-gray-700 hover:bg-[#f44b3180] hover:text-white': route.path !== '/admin/menu' }">
          <v-icon name="md-restaurantmenu-outlined" sclae="1.5" />
          <span class="font-medium text-xs pt-2">Menu</span>
        </router-link>

        <router-link to="/admin/cashier" class="flex items-center flex-col p-3 rounded-lg transition-all cursor-pointer"
          :class="{ 'bg-[#f44c31] text-white font-bold': route.path === '/admin/cashier', 'text-gray-700 hover:bg-[#f44b3180] hover:text-white': route.path !== '/admin/cashier' }">
          <v-icon name="bi-cash-coin" scale="1.5" />
          <span class="font-medium text-xs pt-2">Cashier</span>
        </router-link>

        <router-link to="/admin/manage" class="flex items-center flex-col p-3 rounded-lg transition-all cursor-pointer"
          :class="{ 'bg-[#f44c31] text-white font-bold': route.path === '/admin/manage', 'text-gray-700 hover:bg-[#f44b3180] hover:text-white': route.path !== '/admin/reports' }">
          <v-icon name="io-document-text-sharp" scale="1.5" />
          <span class="font-medium text-xs pt-2">Manage</span>
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200">
        <button @click="handleLogout"
          class="flex items-center flex-col p-3  text-gray-700 rounded-lg transition-all cursor-pointer">
          <v-icon name="ri-logout-circle-line" scale="1.5" />
          <span class="font-medium text-xs pt-2">Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue';
import { useAuthProvider } from '@/stores/auth-provider';
import { useRouter } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';


const router = useRouter(); // 🔥 untuk navigasi push
const queryClient = useQueryClient()
const route = useRoute()
const authStore = useAuthProvider()
const isSidebarOpen = ref(false); // State untuk toggle sidebar

// Fungsi untuk toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout()

    // Hapus semua data cache setelah logout
    await queryClient.clear() // ❗️Hapus semua query yang ter-cache
    router.push('/login')
  } catch (err) {
    console.error('Logout gagal:', err)
  }
}

</script>

<style scoped>
.transform {
  transition: transform 0.3s ease-in-out;
}

/* Hamburger Menu Button */
.lg\:hidden {
  display: none;
}

@media (max-width: 1023px) {
  .lg\:hidden {
    display: block;
  }
}
</style>
