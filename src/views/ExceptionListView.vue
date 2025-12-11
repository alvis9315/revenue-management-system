<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">異常清單</h2>
        <p class="text-gray-600 mt-1">處理匯入後的異常案例</p>
      </div>

      <BaseCard title="異常記錄">
        <div v-if="store.exceptionRecords.length > 0">
          <BaseTable
            :columns="exceptionColumns"
            :data="store.exceptionRecords"
            :show-actions="true"
          >
            <template #type="{ value }">
              <BaseTag
                :text="value === 'amount_mismatch' ? '金額不符' : '找不到單據'"
                :type="value === 'amount_mismatch' ? 'warning' : 'danger'"
              />
            </template>
            
            <template #bankAmount="{ value }">
              ${{ value.toLocaleString() }}
            </template>
            
            <template #systemAmount="{ value }">
              <span v-if="value">{{ value.toLocaleString() }}</span>
              <span v-else class="text-gray-400">-</span>
            </template>

            <template #actions="{ row, index }">
              <button
                @click="markAsProcessed(index)"
                class="btn-primary text-sm"
              >
                標記已處理
              </button>
            </template>
          </BaseTable>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          目前沒有異常記錄
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()

const exceptionColumns = [
  { key: 'type', title: '異常類型' },
  { key: 'documentNumber', title: '單據編號' },
  { key: 'bankAmount', title: '銀行金額' },
  { key: 'systemAmount', title: '系統金額' },
  { key: 'reason', title: '異常原因' }
]

function markAsProcessed(index) {
  const record = store.exceptionRecords[index]
  if (confirm(`確定將異常記錄「${record.documentNumber}」標記為已處理？`)) {
    store.removeExceptionRecord(index)
  }
}
</script>