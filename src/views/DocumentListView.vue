<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- 頁面標題 -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-800">單據管理</h2>
          <p class="text-sm sm:text-base text-gray-600 mt-1">查詢和管理所有單據資料</p>
        </div>
        
        <!-- 新增單據按鈕 - 僅承辦人可見 -->
        <button 
          v-if="store.currentUser?.role === '承辦人'"
          @click="openCreateModal"
          class="btn-primary inline-flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Icon icon="heroicons:plus" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          新增單據
        </button>
      </div>

      <!-- 搜尋條件 -->
      <BaseCard>
        <div class="flex items-center justify-between cursor-pointer" @click="toggleSearchPanel">
          <div class="flex items-center space-x-2">
            <h3 class="text-lg font-medium text-gray-900">搜尋條件</h3>
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <circle cx="6" cy="6" r="2" />
              <circle cx="14" cy="12" r="2" />
              <circle cx="10" cy="18" r="2" />
            </svg>
          </div>
          <svg 
            :class="['w-5 h-5 transition-transform', searchPanelOpen ? 'rotate-180' : '']"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div v-show="searchPanelOpen" class="mt-4 space-y-6">
          <!-- 第一排 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseFormInput
              v-model="searchForm.number"
              label="單據編號"
              icon="heroicons:document-text"
              placeholder="請輸入單據編號"
            />
            
            <BaseFormInput
              v-model="searchForm.applicantName"
              label="申請人"
              icon="heroicons:user"
              placeholder="請輸入申請人姓名"
            />
            
            <BaseFormInput
              v-model="searchForm.department"
              label="單位"
              type="select"
            >
              <template #options>
                <option 
                  v-for="dept in departments" 
                  :key="dept.value" 
                  :value="dept.value"
                >
                  {{ dept.label }}
                </option>
              </template>
            </BaseFormInput>
            
            <BaseFormInput
              v-model="searchForm.paymentMethod"
              label="付款方式"
              type="select"
            >
              <template #options>
                <option value="">全部</option>
                <option value="轉帳">轉帳</option>
                <option value="臨櫃">臨櫃</option>
                <option value="信用卡">信用卡</option>
              </template>
            </BaseFormInput>
          </div>
          
          <!-- 第二排 - 日期和狀態 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- 建立日期範圍 -->
            <div class="lg:col-span-2">
              <label class="form-label">建立日期範圍</label>
              <!-- 桌面版：橫向排列 -->
              <div class="hidden sm:flex items-center space-x-2">
                <input
                  v-model="searchForm.dateStart"
                  type="date"
                  class="form-input flex-1"
                />
                <span class="text-gray-500">~</span>
                <input
                  v-model="searchForm.dateEnd"
                  type="date"
                  class="form-input flex-1"
                />
              </div>
              <!-- 手機版：直向排列 -->
              <div class="sm:hidden space-y-2">
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">起始日期</label>
                  <input
                    v-model="searchForm.dateStart"
                    type="date"
                    class="form-input w-full"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">結束日期</label>
                  <input
                    v-model="searchForm.dateEnd"
                    type="date"
                    class="form-input w-full"
                  />
                </div>
              </div>
            </div>
            
            <!-- 狀態 -->
            <BaseFormInput
              v-model="searchForm.status"
              label="狀態"
              type="select"
            >
              <template #options>
                <option value="">全部</option>
                <option value="未核銷">未核銷</option>
                <option value="已核銷">已核銷</option>
                <option value="已作廢">已作廢</option>
              </template>
            </BaseFormInput>
          </div>

          <!-- 第三排 - 金額範圍 -->
          <div class="w-full">
            <div class="max-w-2xl">
              <label class="form-label">金額範圍</label>
              <div class="flex items-center space-x-2 mb-3">
                <input
                  v-model="searchForm.amountMin"
                  type="number"
                  class="form-input flex-1"
                  placeholder="最小金額"
                />
                <span class="text-gray-500">~</span>
                <input
                  v-model="searchForm.amountMax"
                  type="number"
                  class="form-input flex-1"
                  placeholder="最大金額"
                />
              </div>
              <!-- 最小金額拖拉條 -->
              <div class="mb-3">
                <label class="text-xs text-gray-600">最小金額拖拉條</label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  v-model="searchForm.amountMin"
                  class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="text-xs text-gray-500 mt-1">最小金額: ${{ parseInt(searchForm.amountMin || 0).toLocaleString() }}</div>
              </div>
              <!-- 最大金額拖拉條 -->
              <div>
                <label class="text-xs text-gray-600">最大金額拖拉條</label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  v-model="searchForm.amountMax"
                  class="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div class="text-xs text-gray-500 mt-1">最大金額: ${{ parseInt(searchForm.amountMax || 0).toLocaleString() }}</div>
              </div>
            </div>
          </div>
          
          <!-- 按鈕區 -->
          <div class="flex justify-end space-x-2">
            <button @click="resetSearch" class="btn-secondary">
              <Icon icon="heroicons:arrow-path" class="w-5 h-5 inline-block mr-1" />
              重設
            </button>
            <button @click="search" class="btn-primary">
              <Icon icon="heroicons:magnifying-glass" class="w-5 h-5 inline-block mr-1" />
              搜尋
            </button>
          </div>
        </div>
      </BaseCard>

      <!-- 單據列表 -->
      <BaseCard title="單據列表">
        <!-- 桌面版：表格 -->
        <div v-if="!isMobile">
          <BaseTable
            :columns="documentColumns"
            :data="displayDocuments"
            :show-actions="true"
          >
            <template #status="{ value }">
              <BaseTag :text="value" :type="getStatusType(value)" />
            </template>
            
            <template #amount="{ value }">
              ${{ value.toLocaleString() }}
            </template>

            <template #actions="{ row }">
              <!-- 編輯按鈕 - 僅承辦人 -->
              <button
                v-if="appStore.currentUser.role === '承辦人'"
                @click="editDocument(row)"
                :disabled="row.status === '已作廢'"
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors mr-2',
                  row.status === '已作廢'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                ]"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                編輯
              </button>
              
              <!-- 檢視按鈕 -->
              <button 
                @click="viewDocument(row)" 
                class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm font-medium rounded-md transition-colors mr-2"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                檢視
              </button>
              
              <!-- 作廢按鈕 -->
              <button
                v-if="appStore.currentUser.role === '承辦人'"
                @click="cancelDocument(row)"
                :disabled="row.status === '已作廢'"
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  row.status === '已作廢' 
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

        <!-- 手機版：卡片 -->
        <div v-else class="space-y-3">
          <div v-if="displayDocuments.length > 0" class="space-y-3">
            <div
              v-for="doc in displayDocuments"
              :key="doc.id"
              class="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <!-- 頂部：單據編號和狀態 -->
              <div class="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-500">單據編號</div>
                  <div class="font-medium text-gray-900 text-base truncate">{{ doc.number }}</div>
                </div>
                <BaseTag :text="doc.status" :type="getStatusType(doc.status)" class="ml-2 flex-shrink-0" />
              </div>

              <!-- 中間：資訊區 -->
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div class="text-xs text-gray-500">申請人</div>
                  <div class="text-gray-900 text-sm font-medium">{{ doc.applicantName }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">單位</div>
                  <div class="text-gray-900 text-sm">{{ doc.department }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">金額</div>
                  <div class="text-green-600 text-base font-semibold">${{ doc.amount.toLocaleString() }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">付款方式</div>
                  <div class="text-gray-900 text-sm">{{ doc.paymentMethod }}</div>
                </div>
                <div class="col-span-2">
                  <div class="text-xs text-gray-500">建立日期</div>
                  <div class="text-gray-900 text-sm">{{ doc.createdAt }}</div>
                </div>
              </div>

              <!-- 底部：操作按鈕 -->
              <div class="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                <!-- 編輯按鈕 - 僅承辦人 -->
                <button
                  v-if="appStore.currentUser.role === '承辦人'"
                  @click="editDocument(doc)"
                  :disabled="doc.status === '已作廢'"
                  :class="[
                    'flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors',
                    doc.status === '已作廢'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                  ]"
                >
                  <Icon icon="heroicons:pencil" class="w-4 h-4 mr-1" />
                  編輯
                </button>
                
                <!-- 檢視按鈕 -->
                <button 
                  @click="viewDocument(doc)" 
                  class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-xs font-medium rounded-md transition-colors"
                >
                  <Icon icon="heroicons:eye" class="w-4 h-4 mr-1" />
                  檢視
                </button>
                
                <!-- 作廢按鈕 - 僅承辦人 -->
                <button
                  v-if="appStore.currentUser.role === '承辦人'"
                  @click="cancelDocument(doc)"
                  :disabled="doc.status === '已作廢'"
                  :class="[
                    'flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors',
                    doc.status === '已作廢' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                  ]"
                >
                  <Icon icon="heroicons:trash" class="w-4 h-4 mr-1" />
                  作廢
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-500">
            暫無單據資料
          </div>
        </div>
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

    <!-- 新增/編輯單據 Modal -->
    <BaseModal
      v-model:show="showModal"
      :title="isEditing ? '編輯單據' : '新增單據'"
      subtitle="請填寫完整的單據資訊"
      size="lg"
      :hide-footer="true"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <BaseFormInput
          v-model="form.number"
          label="單據編號"
          icon="heroicons:document-text"
          placeholder="系統自動產生"
          help-text="單據編號由系統自動生成"
          :readonly="true"
        />

        <BaseFormInput
          v-model="form.applicantName"
          label="申請人姓名"
          icon="heroicons:user"
          placeholder="請輸入申請人姓名"
          help-text="請輸入完整的中文姓名"
          :required="true"
        />

        <BaseFormInput
          v-model="form.department"
          label="單位名稱"
          icon="heroicons:building-office"
          placeholder="請輸入單位名稱"
          help-text="例如：財務處、人事處等"
          :required="true"
        />

        <BaseFormInput
          v-model="form.amount"
          label="金額"
          type="number"
          icon="heroicons:currency-dollar"
          placeholder="請輸入金額"
          help-text="請輸入正整數金額（元）"
          :required="true"
          :min="1"
        />

        <BaseFormInput
          v-model="form.paymentMethod"
          label="付款方式"
          type="select"
          placeholder="請選擇付款方式"
          :required="true"
        >
          <template #options>
            <option value="轉帳">轉帳</option>
            <option value="臨櫃">臨櫃</option>
            <option value="信用卡">信用卡</option>
          </template>
        </BaseFormInput>

        <BaseFormInput
          v-model="form.notes"
          label="備註"
          type="textarea"
          placeholder="請輸入備註內容（選填）"
          help-text="可填寫相關說明或注意事項"
          :rows="3"
        />

        <div class="flex space-x-3 justify-end pt-4 border-t border-gray-200">
          <button 
            type="button" 
            @click="closeModal" 
            class="btn-secondary"
          >
            取消
          </button>
          <button 
            type="submit" 
            class="btn-primary"
          >
            {{ isEditing ? '更新' : '新增' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseModal from '../components/common/BaseModal.vue'
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
import BaseFormInput from '../components/common/BaseFormInput.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const appStore = useAppStore()
const toast = useToast()

// RWD 響應式變數
const isMobile = ref(window.innerWidth < 640)

// Modal 控制
const showModal = ref(false)
const isEditing = ref(false)
const currentEditId = ref(null)

// 表單資料
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

// 部門選項資料
const departments = ref([
  { value: '', label: '全部單位' },
  { value: '財務處', label: '財務處' },
  { value: '人事處', label: '人事處' },
  { value: '研發部', label: '研發部' },
  { value: '行政處', label: '行政處' },
  { value: '業務部', label: '業務部' }
])

// 搜尋面板摺疊狀態（預設打開）
const searchPanelOpen = ref(true)

// 切換搜尋面板
const toggleSearchPanel = () => {
  searchPanelOpen.value = !searchPanelOpen.value
}

const searchForm = ref({
  number: '',
  applicantName: '',
  department: '',
  amountMin: '',
  amountMax: '',
  paymentMethod: '',
  status: '',
  dateStart: '',
  dateEnd: ''
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

const searchResults = ref([])
const hasSearched = ref(false)

const displayDocuments = computed(() => {
  return hasSearched.value ? searchResults.value : store.documents
})

const getStatusType = (status) => {
  const statusTypes = {
    '未核銷': 'warning',
    '已核銷': 'success',
    '已作廢': 'danger'
  }
  return statusTypes[status] || 'default'
}

const search = () => {
  let result = store.documents
  
  // 單據編號篩選
  if (searchForm.value.number) {
    result = result.filter(doc => 
      doc.number.toLowerCase().includes(searchForm.value.number.toLowerCase())
    )
  }
  
  // 申請人篩選
  if (searchForm.value.applicantName) {
    result = result.filter(doc => 
      doc.applicantName.toLowerCase().includes(searchForm.value.applicantName.toLowerCase())
    )
  }
  
  // 單位篩選
  if (searchForm.value.department) {
    result = result.filter(doc => 
      doc.department.toLowerCase().includes(searchForm.value.department.toLowerCase())
    )
  }
  
  // 金額範圍篩選
  if (searchForm.value.amountMin) {
    result = result.filter(doc => doc.amount >= parseInt(searchForm.value.amountMin))
  }
  if (searchForm.value.amountMax) {
    result = result.filter(doc => doc.amount <= parseInt(searchForm.value.amountMax))
  }
  
  // 付款方式篩選
  if (searchForm.value.paymentMethod) {
    result = result.filter(doc => doc.paymentMethod === searchForm.value.paymentMethod)
  }
  
  // 狀態篩選
  if (searchForm.value.status) {
    result = result.filter(doc => doc.status === searchForm.value.status)
  }
  
  // 日期範圍篩選
  if (searchForm.value.dateStart) {
    result = result.filter(doc => doc.createdAt >= searchForm.value.dateStart)
  }
  if (searchForm.value.dateEnd) {
    result = result.filter(doc => doc.createdAt <= searchForm.value.dateEnd)
  }
  
  searchResults.value = result
  hasSearched.value = true
}

const resetSearch = () => {
  searchForm.value = {
    number: '',
    applicantName: '',
    department: '',
    amountMin: '',
    amountMax: '',
    paymentMethod: '',
    status: '',
    dateStart: '',
    dateEnd: ''
  }
  hasSearched.value = false
  searchResults.value = []
}

const viewDocument = (document) => {
  selectedDocument.value = document
}

const cancelDocument = (document) => {
  confirmDialog.value = {
    show: true,
    document: document
  }
}

const handleCancelConfirm = () => {
  if (confirmDialog.value.document) {
    store.updateDocumentStatus(confirmDialog.value.document.id, '已作廢')
    toast.success(`單據 ${confirmDialog.value.document.number} 已作廢`)
  }
  confirmDialog.value = { show: false, document: null }
}

const handleCancelCancel = () => {
  confirmDialog.value = { show: false, document: null }
}

// === 新增單據相關功能 ===

const generateDocumentNumber = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const count = store.documents.length + 1
  form.value.number = `RV${year}${month}${String(count).padStart(3, '0')}`
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const editDocument = (document) => {
  isEditing.value = true
  currentEditId.value = document.number
  form.value = {
    number: document.number,
    applicantName: document.applicantName,
    department: document.department,
    amount: document.amount,
    paymentMethod: document.paymentMethod,
    notes: document.notes || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  // 關閉後重設表單
  setTimeout(() => {
    resetForm()
  }, 300)
}

const resetForm = () => {
  isEditing.value = false
  currentEditId.value = null
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

const handleSubmit = () => {
  const documentData = {
    number: form.value.number,
    applicantName: form.value.applicantName,
    department: form.value.department,
    amount: Number(form.value.amount),
    paymentMethod: form.value.paymentMethod,
    notes: form.value.notes
  }

  if (isEditing.value) {
    // 更新現有單據
    store.updateDocument(currentEditId.value, documentData)
    toast.success(`單據 ${documentData.number} 更新成功！`)
  } else {
    // 新增單據
    store.addDocument(documentData)
    toast.success(`單據 ${documentData.number} 建立成功！`)
  }
  
  closeModal()
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  generateDocumentNumber()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>