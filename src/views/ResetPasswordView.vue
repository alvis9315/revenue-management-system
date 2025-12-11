<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">重設密碼</h1>
        <p class="mt-2 text-sm text-gray-600">請輸入您的新密碼</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6">
          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div>
              <label class="form-label">新密碼</label>
              <input
                v-model="form.newPassword"
                type="password"
                class="form-input"
                placeholder="請輸入新密碼"
                required
                minlength="3"
              />
            </div>

            <div>
              <label class="form-label">確認新密碼</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="form-input"
                placeholder="請再次輸入新密碼"
                required
                minlength="3"
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
                {{ loading ? '更新中...' : '更新密碼' }}
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

async function handleResetPassword() {
  if (!form.value.newPassword || !form.value.confirmPassword) {
    error.value = '請填寫所有欄位'
    return
  }

  if (form.value.newPassword.length < 3) {
    error.value = '密碼長度至少需要3個字符'
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
function goToLogin() {
  router.push('/login')
}
</script>