import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'

// Views
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import DashboardView from '../views/DashboardView.vue'
import DocumentListView from '../views/DocumentListView.vue'
import ReconciliationImportView from '../views/ReconciliationImportView.vue'
import ExceptionListView from '../views/ExceptionListView.vue'
import RefundView from '../views/RefundView.vue'
import BatchStatusView from '../views/BatchStatusView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import ProfileSettingsView from '../views/ProfileSettingsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: '儀表板', permissions: ['ALL'] }
  },
  {
    path: '/documents/create',
    name: 'DocumentCreate',
    redirect: '/documents/list' // 重定向到單據管理
  },
  {
    path: '/documents/list',
    name: 'DocumentList',
    component: DocumentListView,
    meta: { requiresAuth: true, title: '單據管理', permissions: ['ALL', 'VIEW_DOCS'] }
  },
  {
    path: '/reconciliation/import',
    name: 'ReconciliationImport',
    component: ReconciliationImportView,
    meta: { requiresAuth: true, title: '核銷匯入', permissions: ['ALL', 'VIEW_BATCH'] }
  },
  {
    path: '/exceptions',
    name: 'ExceptionList',
    component: ExceptionListView,
    meta: { requiresAuth: true, title: '異常清單', permissions: ['ALL', 'VIEW_AUDIT'] }
  },
  {
    path: '/refund',
    name: 'Refund',
    component: RefundView,
    meta: { requiresAuth: true, title: '退費作業', permissions: ['ALL', 'VIEW_DOCS'] }
  },
  {
    path: '/batch-status',
    name: 'BatchStatus',
    component: BatchStatusView,
    meta: { requiresAuth: true, title: '批次作業狀態', permissions: ['ALL', 'VIEW_BATCH'] }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true, title: '使用者管理', permissions: ['ALL'] }
  },
  {
    path: '/profile/settings',
    name: 'ProfileSettings',
    component: ProfileSettingsView,
    meta: { requiresAuth: true, title: '個人設定', permissions: ['ALL', 'VIEW_PROFILE'] }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const store = useAppStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && store.isLoggedIn) {
    next('/dashboard')
  } else if (to.meta.permissions && !store.currentUser.permissions.includes('ALL') && !to.meta.permissions.some(p => store.currentUser.permissions.includes(p))) {
    // 檢查權限
    next('/dashboard') // 無權限時重定向到儀表板
  } else {
    next()
  }
})

export default router