import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router/index.ts'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Toast, {
  timeout: 2500,
  pauseOnHover: false,
  draggable: false,
})

app.mount('#app')
