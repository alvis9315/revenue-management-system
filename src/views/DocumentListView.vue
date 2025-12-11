<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- 頁面標題 -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800">單據查詢與管理</h2>
        <p class="text-gray-600 mt-1">查詢和管理所有單據資料</p>
      </div>

      <!-- 搜尋條件 -->
      <BaseCard title="搜尋條件">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">單據編號</label>
            <input
              v-model="searchForm.number"
              type="text"
              class="form-input"
              placeholder="請輸入單據編號"
            />
          </div>
          <div>
            <label class="form-label">狀態</label>
            <select v-model="searchForm.status" class="form-input">
              <option value="">全部</option>
              <option value="未核銷">未核銷</option>
              <option value="已核銷">已核銷</option>
              <option value="作廢">作廢</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetSearch" class="btn-secondary mr-2">重設</button>
            <button @click="search" class="btn-primary">搜尋</button>
          </div>
        </div>
      </BaseCard>

      <!-- 單據列表 -->
      <BaseCard title="單據列表">
        <BaseTable
          :columns="documentColumns"
          :data="filteredDocuments"
          :show-actions="true"
        >
          <template #status="{ value }">
            <BaseTag :text="value" :type="getStatusType(value)" />
          </template>
          
          <template #amount="{ value }">
            ${{ value.toLocaleString() }}
          </template>

          <template #actions="{ row }">
            <button @click="viewDocument(row)" class="text-blue-600 hover:text-blue-800 text-sm mr-3">
              檢視
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
      </BaseCard>
    </div>

    <!-- 查看詳情 Modal -->
    <div v-if="selectedDocument" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">單據詳情</h3>
        <div class="space-y-3">
          <div><strong>單據編號:</strong> {{ selectedDocument.number }}</div>
          <div><strong>申請人:</strong> {{ selectedDocument.applicantName }}</div>
          <div><strong>單位:</strong> {{ selectedDocument.department }}</div>
          <div><strong>金額:</strong> ${{ selectedDocument.amount.toLocaleString() }}</div>
          <div><strong>付款方式:</strong> {{ selectedDocument.paymentMethod }}</div>
          <div><strong>狀態:</strong> 
            <BaseTag :text="selectedDocument.status" :type="getStatusType(selectedDocument.status)" />
          </div>
          <div v-if="selectedDocument.notes"><strong>備註:</strong> {{ selectedDocument.notes }}</div>
        </div>
        <div class="mt-6 text-right">
          <button @click="selectedDocument = null" class="btn-secondary">關閉</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()

const searchForm = ref({
  number: '',
  status: ''
})

const selectedDocument = ref(null)

const documentColumns = [
  { key: 'number', title: '單據編號' },
  { key: 'applicantName', title: '申請人' },
  { key: 'department', title: '單位' },
  { key: 'amount', title: '金額' },
  { key: 'paymentMethod', title: '付款方式' },
  { key: 'status', title: '狀態' },
  { key: 'createdAt', title: '建立日期' }
]

const filteredDocuments = computed(() => {
  let result = store.documents
  
  if (searchForm.value.number) {
    result = result.filter(doc => 
      doc.number.toLowerCase().includes(searchForm.value.number.toLowerCase())
    )
  }
  
  if (searchForm.value.status) {
    result = result.filter(doc => doc.status === searchForm.value.status)
  }
  
  return result
})

function getStatusType(status) {
  const statusTypes = {
    '未核銷': 'warning',
    '已核銷': 'success',
    '作廢': 'default'
  }
  return statusTypes[status] || 'default'
}

function search() {
  // 搜尋邏輯已經在 computed 中處理
}

function resetSearch() {
  searchForm.value = {
    number: '',
    status: ''
  }
}

function viewDocument(document) {
  selectedDocument.value = document
}

function cancelDocument(document) {
  if (confirm(`確定要作廢單據 ${document.number} 嗎？`)) {
    store.updateDocumentStatus(document.id, '作廢')
  }
}
</script>