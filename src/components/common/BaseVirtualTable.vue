<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div class="overflow-auto" :style="{ height: height }">
      <!-- Header - sticky -->
      <div class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div class="grid text-xs font-medium text-gray-500 uppercase tracking-wider" :style="gridStyle">
          <div v-for="column in columns" :key="'header-' + column.key" class="px-6 py-3 text-left" :class="column.width === 'auto' ? 'whitespace-nowrap' : ''">
            {{ column.title }}
            <svg v-if="column.sortable" class="w-3 h-3 ml-1 text-gray-400 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Content - 使用 RecycleScroller，繼承相同的 grid template -->
      <div v-if="items.length > 0">
        <RecycleScroller
          :items="items"
          :item-size="itemHeight"
          :key-field="keyField"
          v-slot="{ item, index }"
        >
          <div 
            class="grid border-b border-gray-100 hover:bg-gray-50 transition-colors"
            :style="{ ...gridStyle, minHeight: itemHeight + 'px' }"
          >
            <div v-for="column in columns" :key="'cell-' + column.key" class="px-6 py-3 text-sm text-left flex items-center" :class="column.width === 'auto' ? 'whitespace-nowrap' : ''">
              <slot 
                :name="'cell-' + column.key" 
                :item="item" 
                :column="column" 
                :index="index"
              >
                {{ getNestedValue(item, column.key) }}
              </slot>
            </div>
          </div>
        </RecycleScroller>
      </div>
      
      <!-- 空狀態 -->
      <div v-else class="px-6 py-12 text-center">
        <div class="text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm">{{ emptyText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '500px'
  },
  itemHeight: {
    type: Number,
    default: 60
  },
  // getItemKey: {
  //   type: Function,
  //   default: null
  // },
  emptyText: {
    type: String,
    default: '暫無資料'
  }
})

// 計算 key field
const keyField = computed(() => {
  if (props.items.length === 0) return 'id'
  
  const firstItem = props.items[0]
  // 嘗試常見的 key 欄位
  const possibleKeys = ['id', 'importId', 'documentNumber', 'number', 'key']
  
  for (const key of possibleKeys) {
    if (key in firstItem) {
      return key
    }
  }
  
  // 如果都沒有，返回第一個屬性的 key
  return Object.keys(firstItem)[0] || 'id'
})

// 計算網格樣式
const gridStyle = computed(() => {
  const templateColumns = props.columns.map(col => {
    // 如果 width 為 'auto'，使用 min-content 讓欄位自適應內容寬度
    if (col.width === 'auto') {
      return 'min-content'
    }
    // 如果有指定固定寬度，使用該寬度
    if (col.width) {
      return col.width
    }
    // 否則使用 1fr 平均分配
    return '1fr'
  }).join(' ')
  return { gridTemplateColumns: templateColumns }
})

// 獲取嵌套值
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
</script>

<style scoped>
/* 確保 RecycleScroller 不影響佈局 */
.vue-recycle-scroller {
  height: auto !important;
}

.vue-recycle-scroller__item-wrapper {
  overflow: visible !important;
}
</style>
