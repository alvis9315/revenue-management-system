<template>
  <AppLayout>
    <div class="space-y-4 sm:space-y-6">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800">異常清單</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-1">處理匯入後的異常案例</p>
      </div>

      <BaseCard title="異常記錄">
        <div v-if="store.exceptionRecords.length > 0">
          <!-- 桌面版：表格 -->
          <div class="hidden sm:block">
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

          <!-- 手機版：卡片 -->
          <div class="sm:hidden space-y-3">
            <div 
              v-for="(record, index) in store.exceptionRecords" 
              :key="index"
              class="bg-white border rounded-lg p-4 shadow-sm"
              :class="{
                'border-l-4 border-l-yellow-500': record.type === 'amount_mismatch',
                'border-l-4 border-l-red-500': record.type !== 'amount_mismatch'
              }"
            >
              <div class="space-y-3">
                <!-- 標題區：類型標籤 + 操作按鈕 -->
                <div class="flex justify-between items-start">
                  <BaseTag
                    :text="record.type === 'amount_mismatch' ? '金額不符' : '找不到單據'"
                    :type="record.type === 'amount_mismatch' ? 'warning' : 'danger'"
                  />
                  <button
                    @click="markAsProcessed(index)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium rounded-md"
                  >
                    <Icon icon="heroicons:check" class="w-3 h-3 mr-1" />
                    已處理
                  </button>
                </div>

                <!-- 單據編號 -->
                <div>
                  <div class="text-xs text-gray-500 mb-1">單據編號</div>
                  <div class="font-medium text-gray-900">{{ record.documentNumber }}</div>
                </div>

                <!-- 金額資訊 -->
                <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <div class="text-xs text-gray-500 mb-1">銀行金額</div>
                    <div class="text-gray-900 font-semibold">${{ record.bankAmount.toLocaleString() }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500 mb-1">系統金額</div>
                    <div class="text-gray-900 font-semibold">
                      <span v-if="record.systemAmount">${{ record.systemAmount.toLocaleString() }}</span>
                      <span v-else class="text-gray-400">-</span>
                    </div>
                  </div>
                </div>

                <!-- 異常原因 -->
                <div class="bg-gray-50 rounded-md p-3">
                  <div class="text-xs text-gray-600 mb-1">異常原因</div>
                  <div class="text-sm text-gray-800">{{ record.reason }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          目前沒有異常記錄
        </div>
      </BaseCard>
    </div>

    <!-- 處理確認對話框 -->
    <BaseConfirmDialog
      :show="confirmDialog.show"
      title="確認處理異常記錄"
      :message="confirmDialog.record ? `確定將異常記錄「${confirmDialog.record.documentNumber}」標記為已處理？\n\n處理後將從清單中移除此筆記錄。` : ''"
      confirmText="確定處理"
      cancelText="取消"
      type="success"
      confirm-button-variant="success"
      @confirm="handleProcessConfirm"
      @cancel="handleProcessCancel"
      @close="handleProcessCancel"
    />
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseTag from '../components/common/BaseTag.vue'
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
import { useAppStore } from '../stores/useAppStore.js'

const store = useAppStore()
const toast = useToast()

// 確認對話框狀態
const confirmDialog = ref({
  show: false,
  record: null,
  index: null
})

const exceptionColumns = [
  { key: 'type', title: '異常類型' },
  { key: 'documentNumber', title: '單據編號' },
  { key: 'bankAmount', title: '銀行金額' },
  { key: 'systemAmount', title: '系統金額' },
  { key: 'reason', title: '異常原因' }
]

const markAsProcessed = (index) => {
  const record = store.exceptionRecords[index]
  confirmDialog.value = {
    show: true,
    record: record,
    index: index
  }
}

const handleProcessConfirm = () => {
  if (confirmDialog.value.record && confirmDialog.value.index !== null) {
    store.removeExceptionRecord(confirmDialog.value.index)
    toast.success(`異常記錄「${confirmDialog.value.record.documentNumber}」已標記為已處理`)
  }
  confirmDialog.value = { show: false, record: null, index: null }
}

const handleProcessCancel = () => {
  confirmDialog.value = { show: false, record: null, index: null }
}
</script>