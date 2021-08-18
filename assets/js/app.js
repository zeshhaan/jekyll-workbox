// if ("serviceWorker" in navigator) {
//   // This code checks if the browser supports service workers.

//   //REGISTRATION
//   navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(
//     function (registration) {
//       //note this is the file's URL relative to the origin, not the JS file(i.e., app.js) that references it.
//       console.log("service worker registration succeeded:", registration);
//     },
//     function (error) {
//       console.log("service worker registration failed", error);
//     }
//   );
// }

if ('serviceWorker' in navigator){
  window.addEventListener('load', async() => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('Service worker registered! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registration failed: ', err);
    }
  })
}