<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">重設密碼</h1>
        <p class="mt-2 text-sm text-gray-600">請輸入您的信箱以重設密碼</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6">
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label class="form-label">信箱</label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="請輸入您的信箱"
                required
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div v-if="successMessage" class="text-green-600 text-sm">
              {{ successMessage }}
            </div>

            <!-- 增加更多間距 -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                {{ loading ? '處理中...' : '發送重設連結' }}
              </button>
            </div>
          </form>

          <!-- 返回登入連結 -->
          <div class="text-center">
            <button 
              @click="goToLogin"
              type="button"
              class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
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

const router = useRouter()

const form = ref({
  email: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

async function handleForgotPassword() {
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
function generateMockToken(email) {
  return btoa(`${email}-${Date.now()}`)
}

// 返回登入頁面
function goToLogin() {
  router.push('/login')
}
</script>