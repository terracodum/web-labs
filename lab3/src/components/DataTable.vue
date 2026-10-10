<script setup lang="ts" generic="T">
import type { Column } from "../helpers";

defineProps<{
  caption: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: boolean;
  rowAccent?: (row: T) => string | undefined;
}>();
defineEmits<{ retry: [] }>();

const cell = (row: T, col: Column<T>) => (col.render ? col.render(row) : String(row[col.key]));
</script>

<template>
  <div v-if="error" class="notice" role="alert">
    <p>Не удалось загрузить данные. Проверьте соединение и повторите попытку.</p>
    <button type="button" class="btn" @click="$emit('retry')">Повторить</button>
  </div>

  <div v-else class="table-scroll">
    <table class="data-table" :aria-busy="loading">
      <caption>{{ caption }}</caption>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" scope="col" :class="{ num: col.align === 'right' }">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody :class="{ 'is-loading': loading }">
        <tr v-if="data.length === 0" class="placeholder">
          <td :colspan="columns.length">
            <template v-if="loading">Загружаем данные…</template>
            <slot v-else name="empty" />
          </td>
        </tr>
        <tr v-for="(row, i) in data" :key="i" :style="{ '--accent': rowAccent?.(row) }">
          <td v-for="col in columns" :key="col.key" :class="{ num: col.align === 'right' }">
            {{ cell(row, col) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
