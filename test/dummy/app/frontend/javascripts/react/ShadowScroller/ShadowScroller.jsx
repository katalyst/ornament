import React from "react";

export default class ShadowScroller extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showTopShadow: false,
      showBottomShadow: false,
    }
  }

  componentWillUnmount(){
    if(this.scrollElement) {
      this.scrollElement.removeEventListener("scroll", this.checkScrollPosition);
      window.removeEventListener("resize", this.checkScrollPosition);
    }
  }

  getScrollRef = el => {
    if(this.scrollElement) {
      return;
    }
    this.scrollElement = el;
    this.scrollElement.addEventListener("scroll", this.checkScrollPosition);
    window.addEventListener("resize", this.checkScrollPosition);
  }

  checkScrollPosition = () => {

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