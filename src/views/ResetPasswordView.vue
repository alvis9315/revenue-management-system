<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">重設密碼</h1>
        <p class="mt-2 text-sm text-gray-600">請輸入您的新密碼</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6 p-8">
          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <BaseFormInput
              v-model="form.newPassword"
              label="新密碼"
              type="password"
              icon="heroicons:lock-closed"
              placeholder="請輸入新密碼"
              help-text="至少 8 個字符，需包含大寫字母、小寫字母及數字"
              :required="true"
            />

            <BaseFormInput
              v-model="form.confirmPassword"
              label="確認新密碼"
              type="password"
              icon="heroicons:lock-closed"
              placeholder="請再次輸入新密碼"
              help-text="請確保兩次輸入的密碼一致"
              :required="true"
            />

            <div v-if="error" class="form-error">
              <Icon icon="heroicons:exclamation-circle" class="w-4 h-4" />
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="form-success">
              <Icon icon="heroicons:check-circle" class="w-4 h-4" />
              <span>{{ successMessage }}</span>
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
                <Icon v-else icon="heroicons:check" class="w-5 h-5 mr-2" />
                {{ loading ? '更新中...' : '更新密碼' }}
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'

const router = useRouter()
const route = useRoute()

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const username = ref('')

onMounted(() => {
  // 從URL參數獲取token並解析用戶名
  const token = route.query.token
  if (token) {
    try {
      const decoded = atob(token)
      const [user] = decoded.split('-')
      username.value = user
    } catch (err) {
      error.value = '無效的重設連結'
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } else {
    error.value = '缺少重設令牌'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})

const handleResetPassword = async () => {
  if (!form.value.newPassword || !form.value.confirmPassword) {
    error.value = '請填寫所有欄位'
    return
  }

  // 驗證密碼長度
  if (form.value.newPassword.length < 8) {
    error.value = '密碼長度至少需要 8 個字符'
    return
  }

  // 驗證密碼複雜度
  const password = form.value.newPassword
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasUpperCase) {
    error.value = '密碼必須包含至少一個大寫字母'
    return
  }
  
  if (!hasLowerCase) {
    error.value = '密碼必須包含至少一個小寫字母'
    return
  }
  
  if (!hasNumber) {
    error.value = '密碼必須包含至少一個數字'
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = '兩次輸入的密碼不一致'
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // 模擬更新密碼的過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    successMessage.value = '密碼重設成功！即將跳轉到登入頁面...'
    
    // 2秒後跳轉到登入頁面
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = '密碼重設失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 返回登入頁面
const goToLogin = () => {
  router.push('/login')
}
</script>