import React, { Component } from "react";
import { render } from "react-dom";
import DOMPurify from "dompurify";

import ReactMapClick from "../../src";
import data from "./terreno.json";
const Template2 = ({ title, about, category, description, ...props }) => {
  console.log(props);
  return (
    <ul>
      <li>titulo:{title || "N/A"}</li>
      {about && <li>about:{<div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about) }}></div>}</li>}
      <li>category:{category}</li>
      {/* only accepts strings */}
      <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}></div>
      {/* <li>description:{<div className="content" dangerouslySetInnerHTML={{__html: thisIsMyCopy}}></div>}</li> */}
    </ul>
  );
};

export default class Demo extends Component {
  render() {
    return (
      <ReactMapClick
        developer={true}
        // developerCallback={(coordenadas, id) => {
        //   console.log(coordenadas, id);
        // }}
        // mapPath=""
        dark
        tooltip={false}
        tooltipHover={true}
        toolTipTemplate={<Template2 />}
        onLocationOpened={(ele) => {
          console.log(ele);
        }}
        // onFinishLoad={() => {
        //   console.log("termino de cargar El Mapa :)");
        // }}
        data={data}
        theme={{ primaryColor: "green" }}
      />
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
