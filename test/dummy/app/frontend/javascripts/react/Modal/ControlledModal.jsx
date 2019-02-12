import React from "react";
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
  noBodyWrapper: boolean - only when using renderprops, don't put a modal--body wrapper around content
  onClose: function - the function to call to close the modal (eg. set state)

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
    this.bodyOffset = 0;
    this.closeTimeout = 200;
    ReactModal.setAppElement("#top");
  }


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

  // =========================================================================
  // Content formatting
  // =========================================================================

  // Various content types
  getContent = () => {
    let content = "";

    // Video content
    if(this.props.video) {
      content = 
        <div className="embed__youtube">
          <iframe src={this.props.video} frameBorder="0" allowFullScreen></iframe>
        </div>

    // Youtube embed
    } else if(this.props.youtube) {
      content = 
        <div className="embed__youtube">
          <iframe src={`https://www.youtube.com/embed/${this.props.youtube}?enablejsapi=1&autoplay=${this.props.autoplay ? "true" : "false"}&autohide=1&showinfo=0&modestbranding=1&fs=1&rel=0`} frameBorder="0" allowFullScreen></iframe>
        </div>

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
    const isVideo = this.props.youtube || this.props.video;

    // Size class
    if(this.props.size) {
      className += " ReactModal__" + this.props.size;
    }

    // Video class
    if(isVideo) {
      className += " ReactModal__Video";
    }

    if(!isVideo && !this.props.noFullscreen) {
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
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
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
          <div className="lightbox--header">
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