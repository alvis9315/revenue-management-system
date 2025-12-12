<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">核銷匯入</h2>
        <p class="text-gray-600 mt-1">匯入金融機構繳費明細進行核銷比對</p>
      </div>

      <!-- 匯入區塊 -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <!-- 可折疊標題 -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer" @click="isImportSectionCollapsed = !isImportSectionCollapsed">
          <div class="flex items-center">
            <h3 class="text-lg font-semibold text-gray-900">檔案匯入</h3>
            <Icon icon="heroicons:cloud-arrow-up" class="w-5 h-5 text-blue-500 ml-2" />
          </div>
          <Icon icon="heroicons:chevron-down" class="w-5 h-5 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isImportSectionCollapsed }" />
        </div>
        
        <!-- 可折疊內容 -->
        <div v-show="!isImportSectionCollapsed" class="p-6">
          <div class="space-y-4">
          <!-- 格式說明和範例下載 -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">檔案格式說明</h4>
                <p class="text-sm text-gray-500">請上傳包含單據編號、金額、繳費日期等欄位的 CSV 或 Excel 檔案</p>
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="downloadTemplate"
                  class="inline-flex items-center px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Icon icon="heroicons:document-arrow-down" class="w-4 h-4 mr-2" />
                  下載範例檔
                </button>
                <button 
                  @click="downloadTestData"
                  class="inline-flex items-center px-3 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Icon icon="heroicons:beaker" class="w-4 h-4 mr-2" />
                  測試資料 (1000筆)
                </button>
              </div>
            </div>
          </div>

          <div>
            <!-- 美化的檔案上傳區域 -->
            <div class="relative">
              <input 
                type="file" 
                ref="fileInput"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".csv,.xlsx,.xls" 
                @change="handleFileSelect"
              />
              <div class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
                <div class="text-center">
                  <Icon icon="heroicons:document-text" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p class="text-gray-600 mb-2">
                    <span class="font-medium text-primary-500 hover:text-primary-800">點擊選擇檔案</span>
                    或拖拽檔案至此處
                  </p>
                  <p class="text-sm text-gray-500">支援 CSV, XLSX, XLS 格式</p>
                </div>
              </div>
              <!-- 檔案名稱顯示在拖放區域下方 -->
              <div v-if="selectedFile" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                  <Icon icon="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span class="text-sm text-green-700 font-medium">已選擇檔案：{{ selectedFile.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="relative group">
              <button 
                @click="executeImport" 
                :disabled="importing || !selectedFile" 
                :class="[
                  'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  (importing || !selectedFile) 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                ]"
              >
                <Icon v-if="importing" icon="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                {{ importing ? '匯入中...' : '執行匯入' }}
              </button>
              
              <!-- Tooltip -->
              <div 
                v-if="!selectedFile && !importing"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 shadow-lg"
                style="z-index: 1000;"
              >
                請先選擇要匯入的檔案
                <!-- 箭頭 -->
                <div class="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- 匯入結果 -->
      <div v-if="importResult">
        <BaseTabs 
          :tabs="resultTabs" 
          default-tab="success"
          @tab-change="onTabChange"
        >
          <!-- 核銷成功 Tab -->
          <template #tab-success>
            <BaseVirtualTable
              :columns="successColumns"
              :items="importResult.success"
              height="500px"
              :virtual-threshold="50"
              :get-item-key="(item) => item.importId"
              empty-text="暫無成功紀錄"
            >
              <template #cell-documentNumber="{ item }">
                <span class="font-medium text-gray-900">{{ item.documentNumber }}</span>
              </template>
              
              <template #cell-bankAmount="{ item }">
                <span class="text-green-600 font-medium">${{ item.bankAmount.toLocaleString() }}</span>
              </template>
              
              <template #cell-depositDate="{ item }">
                <span class="text-gray-600">{{ item.depositDate }}</span>
              </template>
              
              <template #cell-actions="{ item }">
                <div class="flex items-center">
                  <button 
                    @click="viewSuccessDetail(item)"
                    class="inline-flex flex-row items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm font-medium rounded-md transition-colors"
                  >
                    <Icon icon="heroicons:eye" class="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>檢視</span>
                  </button>
                </div>
              </template>
            </BaseVirtualTable>
          </template>
          
          <!-- 金額不符 Tab -->
          <template #tab-mismatch>
            <BaseVirtualTable
              :columns="mismatchColumns"
              :items="importResult.amountMismatch"
              height="500px"
              :virtual-threshold="50"
              :item-height="80"
              :get-item-key="(item) => item.importId"
              empty-text="暫無金額不符紀錄"
            >
              <template #cell-documentNumber="{ item }">
                <span class="font-medium text-gray-900">{{ item.documentNumber }}</span>
              </template>
              
              <template #cell-bankAmount="{ item }">
                <span class="text-gray-600">${{ item.bankAmount.toLocaleString() }}</span>
              </template>
              
              <template #cell-systemAmount="{ item }">
                <span class="text-gray-600">${{ item.systemAmount.toLocaleString() }}</span>
              </template>
              
              <template #cell-difference="{ item }">
                <span class="text-red-600 font-medium">
                  ${{ Math.abs(item.bankAmount - item.systemAmount).toLocaleString() }}
                </span>
              </template>
              
              <template #cell-reason="{ item }">
                <div class="text-red-600 text-sm">
                  <div class="font-medium">金額不符</div>
                  <div class="text-xs text-gray-500 mt-0.5">
                    差額：${{ Math.abs(item.bankAmount - item.systemAmount).toLocaleString() }}
                  </div>
                </div>
              </template>
              
              <template #cell-actions="{ item }">
                <div class="flex flex-col space-y-1">
                  <button 
                    @click="handleMismatch(item)"
                    class="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-xs font-medium rounded transition-colors w-full"
                  >
                    <Icon icon="heroicons:pencil" class="w-3 h-3 mr-1" />
                    <span>處理</span>
                  </button>
                  <button 
                    @click="viewMismatchDetail(item)"
                    class="inline-flex items-center justify-center px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 text-xs font-medium rounded transition-colors w-full"
                  >
                    <Icon icon="heroicons:eye" class="w-3 h-3 mr-1" />
                    <span>檢視</span>
                  </button>
                </div>
              </template>
            </BaseVirtualTable>
          </template>
          
          <!-- 待建檔 Tab -->
          <template #tab-notFound>
            <BaseVirtualTable
              :columns="notFoundColumns"
              :items="importResult.documentNotFound"
              height="500px"
              :virtual-threshold="50"
              :get-item-key="(item) => item.importId"
              empty-text="暫無待建檔紀錄"
            >
              <template #cell-documentNumber="{ item }">
                <span class="font-medium text-gray-900">{{ item.documentNumber }}</span>
              </template>
              
              <template #cell-bankAmount="{ item }">
                <span class="text-gray-600">${{ item.bankAmount.toLocaleString() }}</span>
              </template>
              
              <template #cell-reason="{ item }">
                <span class="text-red-600 text-sm">{{ item.reason }}</span>
              </template>
              
              <template #cell-actions="{ item }">
                <div class="flex items-center">
                  <button 
                    @click="createDocument(item)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm font-medium rounded-md transition-colors mr-1"
                  >
                    <Icon icon="heroicons:plus" class="w-4 h-4 mr-1" />
                    <span>建立</span>
                  </button>
                  <button 
                    @click="viewNotFoundDetail(item)"
                    class="inline-flex flex-row items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm font-medium rounded-md transition-colors"
                  >
                    <Icon icon="heroicons:eye" class="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>檢視</span>
                  </button>
                </div>
              </template>
            </BaseVirtualTable>
          </template>
        </BaseTabs>
      </div>
    </div>
    
    <!-- Loading 組件 -->
    <BaseLoading 
      :show="importing" 
      title="匯入處理中"
      message="正在處理您的檔案，請稍候..."
    />

    <!-- 金額不符處理確認對話框 -->
    <BaseConfirmDialog
      :show="mismatchDialog.show"
      title="處理金額不符問題"
      :message="mismatchDialog.item ? `是否要處理這筆金額不符的記錄？\n\n單據編號：${mismatchDialog.item.documentNumber}\n銀行金額：$${mismatchDialog.item.bankAmount.toLocaleString()}\n系統金額：$${mismatchDialog.item.systemAmount.toLocaleString()}\n\n確認後將標記為待處理狀態。` : ''"
      confirmText="確認處理"
      cancelText="取消"
      type="warning"
      confirm-button-variant="warning"
      @confirm="confirmMismatchHandle"
      @cancel="cancelMismatchHandle"
      @close="cancelMismatchHandle"
    />

    <!-- 建立單據確認對話框 -->
    <BaseConfirmDialog
      :show="createDocDialog.show"
      title="建立新單據"
      :message="createDocDialog.item ? `是否要為此筆資料建立新單據？\n\n單據編號：${createDocDialog.item.documentNumber}\n金額：$${createDocDialog.item.bankAmount.toLocaleString()}\n\n新單據建立後將加入系統。` : ''"
      confirmText="確認建立"
      cancelText="取消"
      type="info"
      confirm-button-variant="primary"
    />
    <!-- Loading 組件 -->
    <BaseLoading 
      :show="importing" 
      title="匯入處理中"
      message="正在處理您的檔案，請稍候..."
    />

    <!-- 金額不符處理確認對話框 -->
    <BaseConfirmDialog
      :show="mismatchDialog.show"
      title="處理金額不符問題"
      :message="mismatchDialog.item ? `是否要處理這筆金額不符的記錄？\n\n單據編號：${mismatchDialog.item.documentNumber}\n銀行金額：$${mismatchDialog.item.bankAmount.toLocaleString()}\n系統金額：$${mismatchDialog.item.systemAmount.toLocaleString()}\n\n確認後將標記為待處理狀態。` : ''"
      confirmText="確認處理"
      cancelText="取消"
      type="warning"
      confirm-button-variant="warning"
      @confirm="confirmMismatchHandle"
      @cancel="cancelMismatchHandle"
      @close="cancelMismatchHandle"
    />

    <!-- 建立單據確認對話框 -->
    <BaseConfirmDialog
      :show="createDocDialog.show"
      title="建立新單據"
      :message="createDocDialog.item ? `是否要為此筆資料建立新單據？\n\n單據編號：${createDocDialog.item.documentNumber}\n金額：$${createDocDialog.item.bankAmount.toLocaleString()}\n\n新單據建立後將加入系統。` : ''"
      confirmText="確認建立"
      cancelText="取消"
      type="info"
      confirm-button-variant="primary"
      @confirm="confirmCreateDocument"
      @cancel="cancelCreateDocument"
      @close="cancelCreateDocument"
    />

    <!-- 檢視詳細資料對話框 -->
    <BaseConfirmDialog
      :show="viewDetailDialog.show"
      :title="viewDialogConfig.title"
      :message="viewDialogConfig.message"
      confirmText="確定"
      :showCancel="false"
      type="info"
      confirm-button-variant="primary"
      @confirm="closeViewDetailDialog"
      @close="closeViewDetailDialog"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseLoading from '../components/common/BaseLoading.vue'
import BaseTabs from '../components/common/BaseTabs.vue'
import BaseVirtualTable from '../components/common/BaseVirtualTable.vue'
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { importReconciliationFile } from '../mock/mockApi.js'

const store = useAppStore()
const toast = useToast()
const importing = ref(false)
const importResult = ref(null)
const selectedFile = ref(null)
const fileInput = ref(null)
const isImportSectionCollapsed = ref(false)

// 各種確認對話框狀態
const mismatchDialog = ref({
  show: false,
  item: null
})

const createDocDialog = ref({
  show: false,
  item: null
})

// 檢視詳細資料的對話框狀態
const viewDetailDialog = ref({
  show: false,
  item: null,
  type: null // 'success', 'mismatch', 'notFound'
})

// Tab 配置
const resultTabs = computed(() => [
  {
    key: 'success',
    title: '核銷成功',
    count: importResult.value?.success?.length || 0,
    iconifyIcon: 'heroicons:check-circle'
  },
  {
    key: 'mismatch',
    title: '金額不符',
    count: importResult.value?.amountMismatch?.length || 0,
    iconifyIcon: 'heroicons:exclamation-triangle'
  },
  {
    key: 'notFound',
    title: '待建檔',
    count: importResult.value?.documentNotFound?.length || 0,
    iconifyIcon: 'heroicons:document-plus'
  }
])

// 表格欄位配置
const successColumns = [
  { key: 'documentNumber', title: '單據編號', width: '200px' },
  { key: 'bankAmount', title: '金額', width: '150px' },
  { key: 'depositDate', title: '繳費日期', width: '150px' },
  { key: 'actions', title: '操作', width: '150px' }
]

const mismatchColumns = [
  { key: 'documentNumber', title: '單據編號', width: '140px' },
  { key: 'bankAmount', title: '銀行金額', width: '110px' },
  { key: 'systemAmount', title: '系統金額', width: '110px' },
  { key: 'difference', title: '差額', width: '90px' },
  { key: 'reason', title: '原因', width: '200px' },
  { key: 'actions', title: '操作', width: '200px' }
]

const notFoundColumns = [
  { key: 'documentNumber', title: '單據編號', width: '200px' },
  { key: 'bankAmount', title: '金額', width: '120px' },
  { key: 'reason', title: '原因', width: '280px' },
  { key: 'actions', title: '操作', width: '180px' }
]

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

function downloadTemplate() {
  // 創建範例數據
  const templateData = [
    ['單據編號', '金額', '日期', '備註'],
    ['DOC202301001', '1500', '2023-01-15', '線上繳費'],
    ['DOC202301002', '2300', '2023-01-16', 'ATM轉帳'],
    ['DOC202301003', '800', '2023-01-17', '櫃台現金']
  ]
  
  // 轉換為 CSV 格式
  const csvContent = templateData
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
  
  // 創建下載連結
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', '核銷匯入範例檔.csv')
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function downloadTestData() {
  // 生成 1000 筆測試資料
  const testData = [
    ['單據編號', '金額', '日期', '備註']
  ]
  
  const paymentMethods = ['線上繳費', 'ATM轉帳', '櫃台現金', '信用卡', '超商代收', '銀行轉帳']
  const departments = ['財政處', '教育處', '衛生局', '環保局', '工務處', '社會處']
  
  // 生成 800 筆正常資料 (會成功核銷)
  for (let i = 1; i <= 800; i++) {
    const docNumber = `DOC202401${String(i).padStart(3, '0')}`
    const amount = Math.floor(Math.random() * 50000) + 500 // 500-50500
    const date = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const dept = departments[Math.floor(Math.random() * departments.length)]
    
    testData.push([docNumber, amount, date, `${dept}-${method}`])
  }
  
  // 生成 150 筆金額不符的資料
  for (let i = 801; i <= 950; i++) {
    const docNumber = `DOC202401${String(i).padStart(3, '0')}`
    // 故意讓金額與系統不符
    const amount = Math.floor(Math.random() * 50000) + 500
    const modifiedAmount = amount + Math.floor(Math.random() * 1000) - 500 // 差額 -500~+500
    const date = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const dept = departments[Math.floor(Math.random() * departments.length)]
    
    testData.push([docNumber, modifiedAmount, date, `${dept}-${method}`])
  }
  
  // 生成 50 筆找不到單據的資料 (使用不存在的單據編號)
  for (let i = 951; i <= 1000; i++) {
    const docNumber = `NOTFOUND${String(i).padStart(3, '0')}`
    const amount = Math.floor(Math.random() * 30000) + 1000
    const date = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const dept = departments[Math.floor(Math.random() * departments.length)]
    
    testData.push([docNumber, amount, date, `${dept}-${method}`])
  }
  
  // 隨機打亂順序，讓測試更真實
  const shuffledData = [testData[0]] // 保留標題列
  const dataRows = testData.slice(1)
  for (let i = dataRows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[dataRows[i], dataRows[j]] = [dataRows[j], dataRows[i]]
  }
  shuffledData.push(...dataRows)
  
  // 轉換為 CSV 格式
  const csvContent = shuffledData
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
  
  // 創建下載連結
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', '核銷測試資料_1000筆.csv')
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.success('測試資料已下載！包含 1000 筆記錄 (800筆正常、150筆金額不符、50筆待建檔)')
}

function onTabChange(newTab, oldTab) {
  console.log('切換到 Tab:', newTab)
}

// 按鈕操作處理函數
function viewSuccessDetail(item) {
  viewDetailDialog.value = {
    show: true,
    item: item,
    type: 'success'
  }
}

function handleMismatch(item) {
  mismatchDialog.value = {
    show: true,
    item: item
  }
}

function confirmMismatchHandle() {
  if (mismatchDialog.value.item) {
    toast.success('已將此筆記錄標記為待處理，將轉送給相關人員處理')
    // 這裡可以添加實際的處理邏輯
  }
  mismatchDialog.value = { show: false, item: null }
}

function cancelMismatchHandle() {
  mismatchDialog.value = { show: false, item: null }
}

function viewMismatchDetail(item) {
  viewDetailDialog.value = {
    show: true,
    item: item,
    type: 'mismatch'
  }
}

function createDocument(item) {
  createDocDialog.value = {
    show: true,
    item: item
  }
}

function confirmCreateDocument() {
  if (createDocDialog.value.item) {
    toast.success('新單據已加入系統並可進行核銷')
    // 這裡可以添加實際的建立單據邏輯
  }
  createDocDialog.value = { show: false, item: null }
}

function cancelCreateDocument() {
  createDocDialog.value = { show: false, item: null }
}

function viewNotFoundDetail(item) {
  viewDetailDialog.value = {
    show: true,
    item: item,
    type: 'notFound'
  }
}

// 關閉檢視詳細資料對話框
function closeViewDetailDialog() {
  viewDetailDialog.value = { show: false, item: null, type: null }
}

// 計算檢視對話框的標題和內容
const viewDialogConfig = computed(() => {
  const { item, type } = viewDetailDialog.value
  if (!item) return { title: '', message: '' }
  
  switch (type) {
    case 'success':
      return {
        title: '核銷成功詳細資料',
        message: `單據編號：${item.documentNumber}\n金額：$${item.bankAmount.toLocaleString()}\n繳費日期：${item.depositDate}\n狀態：核銷成功`
      }
    case 'mismatch':
      return {
        title: '金額不符詳細資料',
        message: `單據編號：${item.documentNumber}\n銀行金額：$${item.bankAmount.toLocaleString()}\n系統金額：$${item.systemAmount.toLocaleString()}\n差額：$${Math.abs(item.bankAmount - item.systemAmount).toLocaleString()}\n原因：${item.reason}`
      }
    case 'notFound':
      return {
        title: '待建檔詳細資料',
        message: `單據編號：${item.documentNumber}\n金額：$${item.bankAmount.toLocaleString()}\n原因：${item.reason}\n狀態：需要建立新單據`
      }
    default:
      return { title: '', message: '' }
  }
})

async function executeImport() {
  if (!selectedFile.value) {
    toast.warning('請先選擇檔案才能執行匯入')
    return
  }
  
  importing.value = true
  
  // 執行匯入後立即收合檔案匯入區塊
  isImportSectionCollapsed.value = true
  
  try {
    const result = await importReconciliationFile(selectedFile.value)
    importResult.value = result
    
    // 顯示成功消息
    const successCount = result.success?.length || 0
    const errorCount = (result.amountMismatch?.length || 0) + (result.documentNotFound?.length || 0)
    
    if (successCount > 0) {
      toast.success(
        `檔案匯入完成！成功處理 ${successCount} 筆記錄${errorCount > 0 ? `，${errorCount} 筆異常` : ''}`
      )
    }
    
    if (errorCount > 0 && successCount === 0) {
      toast.warning(`匯入完成但有異常，發現 ${errorCount} 筆異常記錄，請檢查相關 Tab 頁面`)
    }
    
    // 更新成功核銷的單據狀態
    result.success.forEach(record => {
      const doc = store.documents.find(d => d.number === record.documentNumber)
      if (doc) {
        store.updateDocumentStatus(doc.id, '已核銷')
      }
    })
    
    // 將異常記錄加入到 store
    result.amountMismatch.forEach(record => {
      store.addExceptionRecord({
        type: 'amount_mismatch',
        documentNumber: record.documentNumber,
        reason: record.reason,
        bankAmount: record.bankAmount,
        systemAmount: record.systemAmount
      })
    })
    
    result.documentNotFound.forEach(record => {
      store.addExceptionRecord({
        type: 'document_not_found',
        documentNumber: record.documentNumber,
        reason: record.reason,
        bankAmount: record.bankAmount
      })
    })
    
    // 匯入完成後清空選擇的檔案
    selectedFile.value = null
    // 同時清空檔案輸入元件的值
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
  } catch (error) {
    console.error('匯入失敗:', error)
    toast.error('匯入失敗，請檢查檔案格式是否正確，或聯繫系統管理員')
  } finally {
    importing.value = false
  }
}
</script>