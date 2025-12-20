<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white table-fixed">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.title }}
          </th>
          <th v-if="showActions" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto min-w-[200px] whitespace-nowrap">
            操作
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(row, index) in data" :key="index" class="hover:bg-gray-50">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 text-sm text-gray-900"
            :class="column.nowrap !== false ? 'whitespace-nowrap' : ''"
          >
            <slot :name="column.key" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="showActions" class="px-6 py-4 text-sm text-gray-500 w-auto min-w-[200px] whitespace-nowrap">
            <slot name="actions" :row="row" :index="index"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!data.length" class="text-center py-12 text-gray-500">
      暫無資料
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  showActions: {
    type: Boolean,
    default: false
  }
})
</script>