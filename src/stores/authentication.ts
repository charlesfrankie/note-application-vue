import { defineStore } from 'pinia'
import apiClient from '../axiosIntance'
import { setApiClientHeaders } from '../axiosIntance'
import type { User } from '../types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    auth_id: sessionStorage.getItem('auth_id') || null,
    auth_name: sessionStorage.getItem('auth_name') || null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        })
        const user = response.data.user
        this.token = user.token
        this.auth_id = user.data.id
        this.auth_name = user.data.name

        if (this.token) {
          sessionStorage.setItem('token', this.token)
          setApiClientHeaders({ Authorization: `Bearer ${this.token}` })
        }
        if (this.auth_id) {
          sessionStorage.setItem('auth_id', this.auth_id)
        }
        if (this.auth_name) {
          sessionStorage.setItem('auth_name', this.auth_name)
        }
        return { success: true, message: 'Login success! Redirecting...' }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return { success: false, message: 'Invalid email address or password!' }
        }
        return {
          success: false,
          message: error.message || 'An error occurred. Please try again later.',
        }
      }
    },
    async register(name: string, email: string, password: string) {
      try {
        const response = await apiClient.post('/auth/register', {
          name,
          email,
          password,
        })
        console.log(response.data)
        return { success: true, message: 'Register success' }
      } catch (error: any) {
        return { success: false, message: 'An error occurred. Please try again later.' }
      }
    },
    logout() {
      this.token = null
      this.auth_name = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('auth_id')
      sessionStorage.removeItem('auth_name')
    },
    isAuthenticated() {
      return !!this.token
    },
  },
})
