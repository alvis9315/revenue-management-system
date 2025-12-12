# BaseConfirmDialog 使用說明

## 概述
BaseConfirmDialog 是一個靈活的確認對話框組件，用於替代瀏覽器原生的 `confirm()` 函數，提供更好的用戶體驗和視覺設計。

## 功能特色
- 🎨 現代化的視覺設計
- 🔧 高度可配置和擴展
- 📱 響應式設計，支援手機和桌面
- ⌨️ 支援 ESC 鍵關閉
- 🎭 多種主題類型（warning, danger, info, success）
- 🔒 模態背景遮罩，防止誤操作
- ✨ 平滑的進入/退出動畫

## 基本用法

### 1. 引入組件
```javascript
import BaseConfirmDialog from '../components/common/BaseConfirmDialog.vue'
```

### 2. 註冊組件
```javascript
// 在 script setup 中無需額外註冊
```

### 3. 設置狀態變量
```javascript
const confirmDialog = ref({
  show: false,
  data: null // 可選：傳遞相關數據
})
```

### 4. 在模板中使用
```vue
<BaseConfirmDialog
  :show="confirmDialog.show"
  title="確認刪除"
  message="確定要刪除這個項目嗎？此操作無法撤銷。"
  confirmText="確認刪除"
  cancelText="取消"
  type="danger"
  confirm-button-variant="danger"
  @confirm="handleConfirm"
  @cancel="handleCancel"
  @close="handleCancel"
/>
```

### 5. 處理事件
```javascript
function showConfirmDialog(item) {
  confirmDialog.value = {
    show: true,
    data: item
  }
}

function handleConfirm() {
  // 執行確認操作
  console.log('用戶確認操作')
  confirmDialog.value = { show: false, data: null }
}

function handleCancel() {
  // 取消操作
  confirmDialog.value = { show: false, data: null }
}
```

## Props 屬性

| 屬性 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| `show` | Boolean | `false` | 控制對話框顯示/隱藏 |
| `title` | String | `'確認操作'` | 對話框標題 |
| `message` | String | `'您確定要執行此操作嗎？'` | 對話框內容訊息 |
| `confirmText` | String | `'確認'` | 確認按鈕文字 |
| `cancelText` | String | `'取消'` | 取消按鈕文字 |
| `type` | String | `'warning'` | 對話框類型：`warning`, `danger`, `info`, `success` |
| `confirmButtonVariant` | String | `'primary'` | 確認按鈕樣式：`primary`, `danger`, `warning`, `success` |

## 事件 Events

| 事件名 | 參數 | 說明 |
|--------|------|------|
| `@confirm` | 無 | 用戶點擊確認按鈕時觸發 |
| `@cancel` | 無 | 用戶點擊取消按鈕時觸發 |
| `@close` | 無 | 對話框關閉時觸發（點擊 X 或背景） |

## 插槽 Slots

### 默認插槽
可以使用插槽來自定義對話框內容：

```vue
<BaseConfirmDialog :show="confirmDialog.show" title="自定義內容">
  <div class="space-y-3">
    <p class="text-gray-600">這是自定義的內容區域</p>
    <ul class="list-disc list-inside text-sm text-gray-500">
      <li>項目 1 將被刪除</li>
      <li>相關數據將清除</li>
      <li>此操作不可撤銷</li>
    </ul>
  </div>
</BaseConfirmDialog>
```

## 樣式類型示例

### 1. 警告類型 (Warning)
```vue
<BaseConfirmDialog
  type="warning"
  confirm-button-variant="warning"
  title="警告操作"
  message="此操作可能會影響系統性能，確定要繼續嗎？"
/>
```

### 2. 危險類型 (Danger)
```vue
<BaseConfirmDialog
  type="danger"
  confirm-button-variant="danger"
  title="危險操作"
  message="此操作將永久刪除數據，無法復原！"
/>
```

### 3. 信息類型 (Info)
```vue
<BaseConfirmDialog
  type="info"
  confirm-button-variant="primary"
  title="確認信息"
  message="確定要保存這些變更嗎？"
/>
```

### 4. 成功類型 (Success)
```vue
<BaseConfirmDialog
  type="success"
  confirm-button-variant="success"
  title="完成操作"
  message="操作已準備完成，確定要提交嗎？"
/>
```

## 實際應用範例

### 刪除操作確認
```javascript
// 在組件中
const deleteDialog = ref({
  show: false,
  item: null
})

function confirmDelete(item) {
  deleteDialog.value = {
    show: true,
    item: item
  }
}

function handleDeleteConfirm() {
  if (deleteDialog.value.item) {
    // 執行刪除邏輯
    deleteItem(deleteDialog.value.item.id)
    toast.success('項目已刪除')
  }
  deleteDialog.value = { show: false, item: null }
}
```

### 批量操作確認
```javascript
const batchDialog = ref({
  show: false,
  items: []
})

function confirmBatchOperation(selectedItems) {
  batchDialog.value = {
    show: true,
    items: selectedItems
  }
}
```

## 最佳實踐

1. **明確的標題和訊息**：使用清晰、具體的標題和說明文字
2. **適當的按鈕文字**：確認按鈕應明確說明將要執行的操作
3. **正確的類型選擇**：根據操作的風險程度選擇合適的類型
4. **數據傳遞**：通過狀態變量傳遞相關數據，避免閉包問題
5. **錯誤處理**：在確認操作中加入適當的錯誤處理

## 與 Toast 結合使用

```javascript
function handleConfirm() {
  try {
    // 執行操作
    performOperation()
    toast.success('操作完成')
  } catch (error) {
    toast.error('操作失敗：' + error.message)
  } finally {
    confirmDialog.value = { show: false, data: null }
  }
}
```

這個組件已經在以下頁面中實現：
- 📄 DocumentListView.vue（單據作廢確認）
- 📝 DocumentCreateView.vue（單據作廢確認）
- 📊 ReconciliationImportView.vue（金額處理確認、建立單據確認）
- ⚠️ ExceptionListView.vue（異常處理確認）