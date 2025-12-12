import { mockBankRecords, mockDocuments } from './mockData.js'

// 模擬 API 延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模擬匯入核銷檔案
export async function importReconciliationFile(file = null) {
  await delay(1000) // 模擬處理時間
  
  const results = {
    success: [],
    amountMismatch: [],
    documentNotFound: []
  }
  
  // 如果有實際檔案，解析檔案內容
  if (file) {
    try {
      const csvContent = await readFileContent(file)
      const parsedData = parseCSV(csvContent)
      
      // 處理每一筆資料
      parsedData.forEach((record, index) => {
        const importId = `import_${index + 1}_${Date.now()}`
        
        if (record.documentNumber.startsWith('DOC202401')) {
          // 正常單據，模擬核銷成功
          if (parseInt(record.documentNumber.slice(-3)) <= 800) {
            results.success.push({
              importId,
              documentNumber: record.documentNumber,
              bankAmount: parseInt(record.amount),
              depositDate: record.date,
              remarks: record.remarks
            })
          } else {
            // 金額不符的情況
            const systemAmount = parseInt(record.amount) + Math.floor(Math.random() * 1000) - 500
            results.amountMismatch.push({
              importId,
              documentNumber: record.documentNumber,
              bankAmount: parseInt(record.amount),
              systemAmount,
              depositDate: record.date,
              reason: `銀行金額 ${parseInt(record.amount)} 與系統金額 ${systemAmount} 不符`
            })
          }
        } else if (record.documentNumber.startsWith('NOTFOUND')) {
          // 找不到單據
          results.documentNotFound.push({
            importId,
            documentNumber: record.documentNumber,
            bankAmount: parseInt(record.amount),
            depositDate: record.date,
            reason: `系統中找不到單據編號 ${record.documentNumber}`
          })
        }
      })
      
      return results
    } catch (error) {
      console.error('檔案解析錯誤:', error)
      // 如果檔案解析失敗，回退到模擬資料
    }
  }
  
  // 沒有檔案或解析失敗時，使用原本的模擬邏輯
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

// 讀取檔案內容
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file, 'UTF-8')
  })
}

// 解析 CSV 內容
function parseCSV(csvContent) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
      if (values.length >= 4) {
        data.push({
          documentNumber: values[0],
          amount: values[1],
          date: values[2],
          remarks: values[3]
        })
      }
    }
  }
  
  return data
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