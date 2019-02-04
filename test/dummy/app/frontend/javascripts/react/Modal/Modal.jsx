import React from "react";
import ControlledModal from "./ControlledModal";

/*

  This is a stateful modal component used with DOM events

  Usage
  -----

  <%= react_component("Modal", props: {
    id: "my-modal"
  }) %>

  <button data-modal="my-modal">Open my modal</button>

  All props will get passed in to a ControlledModal component as-is with
  the exception of isOpen which is now controlled in the state of this
  component

  Events
  ------

  This modal can be controlled via data-lightbox bindings but also
  custom DOM events:

  Ornament.triggerEvent("ornament:modal:{id}:open");
  Ornament.triggerEvent("ornament:modal:{id}:close");

  There is also a generic close event to close any open modals:

  Ornament.triggerEvent("ornament:modal:close-any");

*/

export default class Modal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      open: this.props.open,
    }

    // Store event prefix
    if(props.id) {
      this.eventPrefix = `ornament:modal:${this.props.id}`;
    }

    // Close event delay, should call after the animation ends
    // Should be the same as closeTimeoutMS in ControlledModal
    this.closeDelay = 200;
  }

  componentDidMount(){
    // Binding events to open / close via external JS
    if(this.props.id) {
      document.addEventListener(`${this.eventPrefix}:open`, this.openModal);
      document.addEventListener(`${this.eventPrefix}:close`, this.closeModal);
      document.addEventListener(`ornament:modal:close-any`, this.closeModal);
    }
  }

  componentWillUnmount(){
    // Unbinding events to open / close via external JS
    if(this.props.id) {
      document.removeEventListener(`${this.eventPrefix}:open`, this.openModal);
      document.removeEventListener(`${this.eventPrefix}:close`, this.closeModal);
      document.removeEventListener(`ornament:modal:close-any`, this.closeModal);
    }
  }

  // =========================================================================
  // Triggering events
  // =========================================================================

  // Safely fire an event if there is an id prop
  // If no id prop, there is no event called
  fireEvent = (eventName) => {
    if(this.props.id) {
      Ornament.triggerEvent(`${this.eventPrefix}:${eventName}`);
    }
  }

  // =========================================================================
  // State Logic
  // =========================================================================

  // Open the modal with lifecycle events
  openModal = () => {
    this.fireEvent("before-open");
    this.setState({
      open: true,
    }, () => {
      if(this.props.afterOpen) {
        this.props.afterOpen();
      }
      this.fireEvent("after-open");
    });
  }

  // Close the modal with lifecycle events
  closeModal = () => {
    this.fireEvent("before-close");
    this.setState({
      open: false,
    }, () => {
      setTimeout(() => {
        if(this.props.afterClose) {
          this.props.afterClose();
        }
        this.fireEvent("after-close");
      }, this.closeDelay);
    });
  }

  // =========================================================================
  // Render
  // =========================================================================

  render(){
    return(
      <ControlledModal
        isOpen={this.state.open}
        onClose={this.closeModal}
        {...this.props}
      />
    )
  }

}