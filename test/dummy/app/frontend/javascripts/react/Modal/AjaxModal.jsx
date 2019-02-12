import React from "react";
import Modal from "./Modal";
import Axios from "axios";
import ShadowScroller from "../ShadowScroller/ShadowScroller";

/*

  An ajax-ready modal for loading in remote content

  Opening
  -------

  Opening a modal is done via a custom event:
  Ornament.triggerEvent(`ornament:modal:global-ajax:load`, { url });

  eg:
  Ornament.triggerEvent(`ornament:modal:global-ajax:load`, { "/login" });
  
  You can pass a size in as a second parameter:
  Ornament.triggerEvent(`ornament:modal:global-ajax:load`, { "/login", "small" });

  Closing
  -------

  Closing the modal can be externally triggered just like any
  regular ControlledModal:
  Ornament.triggerEvent(`ornament:modal:close-any`);

*/

export default class AjaxModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      content: null,
      error: false,
      size: false,
    }
  }

  componentDidMount(){
    document.addEventListener("ornament:modal:global-ajax:load", this.openAndLoad);
    document.addEventListener("ornament:modal:global-ajax:after-close", this.clearContent);
  }

  componentWillUnmount(){
    document.removeEventListener("ornament:modal:global-ajax:load", this.openAndLoad);
    document.removeEventListener("ornament:modal:global-ajax:after-close", this.clearContent);
  }
  
  // =========================================================================
  // Loading content
  // =========================================================================

  // Open the modal and start loading the content from an event
  openAndLoad = event => {
    const { url, size } = event.detail;
    if(!url) {
      console.log("[AJAX MODAL] missing URL");
      return;
    } else {
      // Open modal via event
      Ornament.triggerEvent(`ornament:modal:global-ajax:open`);
      // Load in endpoint
      this.ajaxLoad(url, size);
    }
  }

  // Start loading the ajax content
  ajaxLoad = (url, size) => {
    Axios.get(url, {
      params: {
        modal: true,
      }
    }).then(response => {
      if(response.data) {
        this.setState({
          loading: false,
          content: response.data,
          size: size,
          error: false,
        })
      }
    }).catch(error => {
      this.setState({
        loading: false,
        content: null,
        error,
      })
    })
  }

  // Clear content - typically after closing to allow for the next load of content
  clearContent = () => {
    this.setState({
      loading: true,
      content: null,
      error: false,
    })
  }

  // =========================================================================
  // Render
  // =========================================================================

  // Passing modal classes down to represent ajax state
  getClassName = () => {
    let className = this.props.className || "";
    if(this.state.loading) {
      className += " ReactModal__AjaxLoading";
    }
    if(this.state.error) {
      className += " ReactModal__AjaxError";
    }
    return className;
  }

  render(){
    return(
      <Modal
        id="global-ajax"
        {...this.props}
        noHeader={true}
        noBodyWrapper={true}
        noFullscreen={this.state.loading || this.state.error}
        className={this.getClassName()}
        size={this.state.size}
        render={() => (
          <React.Fragment>
            {this.state.loading &&
              <div className="lightbox--loading-message">
                Loading...
              </div>
            }
            {this.state.error && !this.state.loading &&
              <div className="lightbox--body panel--padding align__center type--error">
                <p><strong>Error</strong></p>
                <p>{this.state.error.message}</p>
              </div>
            }
            {!this.state.loading && this.state.content &&
              <ShadowScroller
                render={(scrollRef, domRef) => (
                  <div
                    className="lightbox--nested-body"
                    ref={el => domRef(el, ".lightbox--body")}
                    dangerouslySetInnerHTML={{__html: this.state.content}}
                  ></div>
                )}
              />
            }
            {!this.state.loading && !this.state.content && !this.state.error &&
              <div class="lightbox--body panel--padding align__center">No content</div>
            }
          </React.Fragment>
        )}
      />
    )
  }

}