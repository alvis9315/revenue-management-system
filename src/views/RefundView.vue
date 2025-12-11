<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">退費作業</h2>
        <p class="text-gray-600 mt-1">處理已核銷單據的退費申請</p>
      </div>

      <!-- 單據查詢區塊 -->
      <BaseCard>
        <div class="flex items-center justify-between cursor-pointer" @click="toggleSearchPanel">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">單據查詢</h3>
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
        
        <div v-show="searchPanelOpen" class="mt-4">
          <!-- 搜尋條件 -->
          <form @submit.prevent="queryDocument" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">單據編號</label>
                <input
                  v-model="queryForm.documentNumber"
                  type="text"
                  class="form-input"
                  placeholder="請輸入單據編號"
                />
              </div>
              <div>
                <label class="form-label">申請人</label>
                <input
                  v-model="queryForm.applicantName"
                  type="text"
                  class="form-input"
                  placeholder="請輸入申請人姓名"
                />
              </div>
            </div>
            
            <!-- 按鈕區 -->
            <div class="flex justify-end space-x-2">
              <button type="button" @click="resetSearch" class="btn-secondary">重設</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? '查詢中...' : '查詢單據' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {{ error }}
        </div>

        <!-- 查詢結果 -->
        <div v-if="searchResults.length > 0" class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">查詢結果 ({{ searchResults.length }} 筆)</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    單據編號
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請人
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    單位
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    開立日期
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="doc in searchResults" :key="doc.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ doc.number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ doc.applicantName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ doc.department }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ doc.amount?.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <BaseTag :text="doc.status" :type="getStatusType(doc.status)" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ doc.createdAt }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      v-if="doc.status === '已核銷'"
                      @click="selectDocumentForRefund(doc)"
                      :disabled="refunding && selectedRefundDocument?.id === doc.id"
                      class="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {{ (refunding && selectedRefundDocument?.id === doc.id) ? '處理中...' : '執行退費' }}
                    </button>
                    <span v-else-if="doc.status === '未核銷'" class="text-amber-600 text-xs">
                      待核銷
                    </span>
                    <span v-else-if="doc.status === '已退費'" class="text-blue-600 text-xs">
                      已退費
                    </span>
                    <span v-else-if="doc.status === '已作廢'" class="text-gray-500 text-xs">
                      已作廢
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-else-if="hasSearched && searchResults.length === 0" class="mt-8 text-center py-8 text-gray-500">
          沒有找到符合條件的單據
        </div>
      </BaseCard>

      <!-- 可退費單據清單 -->
      <BaseCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">可退費單據清單</h3>
          <span v-if="refundableDocuments.length > 0" class="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm font-medium">
            {{ refundableDocuments.length }} 筆
          </span>
        </div>

        <div v-if="refundableDocuments.length === 0" class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4m0 0V22.5L12 20l-8 4v12a4 4 0 004 4h16a4 4 0 004-4v-12l-8-4-2 2.5V36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="mt-4">目前沒有可退費的單據</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  單據編號
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請人
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  單位
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開立日期
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="doc in refundableDocuments" :key="doc.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ doc.number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ doc.applicantName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ doc.department }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ doc.amount?.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ doc.createdAt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="selectDocumentForRefund(doc)"
                    :disabled="refunding && selectedRefundDocument?.id === doc.id"
                    class="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {{ (refunding && selectedRefundDocument?.id === doc.id) ? '處理中...' : '執行退費' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- 成功訊息 -->
      <div v-if="successMessage" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ successMessage }}
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="error" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ error }}
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { processRefund as apiProcessRefund } from '../mock/mockApi.js'

const store = useAppStore()

// 搜尋面板摺疊狀態（預設關閉）
const searchPanelOpen = ref(false)

// 切換搜尋面板
function toggleSearchPanel() {
  searchPanelOpen.value = !searchPanelOpen.value
}

const queryForm = ref({
  documentNumber: '',
  applicantName: ''
})

const searchResults = ref([])
const hasSearched = ref(false)
const loading = ref(false)
const refunding = ref(false)
const error = ref('')
const successMessage = ref('')
const selectedRefundDocument = ref(null)

// 計算可退費的單據清單
const refundableDocuments = computed(() => {
  return store.documents.filter(doc => doc.status === '已核銷')
})

function queryDocument() {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  hasSearched.value = true
  
  // 建立搜尋條件 - 只對可退費單據搜尋
  let filteredDocuments = store.documents.filter(doc => doc.status === '已核銷')
  
  // 單據編號搜尋
  if (queryForm.value.documentNumber.trim()) {
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.number.toLowerCase().includes(queryForm.value.documentNumber.trim().toLowerCase())
    )
  }
  
  // 申請人搜尋
  if (queryForm.value.applicantName.trim()) {
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.applicantName.toLowerCase().includes(queryForm.value.applicantName.trim().toLowerCase())
    )
  }
  
  setTimeout(() => {
    searchResults.value = filteredDocuments
    if (filteredDocuments.length === 0 && hasSearched.value) {
      error.value = ''
    }
    loading.value = false
  }, 500)
}

// 重設搜尋條件
function resetSearch() {
  queryForm.value = {
    documentNumber: '',
    applicantName: ''
  }
  searchResults.value = []
  hasSearched.value = false
  error.value = ''
  successMessage.value = ''
}

async function processRefund() {
  // 綜合檢查所有不可退費的狀態
  if (queriedDocument.value.status !== '已核銷') {
    let errorMsg = ''
    
    switch (queriedDocument.value.status) {
      case '未核銷':
        errorMsg = '未核銷單據無法退費，請先完成核銷作業'
        break
      case '已作廢':
        errorMsg = '已作廢單據無法執行退費作業'
        break
      case '已退費':
        errorMsg = '此單據已完成退費，無法重複退費'
        break
      default:
        errorMsg = `單據狀態「${queriedDocument.value.status}」無法執行退費作業`
    }
    
    error.value = errorMsg
    setTimeout(() => {
      error.value = ''
    }, 5000)
    return
  }

  refunding.value = true
  error.value = '' // 清除之前的錯誤訊息
  
  try {
    const result = await apiProcessRefund(queriedDocument.value.number)
    
    // 更新單據狀態為已退費
    store.updateDocumentStatus(queriedDocument.value.id, '已退費')
    queriedDocument.value.status = '已退費'
    
    successMessage.value = result.message
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
    
  } catch (err) {
    error.value = err.message
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    refunding.value = false
  }
}

// 從清單選擇單據進行退費
async function selectDocumentForRefund(document) {
  selectedRefundDocument.value = document
  refunding.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const result = await apiProcessRefund(document.number)
    
    // 更新單據狀態為已退費
    store.updateDocumentStatus(document.id, '已退費')
    
    successMessage.value = `單據 ${document.number} 退費成功`
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
    
  } catch (err) {
    error.value = err.message
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    refunding.value = false
    selectedRefundDocument.value = null
  }
}

function getStatusType(status) {
  const statusTypes = {
    '未核銷': 'warning',
    '已核銷': 'success',
    '已退費': 'info',
    '已作廢': 'danger'
  }
  return statusTypes[status] || 'default'
}
</script>