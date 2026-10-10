/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { NetworkFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

// Настройки кеша данных API: меняются здесь, логика ниже трогать не нужно.
const API_ORIGIN = "https://api.nobelprize.org";
const API_CACHE_NAME = "nobel-api-v1";
const API_NETWORK_TIMEOUT_SECONDS = 4;
const API_MAX_ENTRIES = 100;
const API_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// Первые страницы списков кладём в кеш при установке: запросы самого первого захода
// выполняются до того, как service worker начал перехватывать трафик.
// Адреса должны совпадать с теми, что строит приложение (PAGE_SIZE = 10, без фильтров).
const API_WARM_URLS = [
  `${API_ORIGIN}/2.1/nobelPrizes?offset=0&limit=10&format=json`,
  `${API_ORIGIN}/2.1/laureates?offset=0&limit=10&format=json`,
];

self.skipWaiting();
clientsClaim();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(API_CACHE_NAME)
      .then((cache) => cache.addAll(API_WARM_URLS))
      .catch(() => undefined),
  );
});

// Оболочка приложения (html, js, css, шрифты, иконки) кешируется при установке.
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Любая навигация (/prizes, /laureats) без сети получает закешированный index.html,
// дальше маршрутизацию берёт на себя react-router.
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

// Данные API: сначала сеть (свежие данные), при отсутствии сети или таймауте берём кеш.
registerRoute(
  ({ url }) => url.origin === API_ORIGIN,
  new NetworkFirst({
    cacheName: API_CACHE_NAME,
    networkTimeoutSeconds: API_NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: API_MAX_ENTRIES, maxAgeSeconds: API_MAX_AGE_SECONDS }),
    ],
  }),
);
