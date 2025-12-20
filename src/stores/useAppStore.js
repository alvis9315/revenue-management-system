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
    const cancelled = documents.value.filter(doc => doc.status === '已作廢').length
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
    const login = (username, password) => {
    // 帳號對應的角色
      const accountRoles = {
        'operator': '承辦人',
        'auditor': '稽核人員', 
        'vendor': '業者',
        'admin': '系統管理員'
      }
    
    // 驗證帳號密碼
    if (password === '123' && accountRoles[username]) {
      const role = accountRoles[username]
      currentUser.value = { 
        username, 
        role,
        name: username,
        department: '財務處',
        email: '',
        phone: '',
        password: password
      }
      userRole.value = role

      // 系統管理員可存取所有功能
      if (role === '系統管理員') {
        currentUser.value.permissions = ['ALL']
      } else if (role === '承辦人') {
        currentUser.value.permissions = ['VIEW_DOCS', 'EDIT_DOCS', 'VIEW_BATCH', 'VIEW_PROFILE']
      } else if (role === '稽核人員') {
        currentUser.value.permissions = ['VIEW_DOCS', 'VIEW_AUDIT', 'VIEW_PROFILE']
      } else if (role === '業者') {
        currentUser.value.permissions = ['VIEW_DOCS', 'VIEW_PROFILE']
      }
      return true
    }
    return false
  }
  
  const logout = () => {
    currentUser.value = null
    userRole.value = ''
  }
  
  const updateUserProfile = (profileData) => {
    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        ...profileData
      }
    }
  }
  
  const updateUserPassword = (newPassword) => {
    if (currentUser.value) {
      currentUser.value.password = newPassword
    }
  }
  
  const addDocument = (document) => {
    const newDoc = {
      ...document,
      id: `DOC${String(documents.value.length + 1).padStart(4, '0')}`,
      status: '未核銷',
      createdAt: new Date().toISOString().split('T')[0]
    }
    documents.value.push(newDoc)
    return newDoc
  }
  
  const updateDocumentStatus = (id, status) => {
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      doc.status = status
    }
  }
  
  const updateDocument = (documentNumber, updatedData) => {
    const index = documents.value.findIndex(d => d.number === documentNumber)
    if (index !== -1) {
      // 保留原有的 id, status, createdAt，只更新可編輯的欄位
      documents.value[index] = {
        ...documents.value[index],
        ...updatedData,
        // 確保這些欄位不被覆蓋
        id: documents.value[index].id,
        status: documents.value[index].status,
        createdAt: documents.value[index].createdAt
      }
      return documents.value[index]
    }
    return null
  }
  
  const addBatchRecord = (record) => {
    const newRecord = {
      ...record,
      id: `BATCH${String(batchRecords.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    }
    batchRecords.value.push(newRecord)
    return newRecord
  }
  
  const addExceptionRecord = (record) => {
    exceptionRecords.value.push(record)
  }
  
  const removeExceptionRecord = (index) => {
    exceptionRecords.value.splice(index, 1)
  }
  
  const addUser = (user) => {
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
    updateUserProfile,
    updateUserPassword,
    addDocument,
    updateDocumentStatus,
    updateDocument,
    addBatchRecord,
    addExceptionRecord,
    removeExceptionRecord,
    addUser
  }
})