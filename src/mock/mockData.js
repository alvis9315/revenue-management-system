// 假資料
export const mockDocuments = [
  {
    id: 'DOC0001',
    number: 'RV202412001',
    applicantName: '張小明',
    department: '財務處',
    amount: 15000,
    paymentMethod: '轉帳',
    status: '已核銷',
    notes: '年終結算',
    createdAt: '2024-12-01'
  },
  {
    id: 'DOC0002',
    number: 'RV202412002',
    applicantName: '李美華',
    department: '人事處',
    amount: 8500,
    paymentMethod: '臨櫃',
    status: '未核銷',
    notes: '出差費用',
    createdAt: '2024-12-02'
  },
  {
    id: 'DOC0003',
    number: 'RV202412003',
    applicantName: '王大明',
    department: '研發部',
    amount: 25000,
    paymentMethod: '信用卡',
    status: '已核銷',
    notes: '設備採購',
    createdAt: '2024-12-03'
  },
  {
    id: 'DOC0004',
    number: 'RV202412004',
    applicantName: '陳小芳',
    department: '行政處',
    amount: 3200,
    paymentMethod: '轉帳',
    status: '已作廢',
    notes: '重複申請',
    createdAt: '2024-12-04'
  },
  {
    id: 'DOC0005',
    number: 'RV202412005',
    applicantName: '林志強',
    department: '業務部',
    amount: 12800,
    paymentMethod: '轉帳',
    status: '未核銷',
    notes: '客戶拜訪費',
    createdAt: '2024-12-05'
  }
]

// 匯入用銀行明細假資料
export const mockBankRecords = [
  {
    importId: 'IMP001',
    documentNumber: 'RV202412001',
    bankAmount: 15000,
    depositDate: '2024-12-08',
    status: 'matched'
  },
  {
    importId: 'IMP002',
    documentNumber: 'RV202412002',
    bankAmount: 8200, // 金額不符
    depositDate: '2024-12-08',
    status: 'amount_mismatch'
  },
  {
    importId: 'IMP003',
    documentNumber: 'RV202412999', // 找不到單據
    bankAmount: 5000,
    depositDate: '2024-12-08',
    status: 'document_not_found'
  },
  {
    importId: 'IMP004',
    documentNumber: 'RV202412003',
    bankAmount: 25000,
    depositDate: '2024-12-09',
    status: 'matched'
  }
]

// 批次作業歷史假資料
export const mockBatchRecords = [
  {
    id: 'BATCH001',
    batchNumber: 'BTH20241208001',
    executeTime: '2024-12-08 14:30:00',
    totalCount: 150,
    successCount: 145,
    failCount: 5,
    status: '已完成'
  },
  {
    id: 'BATCH002',
    batchNumber: 'BTH20241208002',
    executeTime: '2024-12-08 16:45:00',
    totalCount: 89,
    successCount: 89,
    failCount: 0,
    status: '已完成'
  },
  {
    id: 'BATCH003',
    batchNumber: 'BTH20241209001',
    executeTime: '2024-12-09 09:15:00',
    totalCount: 0,
    successCount: 0,
    failCount: 0,
    status: '執行中'
  },
  {
    id: 'BATCH004',
    batchNumber: 'BTH20241207001',
    executeTime: '2024-12-07 11:20:00',
    totalCount: 75,
    successCount: 0,
    failCount: 75,
    status: '失敗'
  }
]

// 使用者假資料
export const mockUsers = [
  {
    id: 'USER001',
    username: 'admin',
    name: '系統管理員',
    role: '承辦人',
    status: '啟用',
    createdAt: '2024-01-01'
  },
  {
    id: 'USER002',
    username: 'auditor1',
    name: '王稽核',
    role: '稽核人員',
    status: '啟用',
    createdAt: '2024-01-15'
  },
  {
    id: 'USER003',
    username: 'vendor1',
    name: '李業者',
    role: '業者',
    status: '啟用',
    createdAt: '2024-02-01'
  },
  {
    id: 'USER004',
    username: 'clerk1',
    name: '張承辦',
    role: '承辦人',
    status: '停用',
    createdAt: '2024-03-01'
  }
]

// 儀表板統計假資料
export const mockDashboardStats = {
  todayReconciled: 12,
  exceptionCount: 3,
  totalAmount: 128500,
  monthlyStats: [
    { month: '01月', count: 45, amount: 235000 },
    { month: '02月', count: 38, amount: 198000 },
    { month: '03月', count: 52, amount: 287000 },
    { month: '04月', count: 41, amount: 213000 },
    { month: '05月', count: 49, amount: 265000 },
    { month: '06月', count: 33, amount: 178000 }
  ]
}