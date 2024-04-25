<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <main class="d-flex flex-grow-1">
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<style scoped></style>
