import { mockBankRecords, mockDocuments } from './mockData.js'

// 模擬 API 延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模擬匯入核銷檔案
export async function importReconciliationFile() {
  await delay(1000) // 模擬處理時間
  
  const results = {
    success: [],
    amountMismatch: [],
    documentNotFound: []
  }
  
  mockBankRecords.forEach(record => {
    if (record.status === 'matched') {
      results.success.push({
        ...record,
        documentInfo: mockDocuments.find(doc => doc.number === record.documentNumber)
      })
    } else if (record.status === 'amount_mismatch') {
      const document = mockDocuments.find(doc => doc.number === record.documentNumber)
      results.amountMismatch.push({
        ...record,
        documentInfo: document,
        systemAmount: document?.amount || 0,
        reason: `銀行金額 ${record.bankAmount} 與系統金額 ${document?.amount || 0} 不符`
      })
    } else if (record.status === 'document_not_found') {
      results.documentNotFound.push({
        ...record,
        reason: `找不到單據編號 ${record.documentNumber}`
      })
    }
  })
  
  return results
}

// 模擬執行批次作業
export async function runBatchJob() {
  await delay(2000) // 模擬處理時間
  
  const now = new Date()
  const batchNumber = `BTH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  
  // 隨機決定是否為失敗狀態 (20% 機率失敗)
  const isFailed = Math.random() < 0.2
  
  if (isFailed) {
    // 失敗案例
    const totalCount = Math.floor(Math.random() * 100) + 20
    return {
      batchNumber,
      executeTime: now.toLocaleString('zh-TW'),
      totalCount,
      successCount: 0,
      failCount: totalCount,
      status: '失敗'
    }
  } else {
    // 成功案例
    const totalCount = Math.floor(Math.random() * 100) + 20
    const failCount = Math.floor(Math.random() * 5)
    const successCount = totalCount - failCount
    
    return {
      batchNumber,
      executeTime: now.toLocaleString('zh-TW'),
      totalCount,
      successCount,
      failCount,
      status: '已完成'
    }
  }
}

// 模擬查詢單據
export async function queryDocument(documentNumber) {
  await delay(500)
  
  const document = mockDocuments.find(doc => doc.number === documentNumber)
  if (!document) {
    throw new Error('找不到該單據')
  }
  
  return document
}

// 模擬退費作業
export async function processRefund(documentNumber) {
  await delay(800)
  
  const document = mockDocuments.find(doc => doc.number === documentNumber)
  if (!document) {
    throw new Error('找不到該單據')
  }
  
  if (document.status !== '已核銷') {
    throw new Error('只有已核銷的單據才能退費')
  }
  
  return {
    success: true,
    refundAmount: document.amount,
    refundDate: new Date().toISOString().split('T')[0],
    message: `單據 ${documentNumber} 退費成功，金額 $${document.amount.toLocaleString()}`
  }
}

// 模擬登入驗證
export async function authenticate(username, password, role) {
  await delay(800)
  
  // 簡單驗證邏輯
  if (username === 'demo' && password === 'demo') {
    return {
      success: true,
      user: {
        username,
        role,
        name: role === '承辦人' ? '系統承辦員' : role === '稽核人員' ? '稽核專員' : '業者代表'
      }
    }
  }
  
  return {
    success: false,
    message: '帳號或密碼錯誤'
  }
}