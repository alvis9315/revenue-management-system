import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vue Toastification
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

// Iconify Vue 組件
import { Icon } from '@iconify/vue'

const app = createApp(App)

// 註冊 Icon 組件為全局組件
app.component('Icon', Icon)

app.use(createPinia())
app.use(router)

// 配置 Toast
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  toastDefaults: {
    // 確保 Toast 在 AppLayout header (z-40) 之上
    style: {
      zIndex: "9999"
    }
  }
})

app.mount('#app')
