<template>
  <div>
    <Navbar />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/views/Layouts/NavbarView.vue'
</script>

<style scoped>
.main-content {
  padding: 20px;
}
</style>