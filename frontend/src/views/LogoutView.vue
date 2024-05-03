<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();

function logout() {
  localStorage.removeItem("token");
  router.push('/')
}

logout();

</script>
<template></template>
