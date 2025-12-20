<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between sm:flex-col sm:space-y-4 md:flex-row md:space-y-0">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">使用者管理</h2>
          <p class="text-gray-600 mt-1">管理系統使用者帳號與角色權限</p>
        </div>
        <button 
          @click="showAddUserModal = true"
          class="btn-primary flex items-center space-x-2 sm:w-full md:w-auto"
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
          class="sm:overflow-x-auto sm:whitespace-nowrap md:table-fixed"
        >
          <template #status="{ value }">
            <BaseTag
              :text="value"
              :type="value === '啟用' ? 'success' : 'danger'"
            />
          </template>
          
          <template #role="{ value }">
            <BaseTag
              :text="value"
              :type="getRoleType(value)"
            />
          </template>

          <template #actions="{ row, index }">
            <div
              class="flex gap-2 sm:flex-col sm:gap-0 sm:space-y-2 md:flex-row md:space-y-0"
              v-if="row.role !== '超級管理員'"
            >
              <!-- 管理員和超級管理員都可以啟用/停用 -->
              <button
                @click="toggleUserStatus(row)"
                :class="{
                  'px-3 py-1.5 text-m rounded-lg bg-red-100 text-red-700 hover:bg-red-200': row.status === '啟用',
                  'px-3 py-1.5 text-m rounded-lg bg-green-100 text-green-700 hover:bg-green-200': row.status !== '啟用'
                }"
                class="transition-colors"
              >
                {{ row.status === '啟用' ? '停用' : '啟用' }}
              </button>
              <!-- 只有超級管理員才能看到變更按鈕 -->
              <button
                v-if="isSuperAdmin"
                @click="changeUserRole(row)"
                class="ml-2 px-3 py-1.5 text-m rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                變更
              </button>
              <!-- 只有超級管理員才能看到刪除按鈕 -->
              <button
                v-if="isSuperAdmin"
                @click="showDeleteDialog(row)"
                class="ml-2 px-3 py-1.5 text-m rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                刪除
              </button>
            </div>
          </template>
        </BaseTable>
      </BaseCard>
    </div>

    <!-- 新增使用者 Modal -->
    <BaseModal
      v-if="showAddUserModal"
      :show="showAddUserModal"
      title="新增使用者"
      @close="closeAddUserModal"
    >
      <template #default>
        <form @submit.prevent="addUser" class="space-y-6">
          <BaseFormInput
            v-model="userForm.username"
            label="帳號"
            icon="heroicons:user"
            placeholder="請輸入帳號"
            help-text="帳號僅供登入使用，建議使用英文或數字"
            :required="true"
            :error="userFormErrors.username"
          />
          
          <BaseFormInput
            v-model="userForm.name"
            label="姓名"
            icon="heroicons:identification"
            placeholder="請輸入姓名"
            help-text="請輸入中文、英文或數字，無法使用特殊符號，字數限20字內"
            :required="true"
            :max-length="20"
            :error="userFormErrors.name"
          />
          
          <BaseFormInput
            v-model="userForm.role"
            label="角色"
            type="select"
            placeholder="請選擇角色"
            :required="true"
            :error="userFormErrors.role"
          >
            <template #options>
              <option value="管理員">管理員</option>
              <option value="承辦人">承辦人</option>
              <option value="稽核人員">稽核人員</option>
              <option value="業者">業者</option>
            </template>
          </BaseFormInput>
        </form>
      </template>
      <template #footer>
        <div class="flex space-x-4">
          <button 
            type="button" 
            @click="closeAddUserModal"
            class="btn-secondary flex-1 inline-flex items-center justify-center"
          >
            <Icon icon="heroicons:x-mark" class="w-5 h-5 mr-1" />
            取消
          </button>
          <button type="button" @click="addUser" class="btn-primary flex-1 inline-flex items-center justify-center">
            <Icon icon="heroicons:check" class="w-5 h-5 mr-1" />
            新增
          </button>
        </div>
      </template>
    </BaseModal>

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

    <!-- 刪除確認對話框 -->
    <BaseConfirmDialog
      :show="deleteDialog.show"
      title="確認刪除使用者"
      :message="`確定要刪除使用者「${deleteDialog.user?.name}」嗎？此操作無法撤銷。`"
      confirm-text="確認刪除"
      cancel-text="取消"
      type="danger"
      confirm-button-variant="danger"
      @confirm="confirmDeleteUser"
      @cancel="cancelDeleteUser"
      @close="cancelDeleteUser"
    />

    <BaseToast ref="toastRef" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'
import BaseModal from '../components/common/BaseModal.vue';
import BaseToast from '../components/common/BaseToast.vue';
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue';
import { useAppStore } from '../stores/useAppStore.js'
import { mockUsers } from '../mock/mockData.js'

const store = useAppStore()

const showAddUserModal = ref(false)
const userForm = ref({
  username: '',
  name: '',
  role: ''
})

const userFormErrors = ref({
  username: '',
  name: '',
  role: ''
})

const editingUser = ref(null)
const newRole = ref('')

const toastRef = ref(null);

// 刪除確認對話框
const deleteDialog = ref({
  show: false,
  user: null
})

// 判斷當前使用者是否為超級管理員
const isSuperAdmin = computed(() => {
  return store.currentUser?.role === '超級管理員'
})

const userColumns = [
  { key: 'username', title: '帳號' },
  { key: 'name', title: '姓名' },
  { key: 'role', title: '角色' },
  { key: 'status', title: '狀態' },
  { key: 'createdAt', title: '建立日期' }
]

const addUser = () => {
  console.log('addUser triggered'); // 確認方法是否被觸發

  // 檢查必填欄位是否有空缺，並在輸入框下方顯示錯誤訊息
  let hasError = false;

  if (!userForm.value.username) {
    userFormErrors.value.username = '帳號為必填項目';
    hasError = true;
  } else {
    userFormErrors.value.username = '';
  }

  if (!userForm.value.name) {
    userFormErrors.value.name = '姓名為必填項目';
    hasError = true;
  } else {
    userFormErrors.value.name = '';
  }

  if (!userForm.value.role) {
    userFormErrors.value.role = '角色為必填項目';
    hasError = true;
  } else {
    userFormErrors.value.role = '';
  }

  console.log('Validation Errors:', userFormErrors.value); // 確認錯誤訊息是否正確更新

  if (hasError) {
    console.log('Form has errors, stopping submission'); // 確認是否因為錯誤而停止
    return;
  }

  const newUser = {
    username: userForm.value.username,
    name: userForm.value.name,
    role: userForm.value.role,
    status: '啟用',
    createdAt: new Date().toISOString().split('T')[0]
  };

  console.log('New user data:', newUser); // 確認新增的使用者資料

  store.addUser(newUser);
  closeAddUserModal();
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
  if (user.role === '超級管理員') {
    alert('無法停用超級管理員')
    return
  }
  user.status = user.status === '啟用' ? '停用' : '啟用'
}

const changeUserRole = (user) => {
  if (user.role === '超級管理員') {
    alert('無法變更超級管理員的角色')
    return
  }
  editingUser.value = user
  newRole.value = user.role
}

const updateUserRole = () => {
  editingUser.value.role = newRole.value
  editingUser.value = null
}

const getRoleType = (role) => {
  const roleTypes = {
    '超級管理員': 'success',
    '管理員': 'info',
    '承辦人': 'orange',
    '稽核人員': 'warning',
    '業者': 'default'
  }
  return roleTypes[role] || 'default'
}

const showDeleteDialog = (user) => {
  deleteDialog.value = {
    show: true,
    user: user
  }
}

const confirmDeleteUser = () => {
  if (deleteDialog.value.user) {
    const success = store.removeUser(deleteDialog.value.user.id)
    if (success) {
      if (toastRef.value) {
        toastRef.value.show('使用者已成功刪除', 'success')
      }
    }
    deleteDialog.value = { show: false, user: null }
  }
}

const cancelDeleteUser = () => {
  deleteDialog.value = { show: false, user: null }
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

<style scoped>
</style>