<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- 頁面標題 -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800">儀表板</h2>
        <p class="text-gray-600 mt-1">歲入款項暨單據管理系統概覽</p>
      </div>

      <!-- 統計卡片 -->
      <div class="flex flex-wrap gap-6">
        <!-- 今日核銷筆數 - 承辦人和稽核人員可見 -->
        <div v-if="currentPermissions.reconciliationImport || store.currentUser?.role === '稽核人員'" class="card border-l-4 border-l-accent-950 flex-1 min-w-[280px]">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                  <span class="text-accent-800">📊</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">今日核銷筆數</p>
                <p class="text-2xl font-bold text-slate-800">{{ mockDashboardStats.todayReconciled }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 異常筆數 - 承辦人和稽核人員可見 -->
        <div v-if="currentPermissions.exceptions" class="card border-l-4 border-l-red-500 flex-1 min-w-[280px]">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span class="text-red-800">⚠️</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">異常筆數</p>
                <p class="text-2xl font-bold text-slate-800">{{ store.documentStats.exceptions }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 累計已核銷金額 -->
        <div class="card border-l-4 border-l-green-500 flex-1 min-w-[280px]">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span class="text-green-800">💰</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ store.currentUser?.role === '業者' ? '我的已核銷金額' : '累計已核銷金額' }}
                </p>
                <p class="text-2xl font-bold text-slate-800">${{ store.documentStats.totalAmount.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 總單據數 -->
        <div class="card border-l-4 border-l-blue-500 flex-1 min-w-[280px]">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-800">📋</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ store.currentUser?.role === '業者' ? '我的單據數' : '總單據數' }}
                </p>
                <p class="text-2xl font-bold text-slate-800">{{ store.documentStats.total }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 單據狀態分佈 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard :title="store.currentUser?.role === '業者' ? '我的單據狀態分佈' : '單據狀態分佈'">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-700">已核銷</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-800">{{ store.documentStats.reconciled }}</span>
                <span class="text-sm text-gray-500 ml-1">筆</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-700">未核銷</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-800">{{ store.documentStats.pending }}</span>
                <span class="text-sm text-gray-500 ml-1">筆</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-700">已作廢</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-slate-800">{{ store.documentStats.cancelled }}</span>
                <span class="text-sm text-gray-500 ml-1">筆</span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 月度統計趨勢 - 稽核人員和承辦人可見完整資訊，業者看到簡化版 -->
        <BaseCard :title="store.currentUser?.role === '業者' ? '我的月度統計' : '月度統計趨勢'">
          <div class="space-y-3">
            <div
              v-for="stat in mockDashboardStats.monthlyStats.slice(0, 6)"
              :key="stat.month"
              class="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0"
            >
              <span class="text-sm text-gray-600">{{ stat.month }}</span>
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium text-slate-800">{{ stat.count }} 筆</span>
                <span v-if="store.currentUser?.role !== '業者'" class="text-sm text-gray-500">${{ stat.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- 快速操作 -->
      <BaseCard title="快速操作">
        <div class="flex flex-wrap gap-4">
          <!-- 單據開立 - 僅承辦人 -->
          <router-link 
            v-if="currentPermissions.documentCreate"
            to="/documents/create" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">📝</div>
            <p class="text-sm font-medium text-slate-700">單據開立</p>
          </router-link>
          
          <!-- 核銷匯入 - 僅承辦人 -->
          <router-link 
            v-if="currentPermissions.reconciliationImport"
            to="/reconciliation/import" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">📥</div>
            <p class="text-sm font-medium text-slate-700">核銷匯入</p>
          </router-link>
          
          <!-- 異常處理 - 僅承辦人和稽核人員 -->
          <router-link 
            v-if="currentPermissions.exceptions"
            to="/exceptions" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">⚠️</div>
            <p class="text-sm font-medium text-slate-700">異常處理</p>
          </router-link>
          
          <!-- 退費作業 - 承辦人和業者 -->
          <router-link 
            v-if="currentPermissions.refund"
            to="/refund" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">💰</div>
            <p class="text-sm font-medium text-slate-700">退費作業</p>
          </router-link>
          
          <!-- 單據管理 - 所有角色都可以訪問 -->
          <router-link 
            v-if="currentPermissions.documentList"
            to="/documents/list" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">📋</div>
            <p class="text-sm font-medium text-slate-700">單據管理</p>
          </router-link>
          
          <!-- 批次作業狀態 - 承辦人和稽核人員 -->
          <router-link 
            v-if="currentPermissions.batchStatus"
            to="/batch-status" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">⚙️</div>
            <p class="text-sm font-medium text-slate-700">批次作業狀態</p>
          </router-link>
          
          <!-- 使用者管理 - 僅稽核人員 -->
          <router-link 
            v-if="currentPermissions.userManagement"
            to="/users" 
            class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-[180px]"
          >
            <div class="text-2xl mb-2">👥</div>
            <p class="text-sm font-medium text-slate-700">使用者管理</p>
          </router-link>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import BaseCard from '../components/common/BaseCard.vue'
import { useAppStore } from '../stores/useAppStore.js'
import { mockDashboardStats, mockDocuments } from '../mock/mockData.js'

const store = useAppStore()

// 基於角色的選單許可權配置（與 AppLayout 保持一致）
const rolePermissions = {
  '承辦人': {
    dashboard: true,
    documentCreate: true,
    documentList: true,
    reconciliationImport: true,
    exceptions: true,
    refund: true,
    batchStatus: true,
    userManagement: false
  },
  '稽核人員': {
    dashboard: true,
    documentCreate: false,
    documentList: true,
    reconciliationImport: false,
    exceptions: true,
    refund: false,
    batchStatus: true,
    userManagement: true
  },
  '業者': {
    dashboard: true,
    documentCreate: false,
    documentList: true, // 僅自己的單據
    reconciliationImport: false,
    exceptions: false,
    refund: true, // 僅自己的退費
    batchStatus: false,
    userManagement: false
  }
}

// 獲取當前角色權限
const currentPermissions = computed(() => {
  const userRole = store.currentUser?.role || '業者'
  return rolePermissions[userRole] || rolePermissions['業者']
})

onMounted(() => {
  // 初始化假資料到 store
  if (store.documents.length === 0) {
    mockDocuments.forEach(doc => {
      store.documents.push(doc)
    })
  }
})
</script>