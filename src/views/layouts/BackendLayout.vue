<script setup lang="ts">
import Sidebar from '../../components/backend/Sidebar.vue'
import Navbar from '../../components/backend/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="w-full">
      <Navbar title="Note Application" />
      <RouterView />
    </div>
  </div>
</template>
