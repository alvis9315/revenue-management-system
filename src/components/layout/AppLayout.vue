<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 頂部標題列 -->
    <header class="bg-primary-1000 text-white shadow-lg sticky top-0 z-40 flex-shrink-0">
      <div class="px-3 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <!-- 左側：標題 -->
          <div class="flex-1 min-w-0">
            <h1 class="text-sm sm:text-xl font-bold truncate">歲入款項暨單據管理系統</h1>
            <p class="text-xs sm:text-sm text-primary-200 hidden sm:block">米樂睞資訊 MillerLight Info</p>
          </div>
          
          <!-- 右側：用戶資訊 -->
          <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <span class="text-sm sm:text-xl font-bold hidden sm:inline">歡迎，{{ store.currentUser?.username || '用戶' }}</span>
            
            <!-- 頭像下拉選單 -->
            <div class="relative" @click.stop>
              <button 
                @click="toggleUserMenu" 
                class="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-primary-1000 transition-colors"
                :class="{ 'bg-primary-900': isUserMenuOpen }"
              >
                <!-- 頭像 -->
                <div class="w-7 h-7 sm:w-8 sm:h-8 bg-primary-200 rounded-full flex items-center justify-center text-primary-800 font-semibold text-xs sm:text-sm">
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
                  <div class="text-lg font-bold text-gray-900">{{ store.currentUser?.username || '用戶' }}</div>
                  <div class="text-sm text-gray-500">{{ store.currentUser?.role || '業者' }}</div>
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
    <div class="flex flex-1 overflow-hidden">
      <!-- 左側選單 - 小螢幕固定收合，大螢幕可展開/收合 -->
      <nav :class="['bg-white shadow-lg flex-shrink-0 z-30 overflow-y-auto transition-all duration-300 ease-in-out', 
                    'w-16 sm:w-20',
                    !isMobile && !isMenuCollapsed ? 'sm:w-64' : '']">
        <div class="p-2 sm:p-4">
          <!-- 折疊按鈕 - 小螢幕隱藏 -->
          <div :class="['mb-4 hidden sm:flex', isMenuCollapsed ? 'justify-center' : 'justify-end']">
            <button 
              @click.stop="toggleMenu"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-3 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              <!-- 展開時顯示左箭頭 -->
              <svg v-if="!isMenuCollapsed" class="w-5 h-5 transition-all duration-300 ease-in-out transform" :class="enableTransition ? 'rotate-0' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <!-- 折疊時顯示漢堡圖示 -->
              <svg v-else class="w-5 h-5 transition-all duration-300 ease-in-out transform" :class="enableTransition ? 'rotate-0' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  
                  $route.path === '/dashboard' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '儀表板' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 group-hover:text-primary-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">📊</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">儀表板</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
                  儀表板
                </div>
              </router-link>
            </li>
            
            <!-- 單據管理 -->
            <li v-if="currentPermissions.documentList">
              <router-link
                @click.stop
                to="/documents/list"
                :class="[
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/documents/list' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '單據管理' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-6 group-hover:text-primary-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">📋</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">單據管理</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/reconciliation/import' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '核銷匯入' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:-rotate-6 group-hover:text-primary-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">📥</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">核銷匯入</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/exceptions' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '異常清單' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 group-hover:text-red-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">⚠️</span>
                <div class="flex items-center transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:flex" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">
                  <span>異常清單</span>
                  <span v-if="store.documentStats.exceptions > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {{ store.documentStats.exceptions }}
                  </span>
                </div>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/refund' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '退費作業' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:-rotate-12 group-hover:text-green-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">💰</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">退費作業</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/batch-status' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '批次作業狀態' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-180 group-hover:text-blue-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">⚙️</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">批次作業狀態</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
                  'flex items-center py-2 sm:py-3 text-slate-700 font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-50 hover:text-primary-800 transition-colors relative group pl-2 sm:pl-3 pr-2',
                  $route.path === '/users' ? 'bg-primary-50 text-primary-800 border-l-4 border-primary-500' : ''
                ]"
                :title="isMenuCollapsed || isMobile ? '使用者管理' : ''"
              >
                <span class="material-icons-round flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-6 group-hover:text-purple-600 text-lg sm:text-xl" :class="isMenuCollapsed || isMobile ? 'mr-0' : 'sm:mr-3'">👥</span>
                <span class="transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden hidden sm:inline" :class="isMenuCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'">使用者管理</span>
                <!-- 折疊時的懸浮提示 -->
                <div :class="isMenuCollapsed || isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'" @click.stop class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap z-50">
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
            :class="enableTransition ? 'transition-all duration-300 ease-in-out' : ''">
        <div class="p-3 sm:p-4 md:p-6 lg:p-8">
          <div class="mx-auto">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Toast 組件 -->
    <BaseToast ref="toast" />
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/useAppStore.js'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import BaseToast from '../common/BaseToast.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

// 計算頂部標題列高度（大約）
const headerHeight = ref(80)

// 用戶選單狀態
const isUserMenuOpen = ref(false)

// 檢測螢幕尺寸
const isMobile = ref(window.innerWidth < 640)

// 側邊選單摺疊狀態 - 小螢幕預設收合
const getInitialCollapsedState = () => {
  // 小螢幕：預設收合
  if (window.innerWidth < 640) {
    return true
  }
  // 大螢幕：讀取 localStorage
  return localStorage.getItem('menuCollapsed') === 'true'
}

const isMenuCollapsed = ref(getInitialCollapsedState())
// 控制 transition 動畫
const enableTransition = ref(false)
// 控制圖標是否完全置中（動畫完成後）
const isFullyCollapsed = ref(getInitialCollapsedState())
// Toast 參考
const toast = ref(null)

// 基於角色的選單許可權配置
const rolePermissions = {
  '承辦人': {
    dashboard: true,
    documentCreate: false, // 不再需要單獨的開立頁面
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
const getUserInitial = () => {
  const username = store.currentUser?.username || '用戶'
  return username.charAt(0).toUpperCase()
}

// 切換用戶選單
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 切換側邊選單摺疊
const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value
  
  // 如果是展開，立即移除置中
  if (!isMenuCollapsed.value) {
    isFullyCollapsed.value = false
  } else {
    // 如果是收合，等動畫完成後再置中
    setTimeout(() => {
      // 確保菜單還是收合狀態才置中
      if (isMenuCollapsed.value) {
        isFullyCollapsed.value = true
      }
    }, 300) // 配合動畫時間 300ms
  }
  
  // 保存狀態到 localStorage
  localStorage.setItem('menuCollapsed', isMenuCollapsed.value.toString())
}

// 打開個人設定
const openUserSettings = () => {
  isUserMenuOpen.value = false
  router.push('/profile/settings')
}

// 登出功能
const handleLogout = () => {
  isUserMenuOpen.value = false
  store.logout()
  router.push('/login')
}

// 點擊外部關閉選單
const handleClickOutside = (event) => {
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// 處理視窗大小變化
const handleResize = () => {
  isMobile.value = window.innerWidth < 640
  
  // 小螢幕：自動收合選單
  if (isMobile.value && !isMenuCollapsed.value) {
    isMenuCollapsed.value = true
    isFullyCollapsed.value = true
  }
}

// 監聽點擊事件
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  
  // 延遲啟用 transition，避免初始渲染時的動畫閃爍
  await nextTick()
  setTimeout(() => {
    enableTransition.value = true
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 監聽路由變化，確保狀態正確
watch(route, () => {
  // 如果菜單是展開狀態，確保isFullyCollapsed為false
  if (!isMenuCollapsed.value) {
    isFullyCollapsed.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>