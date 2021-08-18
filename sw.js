importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.2.1/workbox-sw.js"
);

workbox.setConfig({ debug: true });

// Route of workbox-routing
// A Route consists of a pair of callback functions, "match" and "handler". The "match" callback determine if a route should be used to "handle" a request by returning a non-falsy value if it can. The "handler" callback is called when there is a match and should return a Promise that resolves to a Response.
// new Route(match, handler, method)

// TODO:
// - Pre-cache home-page and offline-page routes including it's sub resources.
// pre-cache strategy -> home-page route will use staleWhileRevalidate strategy
// offline page will use cache-only strategy

// - All other routes run on networkOnly strategy
// - when offline, home route will be retireved from cache and all other routes fallback to /offline.html route.

// Steps
// 1. create cache for home route and offline route with it's subresources
// 2. fetch all routes using networkOnly strategy by default
// 3. home page should be fetched from cache all the time
// 4. when offline, all other routes will be fetched from /offline.html

//importing all the library components just to make sure that they available when loaded when testing
const { navigationPreload } = workbox;
const { registerRoute, NavigationRoute, setDefaultHandler, setCatchHandler } =
  workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst, NetworkOnly } =
  workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const {
  warmStrategyCache,
  offlineFallback,
  pageCache,
  staticResourceCache,
  imageCache,
} = workbox.recipes;

const MY_URL_STRING = new URL("/", location).toString();

registerRoute(
  // Match a request for a URL, or subresource request originating from that URL.
  ({ request }) =>
    request.url === MY_URL_STRING ||
    request.headers.get("Referer") === MY_URL_STRING,
  new StaleWhileRevalidate()
);
