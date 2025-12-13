<template>
  <AppLayout>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">使用者管理</h2>
          <p class="text-gray-600 mt-1">管理系統使用者帳號與角色權限</p>
        </div>
        <button 
          @click="showAddUserModal = true"
          class="btn-primary flex items-center space-x-2"
        >
          <Icon icon="heroicons:plus" class="w-5 h-5" />
          <span>新增使用者</span>
        </button>
      </div>

      <!-- 使用者列表 -->
      <BaseCard title="使用者列表">
        <BaseTable
          :columns="userColumns"
          :data="store.users"
          :show-actions="true"
        >
          <template #status="{ value }">
            <BaseTag
              :text="value"
              :type="value === '啟用' ? 'success' : 'default'"
            />
          </template>
          
          <template #role="{ value }">
            <BaseTag
              :text="value"
              :type="getRoleType(value)"
            />
          </template>

          <template #actions="{ row, index }">
            <div class="flex space-x-2">
              <button
                @click="toggleUserStatus(row)"
                :class="row.status === '啟用' ? 'px-3 py-1.5 text-m rounded-lg bg-red-100 text-red-700 hover:bg-red-200' : 'px-3 py-1.5 text-m rounded-lg bg-green-100 text-green-700 hover:bg-green-200'"
                class="transition-colors"
              >
                {{ row.status === '啟用' ? '停用' : '啟用' }}
              </button>
              <button
                @click="changeUserRole(row)"
                class="px-3 py-1.5 text-m rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                變更
              </button>
            </div>
          </template>
        </BaseTable>
      </BaseCard>
    </div>

    <!-- 新增使用者 Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md mx-4">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">新增使用者</h3>
          <button 
            @click="closeAddUserModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6">
          <form @submit.prevent="addUser" class="space-y-6">
            <BaseFormInput
              v-model="userForm.username"
              label="帳號"
              icon="heroicons:user"
              placeholder="請輸入帳號"
              help-text="帳號僅供登入使用，建議使用英文或數字"
              :required="true"
            />
            
            <BaseFormInput
              v-model="userForm.name"
              label="姓名"
              icon="heroicons:identification"
              placeholder="請輸入姓名"
              help-text="請輸入使用者的真實姓名"
              :required="true"
            />
            
            <BaseFormInput
              v-model="userForm.role"
              label="角色"
              type="select"
              placeholder="請選擇角色"
              help-text="角色決定了使用者的權限範圍"
              :required="true"
            >
              <template #options>
                <option value="承辦人">承辦人</option>
                <option value="稽核人員">稽核人員</option>
                <option value="業者">業者</option>
              </template>
            </BaseFormInput>
            
            <div class="flex space-x-3 pt-2">
              <button 
                type="button" 
                @click="closeAddUserModal"
                class="btn-secondary flex-1 inline-flex items-center justify-center"
              >
                <Icon icon="heroicons:x-mark" class="w-5 h-5 mr-1" />
                取消
              </button>
              <button type="submit" class="btn-primary flex-1 inline-flex items-center justify-center">
                <Icon icon="heroicons:check" class="w-5 h-5 mr-1" />
                新增
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 變更角色 Modal -->
    <div v-if="editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold mb-6">變更角色</h3>
        <form @submit.prevent="updateUserRole" class="space-y-6">
          <BaseFormInput
            v-model="newRole"
            :label="`使用者: ${editingUser.name}`"
            type="select"
            :required="true"
          >
            <template #options>
              <option value="承辦人">承辦人</option>
              <option value="稽核人員">稽核人員</option>
              <option value="業者">業者</option>
            </template>
          </BaseFormInput>
          
          <div class="flex space-x-3">
            <button 
              type="button" 
              @click="editingUser = null" 
              class="btn-secondary flex-1 inline-flex items-center justify-center"
            >
              <Icon icon="heroicons:x-mark" class="w-5 h-5 mr-1" />
              取消
            </button>
            <button type="submit" class="btn-primary flex-1 inline-flex items-center justify-center">
              <Icon icon="heroicons:check" class="w-5 h-5 mr-1" />
              確定
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { mockUsers } from '../mock/mockData.js'

const store = useAppStore()

const showAddUserModal = ref(false)
const userForm = ref({
  username: '',
  name: '',
  role: ''
})

const editingUser = ref(null)
const newRole = ref('')

const userColumns = [
  { key: 'username', title: '帳號' },
  { key: 'name', title: '姓名' },
  { key: 'role', title: '角色' },
  { key: 'status', title: '狀態' },
  { key: 'createdAt', title: '建立日期' }
]

const addUser = () => {
  const newUser = {
    username: userForm.value.username,
    name: userForm.value.name,
    role: userForm.value.role
  }
  
  store.addUser(newUser)
  
  // 關閉彈窗並重設表單
  closeAddUserModal()
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
  // 重設表單
  userForm.value = {
    username: '',
    name: '',
    role: ''
  }
}

const toggleUserStatus = (user) => {
  user.status = user.status === '啟用' ? '停用' : '啟用'
}

const changeUserRole = (user) => {
  editingUser.value = user
  newRole.value = user.role
}

const updateUserRole = () => {
  editingUser.value.role = newRole.value
  editingUser.value = null
}

const getRoleType = (role) => {
  const roleTypes = {
    '承辦人': 'info',
    '稽核人員': 'warning',
    '業者': 'default'
  }
  return roleTypes[role] || 'default'
}

onMounted(() => {
  // 初始化假資料
  if (store.users.length === 0) {
    mockUsers.forEach(user => {
      store.users.push(user)
    })
  }
})
</script>