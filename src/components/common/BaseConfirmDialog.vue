<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleCancel"
    >
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- 對話框容器 -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-6 py-4 text-left shadow-xl transition-all w-full max-w-lg"
          @click.stop
        >
          <!-- 關閉按鈕 -->
          <button
            @click="handleCancel"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 標題 -->
          <div class="mb-4">
            <h3 class="text-lg font-medium leading-6 text-gray-900 pr-8">
              {{ title }}
            </h3>
          </div>

          <!-- 內容 -->
          <div class="mb-6">
            <div class="text-sm text-gray-500">
              <!-- 支援 slot 自定義內容 -->
              <slot>
                <p class="whitespace-pre-line">{{ message }}</p>
              </slot>
            </div>
          </div>

          <!-- 按鈕群組 -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:space-x-3 sm:justify-end">
            <button
              v-if="showCancel"
              @click="handleCancel"
              :class="cancelButtonClass"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="confirmButtonClass"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '確認操作'
  },
  message: {
    type: String,
    default: '您確定要執行此操作嗎？'
  },
  confirmText: {
    type: String,
    default: '確認'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info, success
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  confirmButtonVariant: {
    type: String,
    default: 'primary' // primary, danger, warning, success
  },
  showCancel: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

// 根據類型決定按鈕樣式
const confirmButtonClass = computed(() => {
  const baseClass = 'focus:ring-2 focus:ring-offset-2'
  
  switch (props.confirmButtonVariant) {
    case 'danger':
      return `${baseClass} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`
    case 'warning':
      return `${baseClass} bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500`
    case 'success':
      return `${baseClass} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`
    default: // primary
      return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`
  }
})

const cancelButtonClass = computed(() => {
  return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

// 支援 ESC 鍵關閉
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && props.show) {
    handleCancel()
  }
})
</script>

<style scoped>
/* 動畫效果 */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.transform {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>