<script setup lang="ts">
import { computed, ref } from "vue";
import { nobelPrizeService, type PrizeRow } from "../api";
import CategoryFilter from "../components/CategoryFilter.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import { CATEGORIES, findCategory, formatCount, formatDate, plural, type Column } from "../helpers";
import { usePagedQuery } from "../usePagedQuery";

const PAGE_SIZE = 10;

const dateColumn: Column<PrizeRow> = { key: "date", label: "Дата вручения", render: (r) => formatDate(r.date) };
const categoryColumn: Column<PrizeRow> = {
  key: "category",
  label: "Категория",
  render: (r) => findCategory(r.category)?.full ?? r.category,
};
const grantColumn: Column<PrizeRow> = { key: "grant", label: "Стоимость гранта", align: "right" };

const page = ref(1);
const category = ref("");

const { rows, total, loading, error, reload } = usePagedQuery(nobelPrizeService.getPrizes.bind(nobelPrizeService), () => ({
  offset: (page.value - 1) * PAGE_SIZE,
  limit: PAGE_SIZE,
  category: category.value,
}));

const selected = computed(() => CATEGORIES.find((c) => c.code === category.value));
const columns = computed(() => (selected.value ? [dateColumn, grantColumn] : [dateColumn, categoryColumn, grantColumn]));

const summary = computed(() => {
  if (loading.value && total.value === 0) return "Загружаем данные…";
  const count = `${formatCount(total.value)} ${plural(total.value, ["премия", "премии", "премий"])}`;
  return selected.value ? `${count} в категории «${selected.value.short}»` : count;
});

function pickCategory(code: string) {
  category.value = code;
  page.value = 1;
}
</script>

<template>
  <div class="page-head">
    <h1>Премии</h1>
    <p class="summary" role="status">{{ summary }}</p>
  </div>

  <CategoryFilter :model-value="category" @update:model-value="pickCategory" />

  <DataTable
    caption="Нобелевские премии"
    :columns="columns"
    :data="rows"
    :loading="loading"
    :error="error"
    :row-accent="(row) => findCategory(row.category)?.color"
    @retry="reload"
  >
    <template #empty>В этой категории премий не найдено.</template>
  </DataTable>
  <Pagination v-if="!error" v-model:page="page" :page-size="PAGE_SIZE" :total="total" />
</template>
