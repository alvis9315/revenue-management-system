<template>
  <div class="form-group">
    <!-- Label -->
    <label 
      v-if="label" 
      :class="['form-label', required && 'form-label-required']"
      :for="inputId"
    >
      {{ label }}
    </label>
    
    <!-- 帶圖標的輸入框 -->
    <div v-if="icon" class="input-icon-wrapper">
      <Icon :icon="icon" class="input-icon w-5 h-5 mt-1" />
      
      <!-- Textarea -->
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :class="getInputClass(true)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
      />
      
      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="inputId"
        :value="modelValue"
        @change="handleInput"
        @blur="handleBlur"
        :class="getInputClass(true)"
        :required="required"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <slot name="options"></slot>
      </select>
      
      <!-- Input -->
      <input
        v-else
        class="mt-2"
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :type="type"
        :class="getInputClass(true)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :readonly="readonly"
      />
    </div>
    
    <!-- 無圖標的輸入框 -->
    <template v-else>
      <!-- Textarea -->
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :class="getInputClass()"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows"
      />
      
      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="inputId"
        :value="modelValue"
        @change="handleInput"
        @blur="handleBlur"
        :class="getInputClass()"
        :required="required"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <slot name="options"></slot>
      </select>
      
      <!-- Input -->
      <input
        v-else
        :id="inputId"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :type="type"
        :class="getInputClass()"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :readonly="readonly"
      />
    </template>
    
    <!-- Help Text -->
    <p v-if="helpText && !error && !success" class="form-help">
      {{ helpText }}
    </p>
    
    <!-- Error Message -->
    <p v-if="error" class="form-error">
      <Icon icon="heroicons:exclamation-circle" class="w-4 h-4 flex-shrink-0" />
      <span>{{ error }}</span>
    </p>
    
    <!-- Success Message -->
    <p v-if="success && successMessage" class="form-success">
      <Icon icon="heroicons:check-circle" class="w-4 h-4 flex-shrink-0" />
      <span>{{ successMessage }}</span>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { 
    type: String, 
    default: 'text'
  },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  icon: String,
  helpText: String,
  error: String,
  success: Boolean,
  successMessage: String,
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  rows: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// 生成唯一的 input ID
const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`
})

// 獲取輸入框樣式
const getInputClass = (hasIcon = false) => {
  const baseClass = hasIcon ? 'input-with-icon' : ''
  
  if (props.error) {
    return `form-input-error ${baseClass}`
  }
  
  if (props.success) {
    return `form-input-success ${baseClass}`
  }
  
  return `form-input ${baseClass}`
}

// 處理輸入事件
const handleInput = (event) => {
  const value = event.target.value
  
  // 如果是 number 類型，轉換為數字
  if (props.type === 'number' && value !== '') {
    emit('update:modelValue', Number(value))
  } else {
    emit('update:modelValue', value)
  }
}

// 處理失焦事件
const handleBlur = (event) => {
  emit('blur', event)
}
</script>

