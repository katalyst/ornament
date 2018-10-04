// =========================================================================
// Ornament Core Settings
// =========================================================================

(function(doc, win){
  "use strict";

  var Ornament = window.Ornament || {};
  Ornament.version = "2.2.0";
  Ornament.ready = false;
  Ornament.debug = false;

  // A series of named breakpoints to match JS behaviour with CSS breakpoints
  Ornament.breakpoints = {
    mobileHeader: 990
  }

  // Set up namespaces for components and utilities 
  Ornament.Components = {};
  Ornament.C = Ornament.Components;
  Ornament.Utilities = {};
  Ornament.U = Ornament.Utilities;

  // Feature detection 
  Ornament.features = {};

  // Namespace for JS triggers
  // eg. addEventListener("ornament:myComponent:doThing", doThing);
  Ornament.eventNamespace = "ornament:";

  // =========================================================================
  // Debug
  // =========================================================================

  Ornament.log = function(log) {
    if(Ornament.debug) {
      console.log(log);
    }
  }

  // =========================================================================
  // Simple feature detection 
  // =========================================================================

  Ornament.features.serviceWorker = "serviceWorker" in navigator;
  Ornament.features.geolocation = "geolocation" in navigator;
  Ornament.features.turbolinks = typeof(Turbolinks) !== "undefined" && Turbolinks.supported;
  Ornament.features.ie8 = false;
  Ornament.features.localStorage = true;
  Ornament.features.tracking = true;
  Ornament.features.webanimation = typeof(Element.prototype.animate === "function");

  // Turn off serviceWorker if cookies are disabled
  if(!navigator.cookieEnabled) {
    Ornament.features.serviceWorker = false;
  }

  // Feature detection for localStorage
  try {
    localStorage.setItem('OrnamentStorageFeatureDetection', 'true');
    localStorage.removeItem('OrnamentStorageFeatureDetection');
    Ornament.features.localStorage = true;
  } catch(e) {
    Ornament.features.localStorage = false;
  }

  // Turn off tracking if cookies are disabled
  if("doNotTrack" in navigator) {
    Ornament.features.tracking = navigator.doNotTrack !== 1;
  }

  // =========================================================================
  // Events
  // =========================================================================

  Ornament.triggerEvent = function(element, eventName, canBubble, canBeCancelled) {
    canBubble = canBubble || false;
    canBeCancelled = true;
    var event = document.createEvent('Event');
    event.initEvent(eventName, canBubble, canBeCancelled);
    element.dispatchEvent(event);
  }

  // =========================================================================
  // Datastore
  // =========================================================================

  var dataStore = [];

  // Ornament.Data.get(element, "firstChild") => node
  var getData = function(element, key) {
    var data = false;
    dataStore.find(function(datum){
      if(datum.element === element) {
          data = datum.data;
          return true;
      }
    });
    if(data && key) {
      return data[key] || false;
    } else {
      return data || false;
    }
  }

  // Ornament.Data.set(element, "firstChild", element.childNodes[0]);
  var setData = function(element, key, value) {
    var existingData = getData(element);

    // If data already exists, either add or overwrite key with new
    // value
    if(existingData) {
      existingData[key] = value;
      return existingData;

    // If no data for this element, create a new data structure
    // and add our initial data
    } else {
      var newData = {};
      newData[key] = value;
      dataStore.push({
        element: element,
        data: newData
      });
      return newData;
    }
  }

  Ornament.Data = {
    store: dataStore,
    set: setData,
    get: getData
  }

  // =========================================================================
  // Component Registration 
  // =========================================================================

  // Register components for initialisation when Ornament is ready
  // All components need atleast an init() function. 
  // This function registers the component but will not execute the
  // init function. 

  // Here is the simplest component:
  // Ornament.registerComponent("myComponent", {
  //   init: function(){ console.log("myComponent") }
  // });

  // If there is myComponent._resizeListener() or 
  // myComponent._scrollListener, these will both be applied to the 
  // resize and scroll listeners when Ornament is refreshed. 

  // They both use Ornament.U.bindOnce so if Ornament.refresh is called
  // again later it will unbind the original bindings and then re-bind
  // them to prevent stacking binds 

  // Calling registerComponent will return the object so you can do 
  // cool stuff like: 
  // var myComponent = Ornament.registerComponent("myComponent", {
  //   init: function() { console.log("myComponent") }
  // });
  // myComponent.anotherThing = "Hey, I'm another thing defined later";

  Ornament.registerComponent = function(componentName, componentObject) {
    Ornament.log("Registering Component: " + componentName);
    Ornament.C[componentName] = componentObject;
    Ornament.onLoad(function(){
      if(componentObject._resizeListener) {
        Ornament.log("Registering resize listener for: " + componentName);
        Ornament.U.bindOnce(window, "resize", componentObject._resizeListener);
      }
      if(componentObject._scrollListener) {
        Ornament.log("Registering scroll listener for: " + componentName);
        Ornament.U.bindOnce(document, "scroll", componentObject._scrollListener);
      }
    });
    return componentObject;
  }

  // Initialise a single component by passing in the component name.
  // This will call myComponent.init();
  Ornament.initComponent = function(componentName) {
    var component = Ornament.C[componentName];
    if(component.init) {
      Ornament.log("Initialising component: " + componentName);
      component.init();
    } else {
      console.warn("[Ornament] Could not initialise component " + componentName + ", no init function.");
    }
  }

  // Initialise multiple components at once by passing in an 
  // array of components:
  // Ornament.initComponents(["myComponent", "myOtherComponent"]);
  // If there are no arguments passed, all compnents in Ornament.C will
  // be initialised.
  Ornament.initComponents = function(components) {
    components = components || Object.keys(Ornament.Components);
    components.map(function(component) {
      Ornament.initComponent(component);
    });
  }

  // =========================================================================
  // Lifecycle and State 
  // =========================================================================

  // beforeLoad is used to store settings or do any behaviours before the 
  // component is initialised. Use this setting to store things that 
  // can either be used globally or can be used by other components. 
  // Ornament.beforeLoad(function(){
  //   Ornament.someComponentSetting = true;
  // });
  Ornament.beforeLoad = function(callback) {
    if(Ornament.ready) {
      console.log("[Ornament] beforeLoad was called but Ornament is already ready. Executing code anyway.");
    } else {
      callback();
    }
  }

  // onLoad will schedule code execution for when Ornament.refresh
  // is called. If Ornament.refresh has already been called and 
  // Ornament.ready is true, it will execute the code immediately
  // instead of waiting. 
  // Ornament.onLoad(function(){
  //   Ornament.someComponentSetting; // true
  // })
  Ornament.onLoad = function(callback) {
    if(Ornament.ready) {
      callback();
    } else {
      document.addEventListener("ornament:refresh", callback);
    }
  }

  // Refresh Ornament
  // Reinitialise all components. 
  Ornament.refresh = function(){
    Ornament.log("Refresh");
    Ornament.ready = true;
    Ornament.initComponents();

    // Hijack service worker prompt
    if(Ornament.features.serviceWorker) {
      Ornament.hijackServiceWorkerPrompt();
    }
    
    Ornament.triggerEvent(document, "ornament:refresh");
  }

  // Turbolinks cache alias
  Ornament.beforeTurbolinksCache = function(callback){
    if(Ornament.features.turbolinks) {
      document.addEventListener("turbolinks:before-cache", function(event) {
        callback();
      });
    }
  }

  // Call Ornament.refresh() when the page has finished loading.
  if(Ornament.features.turbolinks) {
    document.addEventListener("turbolinks:load", function(event) {
      Ornament.refresh();
    });
  } else { 
    document.addEventListener("DOMContentLoaded", function(event){
      Ornament.refresh();
    });
  }

}(document, window));