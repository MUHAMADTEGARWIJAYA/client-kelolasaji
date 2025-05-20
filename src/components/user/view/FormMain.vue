<template>
  <div class="bg-gradient-to-r from-orange-50 to-orange-300 flex h-screen justify-center items-center">
    <slot></slot>

    <div class="hidden md:block  w-full">
      <WelcomeHome />
    </div>
  </div>
</template>

<script setup>
import WelcomeHome from './WelcomeHome.vue';
</script>
