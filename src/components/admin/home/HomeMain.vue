<template>
  <div class="bg-tertiary flex flex-col min-h-screen items-center w-full">
    <!-- Tabs -->
    <div class="flex space-x-4 mt-6 mb-4">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
        'px-4 py-2 rounded-lg text-sm font-semibold',
        activeTab === tab.id
          ? tab.id === 1
            ? 'bg-quinary text-white'
            : 'bg-primary text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]">
        <i :class="tab.icon" class="mr-2"></i>{{ tab.name }}
      </button>
    </div>

    <!-- Content -->
    <div class="w-full p-6 max-w-7xl">
      <PenjualanTake v-if="activeTab === 1" />
      <PenjualanDine v-else-if="activeTab === 2" />
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import PenjualanTake from './penjualan/PenjualanTake.vue'
import PenjualanDine from './penjualan/PenjualanDine.vue'

const activeTab = ref(1)

const tabs = [
  { id: 1, name: 'Penjualan Take Away', icon: 'gi-bowl-of-rice' },
  { id: 2, name: 'Penjualan Dine In', icon: 'gi-coffee-cup' },
]
</script>
