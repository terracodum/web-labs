import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@fontsource-variable/literata";
import "@fontsource-variable/ibm-plex-sans";
import "./style.css";
import App from "./App.vue";
import LaureatsPage from "./pages/LaureatsPage.vue";
import PrizesPage from "./pages/PrizesPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/prizes" },
    { path: "/prizes", component: PrizesPage },
    { path: "/laureats", component: LaureatsPage },
  ],
});

createApp(App).use(router).mount("#app");
