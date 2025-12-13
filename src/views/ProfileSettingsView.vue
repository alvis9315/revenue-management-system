<template>
  <AppLayout>
    <div class="space-y-6 max-w-4xl">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">個人設定</h2>
        <p class="text-gray-600 mt-1">管理您的個人資料與帳號設定</p>
      </div>

      <!-- 基本資料 -->
      <BaseCard>
        <template #title>
          <div class="flex items-center space-x-2">
            <Icon icon="heroicons:user-circle" class="w-5 h-5 text-blue-500" />
            <span>基本資料</span>
          </div>
        </template>
        
        <form @submit.prevent="showProfileConfirmDialog" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 帳號 (不可編輯) -->
            <BaseFormInput
              v-model="profileForm.username"
              label="帳號"
              icon="heroicons:user"
              :disabled="true"
              help-text="帳號無法修改"
            />

            <!-- 角色 (不可編輯) -->
            <BaseFormInput
              v-model="profileForm.role"
              label="角色"
              icon="heroicons:shield-check"
              :disabled="true"
              help-text="角色由管理員控制"
            />

            <!-- 姓名 -->
            <BaseFormInput
              v-model="profileForm.name"
              label="姓名"
              icon="heroicons:identification"
              placeholder="請輸入您的姓名"
              :required="true"
            />

            <!-- 所屬單位 -->
            <BaseFormInput
              v-model="profileForm.department"
              label="所屬單位"
              type="select"
              :required="true"
            >
              <template #options>
                <option value="財務處">財務處</option>
                <option value="人事處">人事處</option>
                <option value="研發部">研發部</option>
                <option value="行政處">行政處</option>
                <option value="業務部">業務部</option>
              </template>
            </BaseFormInput>

            <!-- 電子信箱 -->
            <BaseFormInput
              v-model="profileForm.email"
              label="電子信箱"
              type="email"
              icon="heroicons:envelope"
              placeholder="example@example.com"
              help-text="用於接收系統通知"
            />

            <!-- 聯絡電話 -->
            <BaseFormInput
              v-model="profileForm.phone"
              label="聯絡電話"
              icon="heroicons:phone"
              placeholder="請輸入聯絡電話"
            />
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn-primary flex items-center">
              儲存
            </button>
          </div>
        </form>
      </BaseCard>

      <!-- 修改密碼 & 帳號資訊 並排區塊 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 修改密碼 -->
        <BaseCard>
          <template #title>
            <div class="flex items-center space-x-2">
              <Icon icon="heroicons:lock-closed" class="w-5 h-5 text-green-500" />
              <span>修改密碼</span>
            </div>
          </template>
          
          <form @submit.prevent="showPasswordConfirmDialog" class="space-y-4">
            <div class="space-y-4">
              <!-- 目前密碼 -->
              <BaseFormInput
                v-model="passwordForm.currentPassword"
                label="目前密碼"
                type="password"
                icon="heroicons:lock-closed"
                placeholder="請輸入目前密碼"
                :required="true"
              />

              <!-- 新密碼 -->
              <BaseFormInput
                v-model="passwordForm.newPassword"
                label="新密碼"
                type="password"
                icon="heroicons:key"
                placeholder="請輸入新密碼"
                :required="true"
                help-text="至少 8 個字符，需包含大寫字母、小寫字母及數字"
              />

              <!-- 確認新密碼 -->
              <BaseFormInput
                v-model="passwordForm.confirmPassword"
                label="確認新密碼"
                type="password"
                icon="heroicons:key"
                placeholder="請再次輸入新密碼"
                :required="true"
                :error="passwordError"
              />
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn-primary flex items-center">
                更新
              </button>
            </div>
          </form>
        </BaseCard>

        <!-- 帳號資訊 -->
        <BaseCard>
          <template #title>
            <div class="flex items-center space-x-2">
              <Icon icon="heroicons:information-circle" class="w-5 h-5 text-purple-500" />
              <span>帳號資訊</span>
            </div>
          </template>
          
          <div class="flex flex-col h-full gap-4">
            <div class="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">帳號建立日期</div>
              <div class="text-lg font-semibold text-gray-900">{{ accountInfo.createdAt }}</div>
            </div>
            
            <div class="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">最後登入時間</div>
              <div class="text-lg font-semibold text-gray-900">{{ accountInfo.lastLogin }}</div>
            </div>
            
            <div class="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500 mb-1">帳號狀態</div>
              <div>
                <BaseTag :text="accountInfo.status" :type="accountInfo.status === '啟用' ? 'success' : 'danger'" />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- 儲存基本資料確認對話框 -->
    <BaseConfirmDialog
      :show="confirmDialog.profile.show"
      title="確認儲存變更"
      :message="`確定要儲存個人資料的變更嗎？\n\n姓名：${profileForm.name}\n單位：${profileForm.department}`"
      confirmText="確定儲存"
      cancelText="取消"
      type="info"
      @confirm="handleProfileConfirm"
      @cancel="handleProfileCancel"
      @close="handleProfileCancel"
    />

    <!-- 更新密碼確認對話框 -->
    <BaseConfirmDialog
      :show="confirmDialog.password.show"
      title="確認更新密碼"
      message="確定要更新密碼嗎？\n\n更新後需要使用新密碼登入。"
      confirmText="確定更新"
      cancelText="取消"
      type="warning"
      @confirm="handlePasswordConfirm"
      @cancel="handlePasswordCancel"
      @close="handlePasswordCancel"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const toast = useToast()

// 基本資料表單
const profileForm = ref({
  username: '',
  role: '',
  name: '',
  department: '',
  email: '',
  phone: ''
})

// 密碼表單
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 帳號資訊
const accountInfo = ref({
  createdAt: '2024-01-01',
  lastLogin: '2024-12-13 15:30',
  status: '啟用'
})

// 確認對話框狀態
const confirmDialog = ref({
  profile: {
    show: false
  },
  password: {
    show: false
  }
})

// 密碼驗證錯誤
const passwordError = computed(() => {
  if (passwordForm.value.confirmPassword && 
      passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return '兩次輸入的密碼不一致'
  }
  return ''
})

// 初始化表單資料
const initializeForm = () => {
  const user = store.currentUser
  if (user) {
    profileForm.value = {
      username: user.username || '',
      role: user.role || '',
      name: user.name || user.username || '',
      department: user.department || '財務處',
      email: user.email || '',
      phone: user.phone || ''
    }
  }
}

// 顯示儲存基本資料確認對話框
const showProfileConfirmDialog = () => {
  // 驗證必填欄位
  if (!profileForm.value.name) {
    toast.error('請輸入姓名')
    return
  }
  
  if (!profileForm.value.department) {
    toast.error('請選擇所屬單位')
    return
  }

  confirmDialog.value.profile.show = true
}

// 確認儲存基本資料
const handleProfileConfirm = () => {
  // 更新 store 中的使用者資料
  store.updateUserProfile({
    name: profileForm.value.name,
    department: profileForm.value.department,
    email: profileForm.value.email,
    phone: profileForm.value.phone
  })

  toast.success('個人資料已更新！')
  confirmDialog.value.profile.show = false
}

// 取消儲存基本資料
const handleProfileCancel = () => {
  confirmDialog.value.profile.show = false
}

// 顯示更新密碼確認對話框
const showPasswordConfirmDialog = () => {
  // 驗證目前密碼
  if (passwordForm.value.currentPassword !== '123') {
    toast.error('目前密碼錯誤')
    return
  }

  // 驗證新密碼長度
  if (passwordForm.value.newPassword.length < 8) {
    toast.error('密碼長度至少需要 8 個字符')
    return
  }

  // 驗證密碼複雜度
  const password = passwordForm.value.newPassword
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasUpperCase) {
    toast.error('密碼必須包含至少一個大寫字母')
    return
  }
  
  if (!hasLowerCase) {
    toast.error('密碼必須包含至少一個小寫字母')
    return
  }
  
  if (!hasNumber) {
    toast.error('密碼必須包含至少一個數字')
    return
  }

  // 驗證密碼確認
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('兩次輸入的密碼不一致')
    return
  }

  confirmDialog.value.password.show = true
}

// 確認更新密碼
const handlePasswordConfirm = () => {
  // 更新密碼 (這裡是模擬，實際應該呼叫 API)
  store.updateUserPassword(passwordForm.value.newPassword)

  toast.success('密碼已更新！')
  
  // 清空密碼表單
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  
  confirmDialog.value.password.show = false
}

// 取消更新密碼
const handlePasswordCancel = () => {
  confirmDialog.value.password.show = false
}

onMounted(() => {
  initializeForm()
})
</script>

