import React from "react";
import Modal from "./Modal";
import ShadowScroller from "../ShadowScroller/ShadowScroller";

/*
*/

const supported = "permissions" in navigator;

export default class PermissionsModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      size: false,
    }
  }

  componentDidMount(){
    
  }

  componentWillUnmount(){
    
  }

  // =========================================================================
  // Permissions
  // =========================================================================

  // =========================================================================
  // Render
  // =========================================================================

  render(){
    return(
      <Modal
        id="global-ajax"
        {...this.props}
        noHeader={true}
        noBodyWrapper={true}
        className="ReactModal__Permissions",
        size={this.state.size}
        render={() => (
          <React.Fragment>
            <ShadowScroller
              render={(scrollRef, domRef) => (
                <img src="http://placehold.it/600x200" alt="" />
                <div className="panel--padding">
                  Message
                </div>
                <div className="panel--border-top">
                  Buttons
                </div>
              )}
            />
          </React.Fragment>
        )}
      />
    )
  }

}