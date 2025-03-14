<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '../stores/authentication'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (email.value.trim() === '' || password.value.trim() === '') {
    toast.error('Email address and password cannot be empty')
    return
  } else {
    isLoading.value = true
    const response = await authStore.login(email.value, password.value)

    if (response.success) {
      toast.success(response.message)
      isLoading.value = false
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 2800)
    } else {
      isLoading.value = false
      toast.error(response.message)
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-3 sm:px-6 sm:py-8 mx-auto relative">
    <div class="w-full bg-gray-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Login to your account
        </h1>

        <form @submit.prevent="handleLogin" class="space-y-2 md:space-y-4" action="#">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900"
              >Email Address</label
            >
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900"
              >Password</label
            >
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full text-white transition-color duration-200 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            :class="{ 'cursor-not-allowed': isLoading }"
          >
            Log in
          </button>
          <p class="text-sm font-light text-gray-500">
            Don’t have an account yet?
            <RouterLink
              :to="{ name: 'register' }"
              class="font-medium text-primary-600 hover:underline"
              >Register</RouterLink
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
