import React from "react";

/*

  RatioSizer

  Props
  -----

  Ratio: String, eg: "1x2", "800x600", "16x9"

  Usage
  -----

  <RatioSizer ratio="16x9">
    <iframe .../>
  </RatioSizer>

*/

export default class RatioSizer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
    }
    this.ratio = this.calculateRatio();
  }

  componentDidMount(){
    this.setSize();
    window.addEventListener("resize", this.setSize);
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.setSize);
  }

  calculateRatio = () => {
    const ratioArray = this.props.ratio.split("x").map(number => parseInt(number));
    return ratioArray[1] / ratioArray[0];
  }

  setSize = () => {
    window.requestAnimationFrame(() => {
      // Reset
      this.element.style.width = "";
      this.element.style.height = "";

      // Get current width and calculate new height
      const currentWidth = this.element.offsetWidth;
      const newHeight = currentWidth * this.ratio;
      this.element.style.height = newHeight + "px";

      // Needs to scale the other way if the height of the element is smaller than the new height
      const actualHeight = this.element.offsetHeight;
      console.log(actualHeight, newHeight);

      if(actualHeight < newHeight) {
        const newWidth = actualHeight / this.ratio;
        this.element.style.height = actualHeight + "px";
        this.element.style.width = newWidth + "px";
      }
    });
  }

  render(){
    return(
      <div className="embed__react-ratio" ref={el => this.element = el}>
        {this.props.children}
      </div>
    )
  }

}