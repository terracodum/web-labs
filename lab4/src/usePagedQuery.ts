import { ref, watch, type Ref } from "vue";
import type { PagedResult } from "./api";

export function usePagedQuery<T, Q>(fetcher: (query: Q) => Promise<PagedResult<T>>, query: () => Q) {
  const rows = ref([]) as Ref<T[]>;
  const total = ref(0);
  const loading = ref(true);
  const error = ref(false);
  const attempt = ref(0);
  let lastRequest = 0;

  async function load() {
    const request = ++lastRequest;
    loading.value = true;
    error.value = false;

    try {
      const result = await fetcher(query());
      if (request !== lastRequest) return;
      rows.value = result.items;
      total.value = result.total;
    } catch {
      if (request === lastRequest) error.value = true;
    } finally {
      if (request === lastRequest) loading.value = false;
    }
  }

  watch(() => ({ query: query(), attempt: attempt.value }), load, { immediate: true });

  return { rows, total, loading, error, reload: () => attempt.value++ };
}
