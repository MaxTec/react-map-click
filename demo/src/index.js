import React, { Component } from "react";
import { render } from "react-dom";
import DOMPurify from "dompurify";

import ReactMapClick from "../../src";

import data from "./terreno.json";

export default class Demo extends Component {
  render() {
    return (
      <ReactMapClick
        dark
        tooltip={false}
        tooltipHover={true}
        onLocationOpened={(ele) => {
          console.log(ele);
        }}
        // onFinishLoad={() => {
        //   console.log("termino de cargar El Mapa :)");
        // }}
        data={data}
        // theme={{ primaryColor: "green" }}
      />
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
