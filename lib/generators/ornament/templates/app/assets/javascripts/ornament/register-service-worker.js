// =========================================================================
// Register ServiceWorker
// =========================================================================

// Register a service worker 
Ornament.registerServiceWorker = function(){
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      Ornament.log("Service Worker registered with scope", registration.scope);
      Ornament.ServiceWorker = registration;
    })
    .catch(function(error) {
      Ornament.log("Service Worker registration failed", error);
    })
}

// Check if service worker should be registered
if(Ornament.features.serviceWorker) {
  var hasLocalSW = document.location.hostname === "localhost" && store.get("Ornament.localServiceWorkers") === "true";
  var hasSecureSW = document.location.protocol === "https:";
  if(hasLocalSW || hasSecureSW) {
    Ornament.registerServiceWorker();
  } else {
    Ornament.features.serviceWorker = false;
  }
}

// Call this function to enable local service workers
Ornament.localServiceWorkerOptIn = function(){
  store.set("Ornament.localServiceWorkers", "true");
  window.location.reload();
}

// Call this function to enable local service workers
Ornament.localServiceWorkerOptOut = function(){
  store.remove("Ornament.localServiceWorkers");
  window.location.reload();
}
