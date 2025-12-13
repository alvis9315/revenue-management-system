<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <!-- 表格頭部 -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="grid px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider" :style="gridStyle">
        <div v-for="column in columns" :key="column.key" class="flex items-center" :class="column.width === 'auto' ? 'whitespace-nowrap' : ''">
          {{ column.title }}
          <svg v-if="column.sortable" class="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 表格內容 - 虛擬滾動 -->
    <div class="overflow-auto" :style="{ height: height }">
      <div v-if="virtualEnabled && items.length > virtualThreshold" class="virtual-list-container">
        <div :style="{ height: totalHeight + 'px', position: 'relative' }">
          <div 
            v-for="(item, index) in visibleItems" 
            :key="getItemKey ? getItemKey(item) : index"
            class="grid border-b border-gray-100 hover:bg-gray-50 transition-colors"
            :style="{ 
              ...gridStyle, 
              position: 'absolute',
              top: getItemTop(startIndex + index) + 'px',
              left: 0,
              right: 0,
              height: itemHeight + 'px',
              minHeight: itemHeight + 'px'
            }"
          >
            <div v-for="column in columns" :key="column.key" class="px-6 py-3 text-sm flex items-start" :class="column.width === 'auto' ? 'whitespace-nowrap' : ''">
              <slot 
                :name="'cell-' + column.key" 
                :item="item" 
                :column="column" 
                :index="startIndex + index"
              >
                {{ getNestedValue(item, column.key) }}
              </slot>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 普通渲染 -->
      <div v-else>
        <div 
          v-for="(item, index) in items" 
          :key="getItemKey ? getItemKey(item) : index"
          class="grid border-b border-gray-100 hover:bg-gray-50 transition-colors"
          :style="{ ...gridStyle, minHeight: itemHeight + 'px' }"
        >
          <div v-for="column in columns" :key="column.key" class="px-6 py-3 text-sm flex items-start" :class="column.width === 'auto' ? 'whitespace-nowrap' : ''">
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
      </div>
    </div>
    
    <!-- 空狀態 -->
    <div v-if="items.length === 0" class="px-6 py-12 text-center">
      <div class="text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
    default: '400px'
  },
  virtualEnabled: {
    type: Boolean,
    default: true
  },
  virtualThreshold: {
    type: Number,
    default: 100
  },
  itemHeight: {
    type: Number,
    default: 60
  },
  getItemKey: {
    type: Function,
    default: null
  },
  emptyText: {
    type: String,
    default: '暫無資料'
  }
})

// 虛擬滾動相關
const scrollTop = ref(0)
const containerHeight = ref(400)

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

// 虛擬滾動計算
const totalHeight = computed(() => props.items.length * props.itemHeight)
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))
const endIndex = computed(() => Math.min(startIndex.value + Math.ceil(containerHeight.value / props.itemHeight) + 2, props.items.length))
const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value))

const getItemTop = (index) => index * props.itemHeight

// 滾動處理
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

// 獲取嵌套值
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

onMounted(() => {
  const container = document.querySelector('.virtual-list-container')?.parentElement
  if (container) {
    container.addEventListener('scroll', handleScroll)
    containerHeight.value = container.clientHeight
  }
})

onUnmounted(() => {
  const container = document.querySelector('.virtual-list-container')?.parentElement
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>