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

            <div class="flex space-x-3">
              <button type="submit" class="btn-primary">新增單據</button>
              <button type="button" @click="resetForm" class="btn-secondary">重設表單</button>
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
                  class="text-blue-600 hover:text-blue-800 text-sm mr-3"
                >
                  編輯
                </button>
                <button
                  @click="cancelDocument(row)"
                  class="text-red-600 hover:text-red-800 text-sm"
                  :disabled="row.status === '作廢'"
                >
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

      <!-- 成功訊息 -->
      <div v-if="successMessage" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ successMessage }}
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()

const form = ref({
  number: '',
  applicantName: '',
  department: '',
  amount: '',
  paymentMethod: '',
  notes: ''
})

const successMessage = ref('')

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
  
  successMessage.value = `單據 ${newDocument.number} 建立成功！`
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
  
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
  if (confirm(`確定要作廢單據 ${document.number} 嗎？`)) {
    store.updateDocumentStatus(document.id, '作廢')
    successMessage.value = `單據 ${document.number} 已作廢`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

onMounted(() => {
  generateDocumentNumber()
})
</script>