<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頂部標題列 -->
    <header class="bg-primary-1000 text-white shadow-lg">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold">歲入款項暨單據管理系統</h1>
            <p class="text-sm text-primary-200">米樂睞資訊 MillerLight Info</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm">歡迎，{{ store.currentUser?.role || '用戶' }}</span>
            <button @click="handleLogout" class="btn-secondary text-sm">
              登出
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- 左側選單 -->
      <nav class="w-64 bg-white shadow-lg min-h-screen">
        <div class="p-4">
          <ul class="space-y-2">
            <li>
              <router-link
                to="/dashboard"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/dashboard' }"
              >
                <span class="material-icons-round mr-3">📊</span>
                儀表板
              </router-link>
            </li>
            <li>
              <router-link
                to="/documents/create"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/documents/create' }"
              >
                <span class="material-icons-round mr-3">📝</span>
                單據開立
              </router-link>
            </li>
            <li>
              <router-link
                to="/documents/list"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/documents/list' }"
              >
                <span class="material-icons-round mr-3">📋</span>
                單據查詢與管理
              </router-link>
            </li>
            <li>
              <router-link
                to="/reconciliation/import"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/reconciliation/import' }"
              >
                <span class="material-icons-round mr-3">📥</span>
                核銷匯入
              </router-link>
            </li>
            <li>
              <router-link
                to="/exceptions"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/exceptions' }"
              >
                <span class="material-icons-round mr-3">⚠️</span>
                異常清單
                <span v-if="store.documentStats.exceptions > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {{ store.documentStats.exceptions }}
                </span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/refund"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/refund' }"
              >
                <span class="material-icons-round mr-3">💰</span>
                退費作業
              </router-link>
            </li>
            <li>
              <router-link
                to="/batch-status"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/batch-status' }"
              >
                <span class="material-icons-round mr-3">⚙️</span>
                批次作業狀態
              </router-link>
            </li>
            <li>
              <router-link
                to="/users"
                class="flex items-center px-4 py-3 text-slate-700 rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors"
                :class="{ 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/users' }"
              >
                <span class="material-icons-round mr-3">👥</span>
                使用者管理
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 主要內容區 -->
      <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/useAppStore.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

function handleLogout() {
  store.logout()
  router.push('/login')
}
</script>