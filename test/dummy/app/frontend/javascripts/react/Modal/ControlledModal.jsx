import React, { createRef } from "react";
import ReactModal from 'react-modal';
import ShadowScroller from '../ShadowScroller/ShadowScroller';

/*

  This is a controlled modal component whose open state is controlled
  externally to this component

  If using a modal in your view, you will want to use a Modal
  component and control it using DOM events - see the Modal
  component documentation

  Props
  -----

  isOpen: boolean - sets the modal open or not
  className: string - custom classname for the modal
  size: string - a css className to specifiy the size of the modal
  label: string - screen reader and header labelling
  noHeader: boolean - don't render the header of the modal
  ratio: string - "16x9" format, used for video sizing, defaults to 16x9 if not specified
  noBodyWrapper: boolean - only when using renderprops, don't put a modal--body wrapper around content
  onClose: function - the function to call to close the modal (eg. set state)
  onOpen: function - optional function to call after opening the modal

  Content Props
  -------------

  render: react component - this is a standard renderprop pattern
  renderHTML: string - html to render rather than a renderprop
  ajax: URL - ajax endpoint to hit up to load content and inject
  youtube: string - youtube video ID
  video: string - iframe embed URL

  footer: react component - footer renderprop
  footerHTML: string - html for footer

  Youtube props
  -------------
  
  autoplay: boolean - used with the youtube prop to autoplay the video

*/

export default class ControlledModal extends React.Component {

  constructor(props){
    super(props);
    this.modal = createRef();
    this.header = createRef();
    
    this.bodyOffset = 0;
    this.closeTimeout = 200;
    this.ratio = this.calculateRatio();
    this.isVideo = this.props.youtube || this.props.video;

    ReactModal.setAppElement("#top");
  }

  componentWillUnmount() {
    // Remove the resize listener if it's still bound
    window.removeEventListener("resize", this._resizeListener);
  }


  // Set page offset when props are updated
  componentWillUpdate(nextProps){

    // Opening modal, offset page
    if(!this.props.isOpen && nextProps.isOpen) {
      Ornament.C.Modal && Ornament.C.Modal.offsetPage && Ornament.C.Modal.offsetPage();
    }

    // Closing modal, restore page scroll
    if(this.props.isOpen && !nextProps.isOpen) {
      Ornament.C.Modal && Ornament.C.Modal.restorePage && Ornament.C.Modal.restorePage();
    }
  }

  // When resizing, do stuff
  _resizeListener = () => {
    if(this.props.isOpen && this.isVideo) {
      this.setRatio();
    }
  }

  // =========================================================================
  // Lifecycle hooks
  // =========================================================================

  onModalOpen = () => {
    // Set up resize listener when opening the modal
    if(this.isVideo) {
      window.addEventListener("resize", this._resizeListener);
      this.setRatio();
    }
    // Callback for props
    if(this.props.onOpen) {
      this.props.onOpen();
    }
  }

  onModalClose = () => {
    // Remvoe resize listener when closing the modal
    if(this.isVideo) {
      window.removeEventListener("resize", this._resizeListener);
    }
    // Calback for props
    if(this.props.onClose) {
      this.props.onClose();
    }
  }

  // =========================================================================
  // Ratio sizing
  // =========================================================================

  calculateRatio = () => {
    if(!this.props.ratio) {
      return 9 / 16;
    }
    const ratioArray = this.props.ratio.split("x").map(number => parseInt(number));
    return ratioArray[1] / ratioArray[0];
  }

  setRatio = () => {
    if(!(this.props.isOpen && this.isVideo)) {
      return;
    }

    // TODO: Hardcoded offsets defined in CSS is a bit nasty, see if we
    // find these offsets in JS
    // Could be a lot slower if we are descerning offset every resize though
    let offset = 64; // 4rem
    let headerOffset = 0;
    
    if(this.header.current) {
      headerOffset = this.header.current.offsetHeight;
    }
    
    if(this.modal.current) {
      const modal = this.modal.current.node.querySelector(".ReactModal__Content");
      
      // Treat available height as (screen size - 4rem modal gutters - size of header)
      const availableHeight = document.documentElement.offsetHeight - offset - headerOffset;

      // Assume height is available
      modal.style.width = "";
      let desiredHeight = (modal.offsetWidth * this.ratio) + headerOffset;
      let desiredWidth = false;
      
      // If new height is taller than available height
      // Make height available height and size width instead
      if(desiredHeight > availableHeight) {
        desiredHeight = availableHeight + headerOffset;
        desiredWidth = (availableHeight / this.ratio);
      }

      // Set node styles
      modal.style.height = desiredHeight + "px";
      if(desiredWidth) {
        modal.style.width = desiredWidth + "px";
      }
    }
  }

  // =========================================================================
  // Content formatting
  // =========================================================================

  // Various content types
  getContent = () => {
    let content = "";

    // Video content
    if(this.props.video) {
      content = 
        <iframe src={this.props.video} frameBorder="0" allowFullScreen></iframe>

    // Youtube embed
    } else if(this.props.youtube) {
      content = 
        <iframe src={`https://www.youtube.com/embed/${this.props.youtube}?enablejsapi=1&autoplay=${this.props.autoplay ? "true" : "false"}&autohide=1&showinfo=0&modestbranding=1&fs=1&rel=0`} frameBorder="0" allowFullScreen></iframe>

    // Render props
    } else if(this.props.render) {
      if(this.props.noBodyWrapper) {
        content = this.props.render();
      } else {
        content = 
          <ShadowScroller render={scrollRef => (
            <div className="lightbox--body" {...scrollRef}>
              {this.props.render()}
            </div>
          )} />
      }

    // Render HTML
    } else if(this.props.renderHTML) {
      content = 
        <ShadowScroller render={scrollRef => (
          <div
            className="lightbox--body"
            dangerouslySetInnerHTML={{ __html: this.props.renderHTML }}
            ref={el => scrollRef(el)}
          ></div>
        )} />
    }

    return content;
  }

  // =========================================================================
  // Footer formatting
  // =========================================================================

  getFooter = () => {
    let footer = "";

    // Render props
    if(this.props.footer) {
      footer = 
        <div className="lightbox--footer">
          {this.props.footer()}
        </div>

    // Footer as HTML
    } else if(this.props.footerHTML) {
      footer = 
        <div className="lightbox--footer" dangerouslySetInnerHTML={{ __html: this.props.footerHTML }}></div>
    }
    return footer;
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  // Build custom className from props
  getClassName = () => {
    let className = this.props.className || "ReactModal__Default";

    // Size class
    if(this.props.size) {
      className += " ReactModal__" + this.props.size;
    }

    // Video class
    if(this.isVideo) {
      className += " ReactModal__Video";
    }

    if(!this.isVideo && !this.props.noFullscreen) {
      className += " ReactModal__Fullscreenable";
    }

    return className;
  }

  // =========================================================================
  // Render
  // =========================================================================

  render(){
    return(
      <ReactModal
        ref={this.modal}
        isOpen={this.props.isOpen}
        onRequestClose={this.onModalClose}
        onAfterOpen={this.onModalOpen}
        contentLabel={this.props.label}
        className={this.getClassName()}
        closeTimeoutMS={this.closeTimeout}
        shouldReturnFocusAfterClose={true}
        style={{
          overlay: {
            zIndex: "200",
            backroundColor: "initial",
          },
        }}
      >
        {!this.props.noHeader &&
          <div className="lightbox--header" ref={this.header}>
            <div className="lightbox--title">
              {this.props.label}
            </div>
            <button className="lightbox--close" onClick={this.props.onClose} aria-label="Close modal">
              <span>&times;</span>
            </button>
          </div>
        }
        {this.getContent()}
        {this.getFooter()}
      </ReactModal>
    )
  }

}