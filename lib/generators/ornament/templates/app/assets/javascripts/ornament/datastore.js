// =========================================================================
// Data storage
// replaces $(element).data() from jQuery
// =========================================================================

(function(doc, win, Orn, Util){
  "use strict";

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

  Orn.Data = {
    store: dataStore,
    set: setData,
    get: getData
  }

}(document, window, Ornament, Ornament.Utilities));