<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- 頁面標題 -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800">單據開立</h2>
        <p class="text-gray-600 mt-1">建立新的收入單據</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 單據表單 -->
        <BaseCard title="新增單據">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="form-label">單據編號</label>
              <input
                v-model="form.number"
                type="text"
                class="form-input"
                placeholder="系統自動產生"
                readonly
              />
            </div>

            <div>
              <label class="form-label">申請人姓名 *</label>
              <input
                v-model="form.applicantName"
                type="text"
                class="form-input"
                placeholder="請輸入申請人姓名"
                required
              />
            </div>

            <div>
              <label class="form-label">單位名稱 *</label>
              <input
                v-model="form.department"
                type="text"
                class="form-input"
                placeholder="請輸入單位名稱"
                required
              />
            </div>

            <div>
              <label class="form-label">金額 *</label>
              <input
                v-model.number="form.amount"
                type="number"
                min="1"
                class="form-input"
                placeholder="請輸入金額"
                required
              />
            </div>

            <div>
              <label class="form-label">付款方式 *</label>
              <select v-model="form.paymentMethod" class="form-input" required>
                <option value="">請選擇付款方式</option>
                <option value="轉帳">轉帳</option>
                <option value="臨櫃">臨櫃</option>
                <option value="信用卡">信用卡</option>
              </select>
            </div>

            <div>
              <label class="form-label">備註</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="form-input"
                placeholder="請輸入備註（選填）"
              ></textarea>
            </div>

            <div class="flex space-x-3 justify-end">
              <button type="submit" class="btn-primary">新增</button>
              <button type="button" @click="resetForm" class="btn-secondary">重設</button>
            </div>
          </form>
        </BaseCard>

        <!-- 已建立單據列表 -->
        <BaseCard title="已建立單據">
          <div v-if="recentDocuments.length > 0">
            <BaseTable
              :columns="documentColumns"
              :data="recentDocuments"
              :show-actions="true"
            >
              <template #status="{ value }">
                <BaseTag
                  :text="value"
                  :type="getStatusType(value)"
                />
              </template>
              
              <template #amount="{ value }">
                ${{ value.toLocaleString() }}
              </template>

              <template #actions="{ row }">
                <button
                  @click="editDocument(row)"
                  class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm font-medium rounded-md transition-colors mr-2"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編輯
                </button>
                <button
                  @click="cancelDocument(row)"
                  :disabled="row.status === '作廢'"
                  :class="[
                    'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    row.status === '作廢' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                  ]"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  作廢
                </button>
              </template>
            </BaseTable>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            尚未建立任何單據
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- 作廢確認對話框 -->
    <BaseConfirmDialog
      :show="confirmDialog.show"
      title="確認作廢單據"
      :message="confirmDialog.document ? `確定要作廢單據 ${confirmDialog.document.number} 嗎？\n\n此操作將無法復原，請謹慎確認。` : ''"
      confirmText="確定作廢"
      cancelText="取消"
      type="danger"
      confirm-button-variant="danger"
      @confirm="handleCancelConfirm"
      @cancel="handleCancelCancel"
      @close="handleCancelCancel"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const toast = useToast()

const form = ref({
  number: '',
  applicantName: '',
  department: '',
  amount: '',
  paymentMethod: '',
  notes: ''
})

// 確認對話框狀態
const confirmDialog = ref({
  show: false,
  document: null
})

const documentColumns = [
  { key: 'number', title: '單據編號' },
  { key: 'applicantName', title: '申請人' },
  { key: 'amount', title: '金額' },
  { key: 'status', title: '狀態' }
]

// 獲取最近建立的單據（限制顯示 10 筆）
const recentDocuments = computed(() => {
  return store.documents.slice(-10).reverse()
})

function generateDocumentNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const count = store.documents.length + 1
  form.value.number = `RV${year}${month}${String(count).padStart(3, '0')}`
}

function resetForm() {
  form.value = {
    number: '',
    applicantName: '',
    department: '',
    amount: '',
    paymentMethod: '',
    notes: ''
  }
  generateDocumentNumber()
}

function handleSubmit() {
  const newDocument = {
    number: form.value.number,
    applicantName: form.value.applicantName,
    department: form.value.department,
    amount: Number(form.value.amount),
    paymentMethod: form.value.paymentMethod,
    notes: form.value.notes
  }

  store.addDocument(newDocument)
  
  toast.success(`單據 ${newDocument.number} 建立成功！`)
  
  resetForm()
}

function getStatusType(status) {
  const statusTypes = {
    '未核銷': 'warning',
    '已核銷': 'success',
    '作廢': 'default'
  }
  return statusTypes[status] || 'default'
}

function editDocument(document) {
  // 簡單的編輯功能 - 填入表單
  form.value = { ...document }
}

function cancelDocument(document) {
  confirmDialog.value = {
    show: true,
    document: document
  }
}

function handleCancelConfirm() {
  if (confirmDialog.value.document) {
    store.updateDocumentStatus(confirmDialog.value.document.id, '作廢')
    toast.success(`單據 ${confirmDialog.value.document.number} 已作廢`)
  }
  confirmDialog.value = { show: false, document: null }
}

function handleCancelCancel() {
  confirmDialog.value = { show: false, document: null }
}

onMounted(() => {
  generateDocumentNumber()
})
</script>