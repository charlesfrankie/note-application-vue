<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useAuthStore } from '../../stores/authentication'

defineProps({
  openSidebar: Boolean,
})

const emit = defineEmits<{
  (event: 'toggleSidebar'): void
}>()

const toggleSidebar = () => {
  emit('toggleSidebar')
}
</script>

<template>
  <nav class="bg-white border-2 border-bottom-200 relative flex justify-between px-3 md:px-5 py-3">
    <RouterLink
      :to="{ name: 'backend.note' }"
      class="hidden md:flex items-center p-2 dark:text-green-500 rounded-lg group text-xl"
    >
      <span>Note Application</span>
    </RouterLink>
    <button
      type="button"
      @click="toggleSidebar"
      class="md:hidden relative inline-flex items-center p-2 text-sm text-gray-500 transition-color duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
    <div class="flex flex-wrap items-center justify-between">
      <div class="rounded-md bg-gray-600 text-white px-4 py-1">
        <p>Hi, {{ useAuthStore().auth_name }}</p>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
