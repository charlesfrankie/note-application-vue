<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authentication'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()
const title = ref('Note Application')
const mobileView = ref(false)

defineProps({
  add_btn: String,
})

const handleDropDown = () => {
  const dropdown = document.getElementById('dropdownNavbar')
  if (dropdown) {
    dropdown.classList.toggle('hidden')
  }
}

const handleBurgerBtn = () => {
  mobileView.value = true
  const mobileMenu = document.getElementById('navbar-default')
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden')
  }
}
const handleLogout = async () => {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim()

  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    confirmButtonColor: primaryColor,
    cancelButtonText: 'Cancel',
    cancelButtonColor: 'red',
  })

  if (result.isConfirmed) {
    authStore.logout()
    toast.success('You have been logged out.')
  }
}
</script>

<template>
  <nav class="bg-white border-2 border-bottom-200 relative">
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <div class="w-full md:w-auto flex gap-6 items-center">
        <p class="text-black text-lg">Note List</p>
        <RouterLink
          v-if="route.path.startsWith('/admin/notes')"
          :to="{ name: 'backend.add_note' }"
          class="bg-green-500 rounded p-2 border-green-500 text-white text-sm transition-color duration-200 hover:bg-green-700"
        >
          Add Note
        </RouterLink>
      </div>
      <div class="mr-12 rounded-md bg-gray-600 text-white px-4 py-1">
        <p>Hi, {{ useAuthStore().auth_name }}</p>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
