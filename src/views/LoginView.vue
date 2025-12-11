<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary-950">歲入款項暨單據管理系統</h1>
        <p class="mt-2 text-sm text-gray-600">米樂睞資訊 MillerLight Info</p>
      </div>

      <div class="card">
        <div class="card-body space-y-6">
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

            <div>
              <label class="form-label">角色</label>
              <select v-model="form.role" class="form-input" required>
                <option value="">請選擇角色</option>
                <option value="承辦人">承辦人</option>
                <option value="稽核人員">稽核人員</option>
                <option value="業者">業者</option>
              </select>
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              {{ loading ? '登入中...' : '登入' }}
            </button>
          </form>

          <div class="text-sm text-gray-500 text-center">
            <p>測試帳號：demo / demo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'

const router = useRouter()
const store = useAppStore()

const form = ref({
  username: '',
  password: '',
  role: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!form.value.username || !form.value.password || !form.value.role) {
    error.value = '請填寫完整資訊'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = store.login(form.value.username, form.value.password, form.value.role)
    
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
</script>