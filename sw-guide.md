---
layout: default
title: Service Worker Guide
---

#### Three steps involved

1. [Registration](#registration)
2. [Installation](#installation)
3. [Activation](#activation)

### Registration

This is the entry point into service workers.

```javascript
//app.js

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(
    function (registration) {
      console.log("service worker registration succeeded:", registration);
    },
    function (error) {
      console.log("service worker registration failed", error);
    }
  );
}
```

### Installation

We make use of `install` event here. The install event is generally used to populate your browser’s offline caching capabilities with the assets you need to run your app offline. To do this, we use Service Worker’s storage API — cache — a global object on the service worker that allows us to store assets delivered by responses, and keyed by their requests. This API works in a similar way to the browser’s standard cache, but it is specific to your domain. It persists until you tell it not to — again, you have full control.

```javascript
//sw.js

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v0.1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./blog.html",
        "./staff.html",
        "./about.html",
      ]);
    })
  );
});
```

We are chaining `waitUntil()` method of `ExtendableEvent` onto the `install event` to ensure that the service worker will not install until the code inside `waitUntil()` has successfully occurred.

`addAll()` takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache.

### Activation

Now once the SW is installed, it automatically gets activated and you don't need to specify `activate` event unless you want to update which we will discuss a bit later in this section.

But if you are curious to know how that looks, here is the code
```javascript
  //WIP
```

Now you’ve got your site assets cached, you need to tell service workers to do something with the cached content. This is easily done with the `fetch` event.  

or in other words -  
Adding assets to the cache is just one part of the precaching story—once the assets are cached, they need to respond to outgoing requests. That requires a fetch event listener in your service worker that can check which URLs have been precached, and return those cached responses reliably, bypassing the network in the process.

```javascript
//sw.js

self.addEventListener("fetch", (event) => {
  event
    .respondWith
    //code goes here
    ();
});
```

A `fetch` event fires every time any resource controlled by a service worker is fetched. We then call the `respondWith()` method on the event. It actually prevents the browser's default fetch handling, and allows you to provide a promise for a Response yourself.

```javascript
//sw.js

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});
```

`caches.match()` method takes inside a request parameter which might be an object or url.

Here `caches.match(event.request)` allows us to match each resource requested from the network with the equivalent resource available in the cache, if there is a matching one available. The matching is done via URL and various headers, just like with normal HTTP requests.

If we didn’t provide any kind of failure handling, our promise would resolve with undefined and we wouldn't get anything returned.

Fortunately we can do something like this - If the resources aren't in the cache, they are requested from the network.

```javascript
//sw.js

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then(response) => {
      return response || fetch(event.request);
  });
});
```

But what if a /s page is updated or a new client logo on `/launchpad` or we add some new product to the navbar? Instead of just fetching, we could instead do fetch + save it into our cache so that later requests for that resource could be retrieved offline too!

```javascript
//sw.js

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(res) => {
      return res || fetch(event.request).then((response) => {
          return caches.open("v0.1").then((cache) => {
              cache.put(event.request, reponse.clone());
              return response;
          })
      })
  });
});
```

## References

- [Motivation | offlinefirst.org](http://offlinefirst.org/)
- [Promises Intro | web.dev](https://web.dev/promises/)
- [Promise Docs | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Service Workers: an Introduction | Web Fundamentals](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Service Worker Cookbook | Mozilla](https://serviceworke.rs/)
- [Using Service Workers | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#install_and_activate_populating_your_cache)
- [ServiceWorkerContainer.register() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
- [ServiceWorkerGlobalScope | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)
- [ServiceWorkerGlobalScope: install event | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event)
- [FetchEvent | MDN](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)
- [FetchEvent.respondWith() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith)
- [Cache | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Cache.match() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [ServiceWorkerGlobalScope: activate event | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event)
- [ExtendableEvent.waitUntil() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil)
- [ServiceWorkerGlobalScope.skipWaiting() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting)
- [Clients.claim() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim)
- [IndexedDB API | MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Using IndexedDB | MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- ### Workbox
  - [Workbox intro | web.dev](https://web.dev/workbox/)
  - [Workbox Home Page](https://developers.google.com/web/tools/workbox/)
- ### Push notification
  - [Introduction to Push Notifications | Google Developers](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications)
  - [Web Push Notifications: Timely, Relevant, and Precise | Web Fundamentals](https://developers.google.com/web/fundamentals/push-notifications)
  - [Use Firebase in Progressive Web Apps | Firebase Blog](https://firebase.google.com/docs/projects/pwa)
  - [Implementing Push Notifications in Progressive Web Apps (PWAs) Using Firebase | CodeMag](https://www.codemag.com/article/1901031/Implementing-Push-Notifications-in-Progressive-Web-Apps-PWAs-Using-Firebase)
  - [PWA Push Notifications with Firebase (Cloud Messaging)-Part 1 | dev.to](https://dev.to/thisdotmedia/pwa-push-notifications-with-firebase-cloud-messaging-pt1-10ak)
  - [How to make PWAs re-engageable using Notifications and Push | MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push)
  - [Introduction to Progressive Web Apps (Push Notifications) - Part 3 | Auth0 Blog](https://auth0.com/blog/introduction-to-progressive-web-apps-push-notifications-part-3/)
  - [Install App Prompt](https://web.dev/customize-install/)
