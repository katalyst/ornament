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

// As of Chrome 68 A2HS prompts are no longer automatically triggered
// We need to hijack the event and trigger .prompt();
// https://developers.google.com/web/updates/2018/06/a2hs-updates
Ornament.hijackServiceWorkerPrompt = function(){
  // Flag to use UI behaviour
  // if false, will just prompt A2HS like it used to
  var showA2HSUI = false;
  window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    Ornament.addToHomescreenEvent = event;
    if(showA2HSUI) {
      for($button of document.querySelectorAll("[data-a2hs]")) {
        $button.display = "block";
        $button.addEventListener("click", function(addEvent) {
          $button.disabled = true;
          Ornament.addToHomescreen();
        });
      }
    } else {
      Ornament.addToHomescreen();
    }
  });
}

// Add to homescreen event with tracking
Ornament.addToHomescreen = function() {
  if(Ornament.addToHomescreenEvent) {
    Ornament.addToHomescreenEvent.prompt();
    Ornament.addToHomescreenEvent.userChoice.then(function(choice) {
      if(document.location.search.indexOf("appbannerinstall") > -1) {
        alert(choice.outcome);
      }
      Ornament.C.Analytics.trackEvent("Add To Homescreen Install Banner", choice.outcome);
      Ornament.addToHomescreenEvent = null;
    });
  }
}
