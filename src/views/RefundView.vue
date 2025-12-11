<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">退費作業</h2>
        <p class="text-gray-600 mt-1">處理已核銷單據的退費申請</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 查詢區塊 -->
        <BaseCard title="單據查詢">
          <form @submit.prevent="queryDocument" class="space-y-4">
            <div>
              <label class="form-label">單據編號</label>
              <input
                v-model="queryForm.documentNumber"
                type="text"
                class="form-input"
                placeholder="請輸入單據編號"
                required
              />
            </div>
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? '查詢中...' : '查詢單據' }}
            </button>
          </form>

          <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {{ error }}
          </div>
        </BaseCard>

        <!-- 單據資訊 -->
        <BaseCard v-if="queriedDocument" title="單據資訊">
          <div class="space-y-3">
            <div><strong>單據編號:</strong> {{ queriedDocument.number }}</div>
            <div><strong>申請人:</strong> {{ queriedDocument.applicantName }}</div>
            <div><strong>單位:</strong> {{ queriedDocument.department }}</div>
            <div><strong>金額:</strong> ${{ queriedDocument.amount.toLocaleString() }}</div>
            <div><strong>付款方式:</strong> {{ queriedDocument.paymentMethod }}</div>
            <div><strong>狀態:</strong>
              <BaseTag :text="queriedDocument.status" :type="getStatusType(queriedDocument.status)" />
            </div>
            <div v-if="queriedDocument.notes"><strong>備註:</strong> {{ queriedDocument.notes }}</div>
          </div>

          <div class="mt-6">
            <button
              v-if="queriedDocument.status === '已核銷'"
              @click="processRefund"
              :disabled="refunding"
              class="btn-accent w-full"
            >
              {{ refunding ? '退費處理中...' : '執行退費' }}
            </button>
            <div v-else class="text-gray-500 text-center py-2">
              只有已核銷的單據才能退費
            </div>
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
import { ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { processRefund as apiProcessRefund } from '../mock/mockApi.js'

const store = useAppStore()

const queryForm = ref({
  documentNumber: ''
})

const queriedDocument = ref(null)
const loading = ref(false)
const refunding = ref(false)
const error = ref('')
const successMessage = ref('')

function queryDocument() {
  loading.value = true
  error.value = ''
  
  const document = store.documents.find(doc => doc.number === queryForm.value.documentNumber)
  
  setTimeout(() => {
    if (document) {
      queriedDocument.value = document
    } else {
      error.value = '找不到該單據編號'
    }
    loading.value = false
  }, 500)
}

async function processRefund() {
  refunding.value = true
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
  } finally {
    refunding.value = false
  }
}

function getStatusType(status) {
  const statusTypes = {
    '未核銷': 'warning',
    '已核銷': 'success',
    '已退費': 'info',
    '作廢': 'default'
  }
  return statusTypes[status] || 'default'
}
</script>