<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>