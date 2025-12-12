<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl p-6 min-w-[300px]">
      <div class="flex flex-col items-center">
        <!-- 旋轉動畫 -->
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        
        <!-- 載入文字 -->
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
        <p v-if="message" class="text-sm text-gray-600 text-center">{{ message }}</p>
        
        <!-- 進度條 (可選) -->
        <div v-if="showProgress" class="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out" 
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <div v-if="showProgress" class="text-xs text-gray-500 mt-2">{{ Math.round(progress) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '處理中...'
  },
  message: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>