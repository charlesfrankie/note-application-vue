<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/authentication'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const title = ref('Note Application')
const mobileView = ref(false)

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
    useAuthStore().logout()
    toast.success('You have been logged out.')
  }
}
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 relative">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a
        href="/"
        class="text-green-500 text-2xl rounded-sm font-bold dark:hover:text-green-700 transition-colors duration-200"
      >
        <h1>{{ title }}</h1>
      </a>
      <button
        id="hamburger-btn"
        @click="handleBurgerBtn"
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-3 py-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-6 rtl:space-x-reverse md:my-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li v-if="!useAuthStore().isAuthenticated()">
            <RouterLink
              :to="{ name: 'login' }"
              class="block px-1 py-3 text-gray-900 rounded-sm dark:text-white dark:hover:text-green-500 transition-colors duration-100"
            >
              Login
            </RouterLink>
          </li>
          <li v-if="!useAuthStore().isAuthenticated()">
            <RouterLink
              :to="{ name: 'register' }"
              class="block px-1 py-3 text-gray-900 rounded-sm dark:text-white dark:hover:text-green-500 transition-colors duration-200"
            >
              Register
            </RouterLink>
          </li>
          <li
            v-if="useAuthStore().isAuthenticated()"
            class="relative hidden md:block"
            id="dropdownProfile"
          >
            <button
              id="dropdownNavbarLink"
              @click="handleDropDown"
              data-dropdown-toggle="dropdownNavbar"
              class="flex items-center justify-between w-full dark:bg-gray-700 dark:border dark:border-gray-500 px-2 py-1 text-sm text-gray-900 rounded hover:bg-gray-100 transition-color duration-200 md:hover:bg-transparent md:hover:text-gray-400 md:w-auto dark:text-white dark:focus:text-white dark:hover:bg-gray-700"
            >
              Hi {{ useAuthStore().auth_name }}
              <svg
                class="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <!-- Dropdown menu -->
            <div
              id="dropdownNavbar"
              class="hidden z-10 absolute right-0 mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                class="py-0 text-sm text-gray-700 dark:text-gray-400"
                aria-labelledby="dropdownLargeButton"
              >
                <li>
                  <a
                    href="/admin/notes"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-lg"
                    >Admin panel</a
                  >
                </li>
              </ul>
              <div class="py-0">
                <a
                  @click="handleLogout"
                  class="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-lg"
                  >Log out</a
                >
              </div>
            </div>
          </li>
          <li v-if="useAuthStore().isAuthenticated()" class="md:hidden">
            <RouterLink
              :to="{ name: 'login' }"
              class="block px-1 py-3 text-gray-900 rounded-sm dark:text-white dark:hover:text-green-500 transition-colors duration-100"
            >
              Admin Panel
            </RouterLink>
          </li>
          <li v-if="useAuthStore().isAuthenticated()" class="md:hidden">
            <RouterLink
              :to="{ name: 'register' }"
              class="block px-1 py-3 text-gray-900 rounded-sm dark:text-white dark:hover:text-green-500 transition-colors duration-200"
            >
              Log out
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
