<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">重設密碼</h1>
        <p class="mt-2 text-sm text-gray-600">請輸入您的信箱以重設密碼</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6 p-8">
          <form @submit.prevent="handleForgotPassword" class="space-y-6">
            <BaseFormInput
              v-model="form.email"
              label="信箱"
              type="email"
              icon="heroicons:envelope"
              placeholder="請輸入您的信箱"
              help-text="我們會將重設密碼連結發送到此信箱"
              :required="true"
              :error="error"
              :success="!!successMessage"
              :success-message="successMessage"
            />

            <!-- 增加更多間距 -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary flex items-center justify-center"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                <Icon v-if="loading" icon="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
                <Icon v-else icon="heroicons:paper-airplane" class="w-5 h-5 mr-2" />
                {{ loading ? '處理中...' : '發送重設連結' }}
              </button>
            </div>
          </form>

          <!-- 返回登入連結 -->
          <div class="text-center">
            <button 
              @click="goToLogin"
              type="button"
              class="text-sm text-primary-600 hover:text-primary-800 transition-colors inline-flex items-center"
            >
              <Icon icon="heroicons:arrow-left" class="w-4 h-4 mr-1" />
              返回登入頁面
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'

const router = useRouter()

const form = ref({
  email: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleForgotPassword = async () => {
  if (!form.value.email) {
    error.value = '請輸入信箱'
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // 模擬發送重設密碼郵件的過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 檢查是否為有效信箱（模擬驗證）
    if (form.value.email.includes('@')) {
      successMessage.value = '重設密碼連結已發送到您的郵箱，請檢查您的郵件'
      
      // 3秒後自動跳轉到重設密碼頁面（模擬點擊郵件連結）
      setTimeout(() => {
        router.push(`/reset-password?token=${generateMockToken(form.value.email)}`)
      }, 3000)
    } else {
      error.value = '請輸入有效的信箱地址'
    }
  } catch (err) {
    error.value = '發送失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 生成模擬token
const generateMockToken = (email) => {
  return btoa(`${email}-${Date.now()}`)
}

// 返回登入頁面
const goToLogin = () => {
  router.push('/login')
}
</script>