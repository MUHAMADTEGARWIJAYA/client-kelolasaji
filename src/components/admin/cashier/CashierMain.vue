<template>

  <div class="flex bg-tertiary ">
    <div>
      <CashierOrder />

    </div>

    <div class="fixed right-0">
      <CashierCart />
    </div>

  </div>
</template>

<script setup>
import CashierOrder from './CashierOrder.vue';
import CashierCart from './CashierCart.vue';
</script>
