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

  <main>
    <RouterView />
  </main>

  <footer class="site-footer">
    <p>Лабораторная работа №4. Данные: nobelprize.org.</p>
  </footer>
</template>
