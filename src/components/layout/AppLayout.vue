<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 頂部標題列 -->
    <header class="bg-primary-1000 text-white shadow-lg sticky top-0 z-40">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold">歲入款項暨單據管理系統</h1>
            <p class="text-sm text-primary-200">米樂睞資訊 MillerLight Info</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-xl font-bold">歡迎，{{ store.currentUser?.username || '用戶' }}</span>
            
            <!-- 頭像下拉選單 -->
            <div class="relative" @click.stop>
              <button 
                @click="toggleUserMenu" 
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-1000 transition-colors"
                :class="{ 'bg-primary-900': isUserMenuOpen }"
              >
                <!-- 頭像 -->
                <div class="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-semibold text-sm">
                  {{ getUserInitial() }}
                </div>
              </button>
              
              <!-- 下拉選單 -->
              <div 
                v-if="isUserMenuOpen" 
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <!-- 用戶資訊區塊 -->
                <div class="px-4 py-3 border-b border-gray-100">
                  <div class="text-lg font-medium text-gray-900">{{ store.currentUser?.username || '用戶' }}</div>
                  <div class="text-lg text-gray-500">{{ store.currentUser?.role || '業者' }}</div>
                </div>
                
                <!-- 選單項目 -->
                <button 
                  @click="openUserSettings" 
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <span class="material-icons-round text-gray-500">⚙️</span>
                  <span>個人設定</span>
                </button>
                
                <button 
                  @click="handleLogout" 
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <span class="material-icons-round text-red-500">🚪</span>
                  <span>登出</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要內容區域 -->
    <div class="flex flex-1 relative">
      <!-- 左側選單 -->
      <nav :class="['bg-white shadow-lg fixed left-0 top-0 bottom-0 z-30 overflow-hidden', 
                    isMenuCollapsed ? 'w-20' : 'w-64',
                    enableTransition ? 'transition-all duration-500 ease-in-out' : '']" 
           :style="{ top: headerHeight + 'px' }">
        <div class="p-4">
          <!-- 折疊按鈕 -->
          <div :class="['mb-4', isMenuCollapsed ? 'flex justify-center' : 'flex justify-end']">
            <button 
              @click.stop="toggleMenu"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-3 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              <!-- 展開時顯示左箭頭 -->
              <svg v-if="!isMenuCollapsed" class="w-5 h-5 transition-all duration-500 ease-in-out transform" :class="enableTransition ? 'rotate-0' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <!-- 折疊時顯示漢堡圖示 -->
              <svg v-else class="w-5 h-5 transition-all duration-500 ease-in-out transform" :class="enableTransition ? 'rotate-0' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <ul class="space-y-2">
            <!-- 儀表板 - 所有角色都可訪問 -->
            <li v-if="currentPermissions.dashboard">
              <router-link
                @click.stop
                to="/dashboard"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/dashboard' }
                ]"
                :title="isMenuCollapsed ? '儀表板' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-12 group-hover:text-primary-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">📊</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">儀表板</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  儀表板
                </div>
              </router-link>
            </li>
            
            <!-- 單據開立 - 僅承辦人 -->
            <li v-if="currentPermissions.documentCreate">
              <router-link
                @click.stop
                to="/documents/create"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/documents/create' }
                ]"
                :title="isMenuCollapsed ? '單據開立' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:-rotate-12 group-hover:text-primary-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">📝</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">單據開立</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  單據開立
                </div>
              </router-link>
            </li>
            
            <!-- 單據管理 -->
            <li v-if="currentPermissions.documentList">
              <router-link
                @click.stop
                to="/documents/list"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/documents/list' }
                ]"
                :title="isMenuCollapsed ? '單據管理' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-6 group-hover:text-primary-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">📋</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">單據管理</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  單據管理
                </div>
              </router-link>
            </li>
            
            <!-- 核銷匯入 - 僅承辦人 -->
            <li v-if="currentPermissions.reconciliationImport">
              <router-link
                @click.stop
                to="/reconciliation/import"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/reconciliation/import' }
                ]"
                :title="isMenuCollapsed ? '核銷匯入' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:-rotate-6 group-hover:text-primary-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">📥</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">核銷匯入</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  核銷匯入
                </div>
              </router-link>
            </li>
            
            <!-- 異常清單 -->
            <li v-if="currentPermissions.exceptions">
              <router-link
                @click.stop
                to="/exceptions"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/exceptions' }
                ]"
                :title="isMenuCollapsed ? '異常清單' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-12 group-hover:text-red-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">⚠️</span>
                <div class="flex items-center transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">
                  <span>異常清單</span>
                  <span v-if="store.documentStats.exceptions > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {{ store.documentStats.exceptions }}
                  </span>
                </div>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  異常清單 {{ store.documentStats.exceptions > 0 ? `(${store.documentStats.exceptions})` : '' }}
                </div>
              </router-link>
            </li>
            
            <!-- 退費作業 -->
            <li v-if="currentPermissions.refund">
              <router-link
                @click.stop
                to="/refund"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/refund' }
                ]"
                :title="isMenuCollapsed ? '退費作業' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:-rotate-12 group-hover:text-green-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">💰</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">退費作業</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  退費作業
                </div>
              </router-link>
            </li>
            
            <!-- 批次作業狀態 -->
            <li v-if="currentPermissions.batchStatus">
              <router-link
                @click.stop
                to="/batch-status"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/batch-status' }
                ]"
                :title="isMenuCollapsed ? '批次作業狀態' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-180 group-hover:text-blue-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">⚙️</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">批次作業狀態</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  批次作業狀態
                </div>
              </router-link>
            </li>
            
            <!-- 使用者管理 - 僅稽核人員 -->
            <li v-if="currentPermissions.userManagement">
              <router-link
                @click.stop
                to="/users"
                :class="[
                  'flex items-center py-3 text-slate-700 font-semibold text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group',
                  isMenuCollapsed ? 'justify-center px-2' : 'px-4',
                  { 'bg-primary-50 text-primary-800 border-l-4 border-primary-500': $route.path === '/users' }
                ]"
                :title="isMenuCollapsed ? '使用者管理' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-110 hover:rotate-6 group-hover:text-purple-600" :class="isMenuCollapsed ? 'mr-0' : 'mr-3'">👥</span>
                <span class="transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">使用者管理</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  使用者管理
                </div>
              </router-link>
            </li>
          </ul>
          
            <!-- 角色資訊顯示 -->
            <!-- <div class="mt-8 p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600">當前角色</div>
              <div class="text-sm font-medium text-gray-800">{{ store.currentUser?.role || '業者' }}</div>
            </div> -->
        </div>
      </nav>

      <!-- 主要內容區 -->
      <main class="flex-1 overflow-y-auto bg-gray-50" 
            :class="enableTransition ? 'transition-all duration-500 ease-in-out' : ''"
            :style="{ marginLeft: isMenuCollapsed ? '5rem' : '16rem' }">
        <div class="p-4 md:p-6 lg:p-8">
          <div class="mx-auto">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/useAppStore.js'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'

const store = useAppStore()
const router = useRouter()

// 計算頂部標題列高度（大約）
const headerHeight = ref(80)

// 用戶選單狀態
const isUserMenuOpen = ref(false)
// 側邊選單摺疊狀態 - 立即從 localStorage 讀取
const isMenuCollapsed = ref(localStorage.getItem('menuCollapsed') === 'true')
// 控制 transition 動畫
const enableTransition = ref(false)

// 基於角色的選單許可權配置
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

// 獲取用戶姓名首字母
function getUserInitial() {
  const username = store.currentUser?.username || '用戶'
  return username.charAt(0).toUpperCase()
}

// 切換用戶選單
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 切換側邊選單摺疊
function toggleMenu() {
  isMenuCollapsed.value = !isMenuCollapsed.value
  // 保存狀態到 localStorage
  localStorage.setItem('menuCollapsed', isMenuCollapsed.value.toString())
}

// 打開個人設定
function openUserSettings() {
  isUserMenuOpen.value = false
  // TODO: 實現個人設定頁面
  alert('個人設定功能開發中...')
}

// 登出功能
function handleLogout() {
  isUserMenuOpen.value = false
  store.logout()
  router.push('/login')
}

// 點擊外部關閉選單
function handleClickOutside(event) {
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// 監聽點擊事件
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // 延遲啟用 transition，避免初始渲染時的動畫閃爍
  await nextTick()
  setTimeout(() => {
    enableTransition.value = true
  }, 500)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>