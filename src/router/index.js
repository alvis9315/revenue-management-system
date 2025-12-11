import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'

// Views
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import DocumentCreateView from '../views/DocumentCreateView.vue'
import DocumentListView from '../views/DocumentListView.vue'
import ReconciliationImportView from '../views/ReconciliationImportView.vue'
import ExceptionListView from '../views/ExceptionListView.vue'
import RefundView from '../views/RefundView.vue'
import BatchStatusView from '../views/BatchStatusView.vue'
import UserManagementView from '../views/UserManagementView.vue'

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
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: '儀表板' }
  },
  {
    path: '/documents/create',
    name: 'DocumentCreate',
    component: DocumentCreateView,
    meta: { requiresAuth: true, title: '單據開立' }
  },
  {
    path: '/documents/list',
    name: 'DocumentList',
    component: DocumentListView,
    meta: { requiresAuth: true, title: '單據查詢與管理' }
  },
  {
    path: '/reconciliation/import',
    name: 'ReconciliationImport',
    component: ReconciliationImportView,
    meta: { requiresAuth: true, title: '核銷匯入' }
  },
  {
    path: '/exceptions',
    name: 'ExceptionList',
    component: ExceptionListView,
    meta: { requiresAuth: true, title: '異常清單' }
  },
  {
    path: '/refund',
    name: 'Refund',
    component: RefundView,
    meta: { requiresAuth: true, title: '退費作業' }
  },
  {
    path: '/batch-status',
    name: 'BatchStatus',
    component: BatchStatusView,
    meta: { requiresAuth: true, title: '批次作業狀態' }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true, title: '使用者管理' }
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
  } else {
    next()
  }
})

export default router