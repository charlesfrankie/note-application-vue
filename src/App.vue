<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { useRoute, RouterView } from 'vue-router'
const route = useRoute()
</script>

<template>
  <Navbar v-if="!route.path.startsWith('/admin')" title="Note Application" />
  <RouterView :class="route.path.startsWith('/admin') ? 'w-full' : 'max-w-7xl mx-auto'" />
</template>
