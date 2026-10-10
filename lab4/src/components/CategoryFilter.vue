<script setup lang="ts">
import { CATEGORIES } from "../helpers";

defineProps<{ modelValue: string }>();
defineEmits<{ "update:modelValue": [code: string] }>();
</script>

<template>
  <div class="filter-row" role="group" aria-label="Фильтр по категории">
    <button type="button" class="btn" :aria-pressed="modelValue === ''" @click="$emit('update:modelValue', '')">
      Все
    </button>
    <button
      v-for="c in CATEGORIES"
      :key="c.code"
      type="button"
      class="btn"
      :aria-pressed="modelValue === c.code"
      :style="{ '--dot': c.color }"
      @click="$emit('update:modelValue', c.code)"
    >
      <span class="dot" aria-hidden="true" />
      {{ c.short }}
    </button>
  </div>
</template>
