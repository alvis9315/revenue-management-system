<template>
  <div class="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
    <!-- Tab 頭部 -->
    <div class="bg-gray-100 border-b border-gray-300">
      <nav class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 px-2 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 border-r border-gray-300 last:border-r-0"
          :class="[
            activeTab === tab.key
              ? 'bg-white text-gray-900 font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-150 hover:text-gray-800'
          ]"
        >
          <!-- 小螢幕：垂直佈局 -->
          <div class="flex flex-col items-center sm:hidden">
            <!-- 圖標和文字 -->
            <div class="flex items-center justify-center mb-1">
              <Icon v-if="tab.iconifyIcon" :icon="tab.iconifyIcon" class="w-4 h-4 mr-1" />
              <component v-else-if="tab.icon" :is="tab.icon" class="w-4 h-4 mr-1" />
              <svg v-else-if="tab.iconPath" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.iconPath" />
              </svg>
              <span class="text-xs">{{ tab.title }}</span>
            </div>
            <!-- 數量標籤 -->
            <span v-if="tab.count !== undefined" class="px-2 py-0.5 text-xs font-bold rounded"
              :class="[
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </div>
          
          <!-- 桌面版：水平佈局 -->
          <div class="hidden sm:flex items-center justify-center">
            <Icon v-if="tab.iconifyIcon" :icon="tab.iconifyIcon" class="w-4 h-4 mr-2" />
            <component v-else-if="tab.icon" :is="tab.icon" class="w-4 h-4 mr-2" />
            <svg v-else-if="tab.iconPath" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.iconPath" />
            </svg>
            <span>{{ tab.title }}</span>
            <span v-if="tab.count !== undefined" class="ml-2 px-2 py-1 text-xs font-bold rounded"
              :class="[
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </div>
        </button>
      </nav>
    </div>
    
    <!-- Tab 內容 -->
    <div class="tab-content bg-white p-3 sm:p-6">
      <slot :name="'tab-' + activeTab" :activeTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  defaultTab: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'tab-change'])

// 設置初始活躍 Tab
const activeTab = ref(props.modelValue || props.defaultTab || (props.tabs.length > 0 ? props.tabs[0].key : ''))

// 監聽外部 v-model 變化
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal !== activeTab.value) {
    activeTab.value = newVal
  }
})

// 監聽內部 activeTab 變化
watch(activeTab, (newTab, oldTab) => {
  emit('update:modelValue', newTab)
  emit('tab-change', newTab, oldTab)
})
</script>

<style scoped>
.tab-content {
  min-height: 200px;
}
</style>