<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">使用者管理</h2>
        <p class="text-gray-600 mt-1">管理系統使用者帳號與角色權限</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 新增使用者 -->
        <BaseCard title="新增使用者">
          <form @submit.prevent="addUser" class="space-y-4">
            <div>
              <label class="form-label">帳號 *</label>
              <input
                v-model="userForm.username"
                type="text"
                class="form-input"
                placeholder="請輸入帳號"
                required
              />
            </div>
            
            <div>
              <label class="form-label">姓名 *</label>
              <input
                v-model="userForm.name"
                type="text"
                class="form-input"
                placeholder="請輸入姓名"
                required
              />
            </div>
            
            <div>
              <label class="form-label">角色 *</label>
              <select v-model="userForm.role" class="form-input" required>
                <option value="">請選擇角色</option>
                <option value="承辦人">承辦人</option>
                <option value="稽核人員">稽核人員</option>
                <option value="業者">業者</option>
              </select>
            </div>
            
            <button type="submit" class="btn-primary w-full">
              新增使用者
            </button>
          </form>
        </BaseCard>

        <!-- 使用者列表 -->
        <div class="lg:col-span-2">
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
                <div class="space-x-2">
                  <button
                    @click="toggleUserStatus(row)"
                    :class="row.status === '啟用' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                    class="text-sm"
                  >
                    {{ row.status === '啟用' ? '停用' : '啟用' }}
                  </button>
                  <button
                    @click="changeUserRole(row)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    變更角色
                  </button>
                </div>
              </template>
            </BaseTable>
          </BaseCard>
        </div>
      </div>
    </div>

    <!-- 變更角色 Modal -->
    <div v-if="editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 class="text-lg font-semibold mb-4">變更角色</h3>
        <form @submit.prevent="updateUserRole">
          <div class="mb-4">
            <label class="form-label">使用者: {{ editingUser.name }}</label>
            <select v-model="newRole" class="form-input" required>
              <option value="承辦人">承辦人</option>
              <option value="稽核人員">稽核人員</option>
              <option value="業者">業者</option>
            </select>
          </div>
          <div class="flex space-x-3">
            <button type="button" @click="editingUser = null" class="btn-secondary flex-1">取消</button>
            <button type="submit" class="btn-primary flex-1">確定</button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { mockUsers } from '../mock/mockData.js'

const store = useAppStore()

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

function addUser() {
  const newUser = {
    username: userForm.value.username,
    name: userForm.value.name,
    role: userForm.value.role
  }
  
  store.addUser(newUser)
  
  // 重設表單
  userForm.value = {
    username: '',
    name: '',
    role: ''
  }
}

function toggleUserStatus(user) {
  user.status = user.status === '啟用' ? '停用' : '啟用'
}

function changeUserRole(user) {
  editingUser.value = user
  newRole.value = user.role
}

function updateUserRole() {
  editingUser.value.role = newRole.value
  editingUser.value = null
}

function getRoleType(role) {
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