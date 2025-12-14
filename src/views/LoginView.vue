<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-sm w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">歲入款項暨單據管理系統</h1>
        <p class="mt-2 text-sm text-gray-600">米樂睞資訊 MillerLight Info</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <BaseFormInput
              v-model="form.username"
              icon="heroicons:user"
              placeholder="請輸入帳號"
              :required="true"
            />

            <BaseFormInput
              v-model="form.password"
              type="password"
              icon="heroicons:lock-closed"
              placeholder="請輸入密碼"
              :required="true"
            />

            <div v-if="error" class="form-error">
              <Icon icon="heroicons:exclamation-circle" class="w-4 h-4" />
              <span>{{ error }}</span>
            </div>

            <!-- 增加更多間距 -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary flex items-center justify-center"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                <Icon v-if="loading" icon="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
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
                <Icon icon="heroicons:information-circle" class="w-5 h-5 text-gray-400" />
              </button>
              
              <!-- 測試帳號彈窗 -->
              <div 
                v-if="showTestAccounts"
                class="absolute top-0 left-full ml-2 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10"
              >
                <div class="text-xs sm:text-sm">
                  <div class="font-medium text-gray-700 mb-3 text-center">測試帳號資訊</div>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center group">
                      <div class="flex items-center flex-1 min-w-0">
                        <span class="font-medium truncate">operator</span>
                        <button
                          @click="copyToClipboard('operator')"
                          class="ml-1 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                          title="複製帳號"
                        >
                          <Icon icon="heroicons:clipboard-document" class="w-3 h-3 text-gray-500 hover:text-gray-700" />
                        </button>
                      </div>
                      <span class="text-gray-500 ml-2 flex-shrink-0 text-xs">承辦人權限</span>
                    </div>
                    <div class="flex justify-between items-center group">
                      <div class="flex items-center flex-1 min-w-0">
                        <span class="font-medium truncate">auditor</span>
                        <button
                          @click="copyToClipboard('auditor')"
                          class="ml-1 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                          title="複製帳號"
                        >
                          <Icon icon="heroicons:clipboard-document" class="w-3 h-3 text-gray-500 hover:text-gray-700" />
                        </button>
                      </div>
                      <span class="text-gray-500 ml-2 flex-shrink-0 text-xs">稽核人員權限</span>
                    </div>
                    <div class="flex justify-between items-center group">
                      <div class="flex items-center flex-1 min-w-0">
                        <span class="font-medium truncate">vendor</span>
                        <button
                          @click="copyToClipboard('vendor')"
                          class="ml-1 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                          title="複製帳號"
                        >
                          <Icon icon="heroicons:clipboard-document" class="w-3 h-3 text-gray-500 hover:text-gray-700" />
                        </button>
                      </div>
                      <span class="text-gray-500 ml-2 flex-shrink-0 text-xs">業者權限</span>
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
                  <Icon icon="heroicons:x-mark" class="w-3 h-3 text-gray-400" />
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
import { Icon } from '@iconify/vue'
import { useAppStore } from '../stores/useAppStore.js'
import BaseFormInput from '../components/common/BaseFormInput.vue'

const router = useRouter()
const store = useAppStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showTestAccounts = ref(false)

const handleLogin = async () => {
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
const goToForgotPassword = () => {
  router.push('/forgot-password')
}

// 複製到剪貼簿
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // 可以添加一個簡單的視覺反饋
    const button = event.target.closest('button')
    const icon = button.querySelector('svg')
    if (icon) {
      // 暫時改變圖標顏色表示複製成功
      icon.classList.add('text-green-500')
      icon.classList.remove('text-gray-500')
      setTimeout(() => {
        icon.classList.remove('text-green-500')
        icon.classList.add('text-gray-500')
      }, 1000)
    }
  }).catch(err => {
    console.error('複製失敗:', err)
  })
}

// 點擊外部關閉彈窗
const handleClickOutside = () => {
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