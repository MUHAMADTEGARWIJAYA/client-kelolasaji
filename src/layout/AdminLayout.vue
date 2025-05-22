<template>
  <div class="flex h-screen bg-tertiary overflow-hidden">
    <!-- Sidebar: tetap di tempat -->
    <div class=" bg-tertiary h-full fixed top-0 left-0 z-10">
      <SidebarMain />
    </div>

    <!-- Konten utama dengan margin kiri agar tidak tertutup sidebar -->
    <div class="md:ml-20 flex-1  overflow-y-auto h-screen mt-14 md:mt-0">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SidebarMain from '../components/admin/sidebar/SidebarMain.vue'
</script>
