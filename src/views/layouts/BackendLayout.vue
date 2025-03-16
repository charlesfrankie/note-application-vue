<script setup lang="ts">
import Sidebar from '../../components/backend/Sidebar.vue'
import Navbar from '../../components/backend/Navbar.vue'
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const openSidebar = ref(false)

const toggleSidebar = () => {
  openSidebar.value = !openSidebar.value
}
</script>

<template>
  <div class="h-screen">
    <Navbar title="Note Application" @toggleSidebar="toggleSidebar" :openSidebar="openSidebar" />
    <div class="flex w-full">
      <Sidebar @toggleSidebar="toggleSidebar" :openSidebar="openSidebar" />
      <RouterView />
    </div>
  </div>
</template>
