<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">核銷匯入</h2>
        <p class="text-gray-600 mt-1">匯入金融機構繳費明細進行核銷比對</p>
      </div>

      <!-- 匯入區塊 -->
      <BaseCard title="檔案匯入">
        <div class="space-y-4">
          <div>
            <label class="form-label">選擇匯入檔案</label>
            <input type="file" class="form-input" accept=".csv,.xlsx,.xls" />
          </div>
          <button @click="executeImport" :disabled="importing" class="btn-primary">
            {{ importing ? '匯入中...' : '執行匯入' }}
          </button>
        </div>
      </BaseCard>

      <!-- 匯入結果 -->
      <div v-if="importResult" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 成功紀錄 -->
        <BaseCard title="核銷成功">
          <div class="space-y-3">
            <div class="text-green-600 font-medium">成功筆數: {{ importResult.success.length }}</div>
            <div v-for="record in importResult.success" :key="record.importId" class="p-3 bg-green-50 rounded border">
              <div class="text-sm">
                <div>單據: {{ record.documentNumber }}</div>
                <div>金額: ${{ record.bankAmount.toLocaleString() }}</div>
                <div>日期: {{ record.depositDate }}</div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 金額不符 -->
        <BaseCard title="金額不符">
          <div class="space-y-3">
            <div class="text-yellow-600 font-medium">異常筆數: {{ importResult.amountMismatch.length }}</div>
            <div v-for="record in importResult.amountMismatch" :key="record.importId" class="p-3 bg-yellow-50 rounded border">
              <div class="text-sm">
                <div>單據: {{ record.documentNumber }}</div>
                <div>銀行金額: ${{ record.bankAmount.toLocaleString() }}</div>
                <div>系統金額: ${{ record.systemAmount.toLocaleString() }}</div>
                <div class="text-red-600">{{ record.reason }}</div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 找不到單據 -->
        <BaseCard title="找不到單據">
          <div class="space-y-3">
            <div class="text-red-600 font-medium">異常筆數: {{ importResult.documentNotFound.length }}</div>
            <div v-for="record in importResult.documentNotFound" :key="record.importId" class="p-3 bg-red-50 rounded border">
              <div class="text-sm">
                <div>單據: {{ record.documentNumber }}</div>
                <div>金額: ${{ record.bankAmount.toLocaleString() }}</div>
                <div class="text-red-600">{{ record.reason }}</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { importReconciliationFile } from '../mock/mockApi.js'

const store = useAppStore()
const importing = ref(false)
const importResult = ref(null)

async function executeImport() {
  importing.value = true
  try {
    const result = await importReconciliationFile()
    importResult.value = result
    
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
    
  } catch (error) {
    console.error('匯入失敗:', error)
  } finally {
    importing.value = false
  }
}
</script>