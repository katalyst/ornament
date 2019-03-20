/*

  Custom event polyfill from Rails UJS
  https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts/rails-ujs/utils/event.coffee

  Note: This is required due to rails not exposing their CustomEvent polyfill
  Essentially this code is included twice because of this
  This is needed so that we can override the Rails.fire function to allow non-bubbling
  events

*/
if(typeof window.CustomEvent !== 'function') {
  window.CustomEvent = (event, params) => {
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt;
  }

  window.CustomEvent.prototype = window.Event.prototype;

  // Fix setting `defaultPrevented` when `preventDefault()` is called
  // http://stackoverflow.com/questions/23349191/event-preventdefault-is-not-working-in-ie-11-for-custom-events
  const { preventDefault } = CustomEvent.prototype;

  CustomEvent.prototype.preventDefault = function(){
    let result = preventDefault.call(this);
    if(this.cancelable && !this.defaultPrevented) {
      Object.defineProperty(this, 'defaultPrevented', {
        get: () => true,
      });
    }
    return result
  }
}