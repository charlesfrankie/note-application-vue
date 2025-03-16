import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setApiClientHeaders = (newHeaders: any) => {
  apiClient.defaults.headers.common = {
    ...apiClient.defaults.headers.common,
    ...newHeaders,
  }
}

export default apiClient
