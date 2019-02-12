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

  Note: This will result in a new <div> element around your
  scrollable area, so if you're using something like flexbox
  for example to lay it out, you may need to style the shadow
  wrapper as well in order to maintain the desired flexbox layout

*/

export default class ShadowScroller extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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

  // Get an element and assign it as our scrollElement
  getScrollRef = el => {
    if(this.scrollElement) {
      return;
    }
    this.scrollElement = el;
    this.scrollElement.addEventListener("scroll", this.checkScrollPosition);
    window.addEventListener("resize", this.checkScrollPosition);
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
    this.setState({
      showTopShadow,
      showBottomShadow,
    });
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
        {this.props.render(this.getScrollRef)}
      </div>
    )
  }

}