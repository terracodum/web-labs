<script setup lang="ts">
import { online } from "./online";
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <RouterLink to="/" class="brand">Нобелевские премии</RouterLink>
      <nav aria-label="Основная навигация">
        <ul>
          <li><RouterLink to="/prizes">Премии</RouterLink></li>
          <li><RouterLink to="/laureats">Лауреаты</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>

  <div v-if="!online" class="offline-banner" role="status">
    <p>Нет соединения. Показаны сохранённые данные, они могут быть устаревшими. Когда сеть появится, данные обновятся сами.</p>
  </div>

  <main>
    <RouterView />
  </main>

  <footer class="site-footer">
    <p>Лабораторная работа №5. Данные: nobelprize.org.</p>
  </footer>
</template>
