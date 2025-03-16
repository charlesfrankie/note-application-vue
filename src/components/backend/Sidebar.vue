<script setup lang="ts">
import Swal from 'sweetalert2'
import { useAuthStore } from '../../stores/authentication'
import { useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

defineProps({
  openSidebar: Boolean,
})

const emit = defineEmits<{
  (event: 'toggleSidebar'): void
}>()

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
    useAuthStore().logout()
    router.push({ name: 'home' })
    toast.success('You have been logged out.')
  }
}

const toggleSidebar = () => {
  emit('toggleSidebar')
}
</script>

<template>
  <aside
    id="default-sidebar"
    class="fixed md:relative top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 dark:bg-gray-900"
    :class="{
      'translate-x-0': openSidebar,
      '-translate-x-full': !openSidebar,
      'md:translate-x-0': true,
    }"
    aria-label="Sidebar"
  >
    <div class="h-full px-0 overflow-y-auto dark:bg-gray-900 flex justify-between">
      <ul class="space-y-2 font-medium w-full px-3 py-6">
        <li>
          <RouterLink
            :to="{ name: 'backend.note' }"
            class="md:hidden flex items-center px-2 dark:text-green-500 rounded-lg group text-xl"
          >
            <span>Note Application</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'backend.note' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path
                d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Notes</span>
          </RouterLink>
        </li>
        <li>
          <a
            @click="handleLogout"
            class="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
            <span class="flex-1 ms-3 whitespace-nowrap">Logout</span>
          </a>
        </li>
      </ul>
      <button
        type="button"
        @click="toggleSidebar"
        class="md:hidden relative inline-flex dark:bg-gray-900 items-center p-2 text-sm text-gray-500 transition-color duration-200 hover:bg-gray-600 focus:outline-none"
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
    </div>
  </aside>
</template>
