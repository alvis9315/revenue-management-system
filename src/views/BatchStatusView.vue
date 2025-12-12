<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">批次作業狀態</h2>
          <p class="text-gray-600 mt-1">監控系統批次作業執行狀態</p>
        </div>
        <button @click="runBatchJob" :disabled="running" class="btn-primary">
          {{ running ? '執行中...' : '執行過檔模擬' }}
        </button>
      </div>

      <BaseCard title="批次作業記錄">
        <BaseTable
          :columns="batchColumns"
          :data="store.batchRecords"
        >
          <template #status="{ value }">
            <span 
              class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium w-16"
              :class="getStatusClasses(value)"
            >
              {{ value }}
            </span>
          </template>
          
          <template #successRate="{ row }">
            <div class="flex items-center">
              <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  class="h-2 rounded-full"
                  :class="getSuccessRateClass(row)"
                  :style="{ width: getSuccessRate(row) + '%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-600">{{ getSuccessRate(row) }}%</span>
            </div>
          </template>
        </BaseTable>
      </BaseCard>
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
import { mockBatchRecords } from '../mock/mockData.js'
import { runBatchJob as apiRunBatchJob } from '../mock/mockApi.js'

const store = useAppStore()
const running = ref(false)

const batchColumns = [
  { key: 'batchNumber', title: '批次編號' },
  { key: 'executeTime', title: '執行時間' },
  { key: 'totalCount', title: '處理筆數' },
  { key: 'successCount', title: '成功筆數' },
  { key: 'failCount', title: '失敗筆數' },
  { key: 'status', title: '狀態' },
  { key: 'successRate', title: '成功率' }
]

async function runBatchJob() {
  running.value = true
  
  // 先加入一個執行中的記錄
  const tempRecord = {
    batchNumber: `BTH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    executeTime: new Date().toLocaleString('zh-TW'),
    totalCount: 0,
    successCount: 0,
    failCount: 0,
    status: '執行中'
  }
  
  store.addBatchRecord(tempRecord)
  
  try {
    const result = await apiRunBatchJob()
    
    // 更新最後一筆記錄
    const lastIndex = store.batchRecords.length - 1
    store.batchRecords[lastIndex] = {
      ...store.batchRecords[lastIndex],
      ...result
    }
    
  } catch (error) {
    console.error('批次作業失敗:', error)
  } finally {
    running.value = false
  }
}

function getStatusClasses(status) {
  const statusClasses = {
    '完成': 'bg-green-100 text-green-800',
    '已完成': 'bg-green-100 text-green-800',
    '執行中': 'bg-blue-100 text-blue-800',
    '失敗': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

function getSuccessRate(row) {
  if (row.totalCount === 0) return 0
  return Math.round((row.successCount / row.totalCount) * 100)
}

function getSuccessRateClass(row) {
  const rate = getSuccessRate(row)
  if (rate >= 95) return 'bg-green-500'
  if (rate >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

onMounted(() => {
  // 初始化假資料
  if (store.batchRecords.length === 0) {
    mockBatchRecords.forEach(record => {
      store.batchRecords.push(record)
    })
  }
})
</script>