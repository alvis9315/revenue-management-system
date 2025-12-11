import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 用戶狀態
  const currentUser = ref(null)
  const userRole = ref('')
  
  // 單據狀態
  const documents = ref([])
  const batchRecords = ref([])
  const exceptionRecords = ref([])
  const users = ref([])
  
  // 計算屬性
  const isLoggedIn = computed(() => currentUser.value !== null)
  const documentStats = computed(() => {
    const total = documents.value.length
    const reconciled = documents.value.filter(doc => doc.status === '已核銷').length
    const pending = documents.value.filter(doc => doc.status === '未核銷').length
    const cancelled = documents.value.filter(doc => doc.status === '作廢').length
    const exceptions = exceptionRecords.value.length
    
    return {
      total,
      reconciled,
      pending,
      cancelled,
      exceptions,
      totalAmount: documents.value.reduce((sum, doc) => sum + (doc.amount || 0), 0)
    }
  })
  
  // Actions
  function login(username, password, role) {
    // 簡單驗證
    if (username === 'demo' && password === 'demo') {
      currentUser.value = { username, role }
      userRole.value = role
      return true
    }
    return false
  }
  
  function logout() {
    currentUser.value = null
    userRole.value = ''
  }
  
  function addDocument(document) {
    const newDoc = {
      ...document,
      id: `DOC${String(documents.value.length + 1).padStart(4, '0')}`,
      status: '未核銷',
      createdAt: new Date().toISOString().split('T')[0]
    }
    documents.value.push(newDoc)
    return newDoc
  }
  
  function updateDocumentStatus(id, status) {
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.status = status
    }
  }
  
  function addBatchRecord(record) {
    const newRecord = {
      ...record,
      id: `BATCH${String(batchRecords.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    }
    batchRecords.value.push(newRecord)
    return newRecord
  }
  
  function addExceptionRecord(record) {
    exceptionRecords.value.push(record)
  }
  
  function removeExceptionRecord(index) {
    exceptionRecords.value.splice(index, 1)
  }
  
  function addUser(user) {
    const newUser = {
      ...user,
      id: `USER${String(users.value.length + 1).padStart(3, '0')}`,
      status: '啟用',
      createdAt: new Date().toISOString().split('T')[0]
    }
    users.value.push(newUser)
    return newUser
  }
  
  return {
    // State
    currentUser,
    userRole,
    documents,
    batchRecords,
    exceptionRecords,
    users,
    // Computed
    isLoggedIn,
    documentStats,
    // Actions
    login,
    logout,
    addDocument,
    updateDocumentStatus,
    addBatchRecord,
    addExceptionRecord,
    removeExceptionRecord,
    addUser
  }
})