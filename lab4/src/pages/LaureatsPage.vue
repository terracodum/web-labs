<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { laureateService, type LaureateRow } from "../api";
import CategoryFilter from "../components/CategoryFilter.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import { CATEGORIES, GOLD, formatCount, formatDate, plural, type Column } from "../helpers";
import { usePagedQuery } from "../usePagedQuery";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const columns: Column<LaureateRow>[] = [
  { key: "name", label: "Имя / название" },
  { key: "born", label: "Дата рождения / основания", render: (r) => formatDate(r.born) },
  { key: "prizes", label: "Число премий", align: "right" },
];

const page = ref(1);
const nameInput = ref("");
const name = ref("");
const category = ref("");

watch(nameInput, (value, _old, onCleanup) => {
  const timer = setTimeout(() => {
    name.value = value.trim();
    page.value = 1;
  }, DEBOUNCE_MS);
  onCleanup(() => clearTimeout(timer));
});

const { rows, total, loading, error, reload } = usePagedQuery(laureateService.getLaureates.bind(laureateService), () => ({
  offset: (page.value - 1) * PAGE_SIZE,
  limit: PAGE_SIZE,
  name: name.value,
  category: category.value,
}));

const selected = computed(() => CATEGORIES.find((c) => c.code === category.value));
const filtered = computed(() => Boolean(name.value || selected.value));

const summary = computed(() => {
  if (loading.value && total.value === 0) return "Загружаем данные…";
  const parts = [`${formatCount(total.value)} ${plural(total.value, ["лауреат", "лауреата", "лауреатов"])}`];
  if (selected.value) parts.push(`в категории «${selected.value.short}»`);
  if (name.value) parts.push(`по запросу «${name.value}»`);
  return parts.join(" ");
});

function pickCategory(code: string) {
  category.value = code;
  page.value = 1;
}

function resetFilters() {
  nameInput.value = name.value = category.value = "";
  page.value = 1;
}
</script>

<template>
  <div class="page-head">
    <h1>Лауреаты</h1>
    <p class="summary" role="status">{{ summary }}</p>
  </div>

  <div class="search">
    <label for="name">Поиск по имени или названию</label>
    <input id="name" v-model="nameInput" type="search" placeholder="Например, Curie" aria-describedby="name-hint" />
    <p id="name-hint" class="hint">Имена в базе записаны латиницей.</p>
  </div>

  <CategoryFilter :model-value="category" @update:model-value="pickCategory" />

  <p class="legend">
    <span class="mark" aria-hidden="true" />
    Золотая отметка: лауреат получил больше одной премии.
  </p>

  <DataTable
    caption="Лауреаты Нобелевской премии"
    :columns="columns"
    :data="rows"
    :loading="loading"
    :error="error"
    :row-accent="(row) => (row.prizes > 1 ? GOLD : undefined)"
    @retry="reload"
  >
    <template #empty>
      {{ filtered ? "По этим условиям никого не нашли." : "Лауреатов нет." }}
      <button v-if="filtered" type="button" class="btn" @click="resetFilters">Сбросить фильтры</button>
    </template>
  </DataTable>
  <Pagination v-if="!error" v-model:page="page" :page-size="PAGE_SIZE" :total="total" />
</template>
