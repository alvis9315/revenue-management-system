<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- 對話框容器 - RWD 響應式設計 -->
        <div class="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
          <div
            :class="[
              'relative flex flex-col rounded-lg bg-white text-left shadow-xl transition-all w-full',
              modalSizeClass,
              modalHeightClass
            ]"
            @click.stop
          >
            <!-- Header - 固定在頂部 -->
            <div 
              v-if="!hideHeader"
              class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0"
            >
              <div class="flex-1 min-w-0">
                <slot name="header">
                  <h3 class="text-xl sm:text-xl font-semibold text-gray-900 truncate">
                    {{ title }}
                  </h3>
                  <p v-if="subtitle" class="mt-1 text-xs sm:text-sm text-gray-500 truncate">
                    {{ subtitle }}
                  </p>
                </slot>
              </div>
              
              <!-- 關閉按鈕 -->
              <button
                v-if="showClose"
                @click="handleClose"
                type="button"
                class="ml-3 sm:ml-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100 flex-shrink-0"
              >
                <Icon icon="heroicons:x-mark" class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <!-- Body - 可滾動區域 -->
            <div 
              :class="[
                'px-4 sm:px-6 overflow-y-auto flex-1',
                bodyPaddingClass,
                bodyScrollClass
              ]"
            >
              <slot></slot>
            </div>

            <!-- Footer - 固定在底部 -->
            <div 
              v-if="!hideFooter"
              :class="[
                'flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0',
                footerJustifyClass
              ]"
            >
              <slot name="footer">
                <button
                  v-if="showCancel"
                  @click="handleCancel"
                  type="button"
                  class="btn-secondary inline-flex items-center justify-center w-full sm:w-auto"
                >
                  <Icon v-if="showCancelIcon && cancelIcon" :icon="cancelIcon" class="w-5 h-5 mr-1" />
                  {{ cancelText }}
                </button>
                <button
                  v-if="showConfirm"
                  @click="handleConfirm"
                  type="button"
                  :class="confirmButtonClass"
                  class="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
                  :disabled="confirmDisabled"
                >
                  <Icon v-if="showConfirmIcon && confirmIcon" :icon="confirmIcon" class="w-5 h-5 mr-1" />
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  // 顯示控制
  show: {
    type: Boolean,
    default: false
  },
  
  // 標題
  title: {
    type: String,
    default: ''
  },
  
  // 副標題
  subtitle: {
    type: String,
    default: ''
  },
  
  // Modal 大小
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl, 2xl, 3xl, full
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
  },
  
  // 是否顯示關閉按鈕
  showClose: {
    type: Boolean,
    default: true
  },
  
  // 點擊背景是否關閉
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  
  // ESC 鍵是否關閉
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  
  // 隱藏 header
  hideHeader: {
    type: Boolean,
    default: false
  },
  
  // 隱藏 footer
  hideFooter: {
    type: Boolean,
    default: false
  },
  
  // Body 內邊距
  bodyPadding: {
    type: String,
    default: 'normal', // none, sm, normal, lg
    validator: (value) => ['none', 'sm', 'normal', 'lg'].includes(value)
  },
  
  // Footer 對齊方式
  footerJustify: {
    type: String,
    default: 'end', // start, center, end, between
    validator: (value) => ['start', 'center', 'end', 'between'].includes(value)
  },
  
  // 預設按鈕控制
  showCancel: {
    type: Boolean,
    default: true
  },
  
  showConfirm: {
    type: Boolean,
    default: true
  },
  
  cancelText: {
    type: String,
    default: '取消'
  },
  
  confirmText: {
    type: String,
    default: '確認'
  },
  
  // Icon 控制
  showCancelIcon: {
    type: Boolean,
    default: false
  },
  
  showConfirmIcon: {
    type: Boolean,
    default: false
  },
  
  cancelIcon: {
    type: String,
    default: ''
  },
  
  confirmIcon: {
    type: String,
    default: ''
  },
  
  confirmVariant: {
    type: String,
    default: 'primary', // primary, danger, warning, success
    validator: (value) => ['primary', 'danger', 'warning', 'success'].includes(value)
  },
  
  confirmDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'close', 'confirm', 'cancel'])

// Modal 尺寸樣式 - RWD 響應式
const modalSizeClass = computed(() => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-[95vw]'
  }
  return sizes[props.size] || sizes.md
})

// Modal 高度限制 - 確保不超出視窗
const modalHeightClass = computed(() => {
  return 'max-h-[90vh] sm:max-h-[85vh]'
})

// Body 內邊距樣式
const bodyPaddingClass = computed(() => {
  const paddings = {
    none: 'py-0',
    sm: 'py-2 sm:py-3',
    normal: 'py-4 sm:py-5',
    lg: 'py-6 sm:py-8'
  }
  return paddings[props.bodyPadding] || paddings.normal
})

// Body 滾動樣式
const bodyScrollClass = computed(() => {
  return 'custom-scrollbar'
})

// Footer 對齊樣式
const footerJustifyClass = computed(() => {
  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }
  return justifies[props.footerJustify] || justifies.end
})

// 確認按鈕樣式
const confirmButtonClass = computed(() => {
  const baseClass = 'focus:ring-2 focus:ring-offset-2 shadow-sm'
  const disabled = props.confirmDisabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
  }
  
  return `${baseClass} ${variants[props.confirmVariant] || variants.primary} ${disabled}`
})

// 關閉處理
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

// ESC 鍵處理
const handleEscKey = (e) => {
  if (e.key === 'Escape' && props.show && props.closeOnEsc) {
    handleClose()
  }
}

// 監聽顯示狀態，處理 body 滾動
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Modal 動畫 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: translateY(-30px) scale(0.95);
  opacity: 0;
}

/* 自訂滾動條樣式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}

/* 移動端優化 */
@media (max-width: 640px) {
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
}
</style>

