<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">歲入款項暨單據管理系統</h1>
        <p class="mt-2 text-sm text-gray-600">米樂睞資訊 MillerLight Info</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6 p-8">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="form-label">帳號</label>
              <input
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="請輸入帳號"
                required
              />
            </div>

            <div>
              <label class="form-label">密碼</label>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="請輸入密碼"
                required
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <!-- 增加更多間距 -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                {{ loading ? '登入中...' : '登入' }}
              </button>
            </div>
          </form>

          <!-- 忘記密碼連結與測試帳號圖示 -->
          <div class="flex justify-between items-center">
            <!-- 測試帳號資訊圖示 -->
            <div class="relative" @click.stop>
              <button 
                @click="showTestAccounts = !showTestAccounts"
                type="button"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="查看測試帳號"
              >
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              
              <!-- 測試帳號彈窗 -->
              <div 
                v-if="showTestAccounts"
                class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10"
              >
                <div class="text-xs">
                  <div class="font-medium text-gray-700 mb-3 text-center">測試帳號資訊</div>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="font-medium">operator</span>
                      <span class="text-gray-500">承辦人權限</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="font-medium">auditor</span>
                      <span class="text-gray-500">稽核人員權限</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="font-medium">vendor</span>
                      <span class="text-gray-500">業者權限</span>
                    </div>
                  </div>
                  <div class="mt-3 pt-2 border-t border-gray-100 text-center">
                    <span class="text-gray-400">統一密碼: </span>
                    <span class="font-medium text-gray-600">123</span>
                  </div>
                </div>
                <!-- 關閉按鈕 -->
                <button 
                  @click="showTestAccounts = false"
                  class="absolute top-1 right-1 p-1 rounded hover:bg-gray-100"
                >
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 忘記密碼按鈕 -->
            <button 
              @click="goToForgotPassword"
              type="button"
              class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              忘記密碼？
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'

const router = useRouter()
const store = useAppStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showTestAccounts = ref(false)

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    error.value = '請填寫帳號和密碼'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = store.login(form.value.username, form.value.password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      error.value = '帳號或密碼錯誤'
    }
  } catch (err) {
    error.value = '登入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 轉到忘記密碼頁面
function goToForgotPassword() {
  router.push('/forgot-password')
}

// 點擊外部關閉彈窗
function handleClickOutside() {
  if (showTestAccounts.value) {
    showTestAccounts.value = false
  }
}

// 監聽點擊事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>