<script setup lang="ts">
import { computed } from "vue";
import { formatCount } from "../helpers";

const props = defineProps<{ pageSize: number; total: number }>();
const page = defineModel<number>("page", { required: true });

const pageCount = computed(() => Math.ceil(props.total / props.pageSize));
const from = computed(() => (page.value - 1) * props.pageSize + 1);
const to = computed(() => Math.min(page.value * props.pageSize, props.total));
</script>

<template>
  <nav v-if="pageCount > 1" class="pagination" aria-label="Страницы таблицы">
    <p>Показаны {{ formatCount(from) }}–{{ formatCount(to) }} из {{ formatCount(total) }}</p>
    <div class="pagination-controls">
      <button type="button" class="btn" :disabled="page <= 1" @click="page--">Назад</button>
      <span aria-current="page">{{ page }} из {{ pageCount }}</span>
      <button type="button" class="btn" :disabled="page >= pageCount" @click="page++">Вперёд</button>
    </div>
  </nav>
</template>
