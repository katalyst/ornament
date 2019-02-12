import React from "react";

/*

  ShadowScroller is a wrapper component for a scrollable area
  that adds top/bottom shadows based on scroll position

  Usage
  -----

  Simply wrap your scrollable area with the component:

  <ShadowScroller render={(scrollRef) => (
    <div ref={el => scrollRef(el)}>
      Your scrollable content
    </div>
  )} />

  The scrollRef function lets the wrapper know which element
  to watch scrolling for in order to show the shadows.

  Usage with non-react DOM
  ------------------------

  If you're wrapping a ShadowScroller around DOM not controlled
  by React you need a slightly different approach, as it's
  likely that the scrolling element will not be available
  to attach a ref to. In this case you need to get the ref
  of the child element along with a selector to find
  the scrollable element:

  <ShadowScroller render={(scrollRef, domRef) => (
    <div
      ref={el => domRef(el, ".lightbox--body")}
      dangerouslySetInnerHTML={{__html: this.props.htmlContent}}
    ></div>
  )} />

  Styling note
  ------------

  Note: This will result in a new <div> element around your
  scrollable area, so if you're using something like flexbox
  for example to lay it out, you may need to style the shadow
  wrapper as well in order to maintain the desired flexbox layout

*/

export default class ShadowScroller extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dom: false,
      showTopShadow: false,
      showBottomShadow: false,
    }
  }

  // Unbind the events when unmounting
  componentWillUnmount(){
    if(this.scrollElement) {
      this.scrollElement.removeEventListener("scroll", this.checkScrollPosition);
      window.removeEventListener("resize", this.checkScrollPosition);
    }
  }

  // =========================================================================
  // React and state-based nodes
  // =========================================================================

  // Get an element and assign it as our scrollElement
  getScrollRef = el => {
    if(this.scrollElement) {
      return;
    }

    // Set scroll element and bind
    this.scrollElement = el;
    this.bindEvents();
  }

  // =========================================================================
  // Dom-based option
  // =========================================================================

  getDomElement = (el, selector) => {
    console.log("GETTING DOM EL", el, selector);
    if(this.scrollElement) {
      return;
    }

    const query = el.querySelector(selector);
    console.log(query);
    if(query) {
      this.scrollElement = query;
      this.setState({
        dom: true,
      }, () => {
        const $wrapper = document.createElement("div");
        this.topShadow = document.createElement("div");
        this.bottomShadow = document.createElement("div");
        $wrapper.classList.add("shadow--wrapper");
        this.topShadow.classList.add("shadow__top");
        this.bottomShadow.classList.add("shadow__bottom");
        this.scrollElement.parentNode.insertBefore($wrapper, this.scrollElement);
        $wrapper.appendChild(this.topShadow);
        $wrapper.appendChild(this.bottomShadow);
        $wrapper.appendChild(this.scrollElement);
        this.bindEvents();
      });
    }
  }

  // =========================================================================
  // Calculations and bindings
  // =========================================================================

  bindEvents = () => {
    if(!this.scrollElement) {
      return;
    }

    // Add resize and scroll events to update shadows
    this.scrollElement.addEventListener("scroll", this.checkScrollPosition);
    window.addEventListener("resize", this.checkScrollPosition);

    // Initial shadow check
    this.checkScrollPosition();
  }

  // Check the scroll position and update the state
  checkScrollPosition = () => {

    // Abort check if there is no scroll element
    if(!this.scrollElement) {
      return;
    }

    // Get current scroll position
    const scrollTop = this.scrollElement.scrollTop;

    // Get max scroll position
    let maxScroll = 0;
    this.scrollElement.childNodes.forEach(function($childNode){
      if($childNode.offsetHeight) {
        maxScroll += parseInt($childNode.offsetHeight);
      }
    });
    maxScroll = maxScroll - this.scrollElement.offsetHeight;

    // Determine which shadows should show
    let showTopShadow = false;
    let showBottomShadow = false;
    if(scrollTop != 0) {
      showTopShadow = true;
    }
    if(scrollTop < maxScroll) {
      showBottomShadow = true;
    }

    // Set the state
    if(this.state.dom) {
      this.topShadow.style.display = showTopShadow ? "block" : "none";
      this.bottomShadow.style.display = showBottomShadow ? "block" : "none";
    } else {
      this.setState({
        showTopShadow,
        showBottomShadow,
      });
    }
  }

  render(){
    return(
      <div className="shadow--wrapper">
        {this.state.showTopShadow &&
          <div className="shadow__top"></div>
        }
        {this.state.showBottomShadow &&
          <div className="shadow__bottom"></div>
        }
        {this.props.render(this.getScrollRef, this.getDomElement)}
      </div>
    )
  }

}