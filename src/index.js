import React, { useRef, useState, useEffect } from "react";
import { ReactSvgPanZoomLoader, SvgLoaderSelectElement } from "react-svg-pan-zoom-loader";
// import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, fitSelection, zoomOnViewerCenter, fitToViewer } from "react-svg-pan-zoom";
import { setPointOnViewerCenter, fitSelection, fitToViewer, INITIAL_VALUE, ReactSVGPanZoom, zoomOnViewerCenter, TOOL_NONE, TOOL_AUTO } from "react-svg-pan-zoom";
import { filter, includes, some, omit, head, isEmpty, set } from "lodash";

import PropTypes from "prop-types";
import Window from "./components/window";
import ToolTip from "./components/tooltip";
import useStateCallback from "./hooks/useStateCallback";
import Search from "./components/Search";
import { waitForElementToDisplay } from "./utils";
// import Empty from "./components/Empty";

const ReactMapClick = (props) => {
  const Viewer = useRef(null);
  const Tooltip = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useStateCallback(INITIAL_VALUE);
  const [estado, setEstado] = useState({
    level: props.data.categories[0].id,
    data: props.data,
    filtered: props.data,
    filters: [],
    searchString: "",
    loading: true,
    currentSelect: null,
    developerCoords: {},
    showToolbar: true,
  });

  useEffect(() => {
    Viewer.current.fitToViewer();
    const optionsFilter = Object.keys(omit(props.data.levels[0].locations[0], ["id", "id_huerto", "fill"]));
    if (optionsFilter.length > 0) {
      setEstado({
        ...estado,
        filters: optionsFilter.map((ele) => {
          return { id: ele, value: ele, isChecked: true };
        }),
      });
    }
  }, []);
  useEffect(() => {
    // console.log("HAY UN CAMBIO EN F o E (horizontal o vertical");
    if (value.f || value.e) {
      moveTo();
    }
  }, [value.f, value.e]);
  useEffect(() => {
    _fitToViewer1();
  }, [estado.level]);
  useEffect(() => {
    console.log("ESTADO USEFECT");
    console.log(estado);

    if (estado.currentSelect) {
      const element = checkElementExist(estado.currentSelect.id);
      // if (!element) return false;
      const getSizes = element.getBBox(); // Necesito un Fallback :c no funciona e IE
      console.log(getSizes);
      const x = estado.currentSelect.x || getSizes.x;
      const y = estado.currentSelect.y || getSizes.y;
      const zoomScale = getZoomScale(getSizes);
      zoomToElement(x, y, zoomScale);
    }
  }, [estado.currentSelect]);
  console.log(process.env.PUBLIC_URL);
  /* Read all the available methods in the documentation */
  const _zoomOnViewerCenter1 = () => Viewer.current.zoomOnViewerCenter(1.2);
  const _fitSelection1 = () => Viewer.current.fitSelection(40, 40, 200, 200);
  const _fitToViewer1 = () => Viewer.current.fitToViewer();

  /* keep attention! handling the state in the following way doesn't fire onZoom and onPam hooks */
  const _zoomOnViewerCenter2 = () => setValue(zoomOnViewerCenter(value, 1.1));
  const _fitSelection2 = () => setValue(fitSelection(value, 40, 40, 200, 200));
  const _fitToViewer2 = () => setValue(fitToViewer(value));

  const printMapa = (mapa) => {
    // podemos validar si es Móvil o no y asi hacer un preventdefault en el click o en el touchend
    const { data } = props;
    const getLevel = data.levels.find((ele) => includes(ele.id, mapa.id));
    const currentWidth = data.mapwidth;
    const extension = getLevel.map.substr(getLevel.map.lastIndexOf(".") + 1).toLowerCase();
    if (extension == "svg") {
      const index = data.categories.findIndex((ele) => ele.id == estado.level);
      return (
        <ReactSvgPanZoomLoader
          src={getLevel.map}
          proxy={
            <>
              {/* <SvgLoaderSelectElement
                selector='svg'
                width={props.data.mapwidth + "px"}
                height={props.data.mapheight + "px"}
                onElementSelected={(svgnode) => {
                  console.log(svgnode);
                }}
              /> */}
              {props.data.levels[index].locations.map((ele) => (
                <SvgLoaderSelectElement
                  selector={"#" + ele.id}
                  fill={ele.fill || "#8e44ad"}
                  // para Desktop
                  // Se puede hacer una deteccion de UserAgent
                  onClick={(e) => {
                    const { id } = e.target;
                    if (id) showTooltip(id);
                  }}
                  // para movil
                  // onTouchEnd={(e) => {
                  //   const { id } = e.target;
                  //   if (id) showTooltip(id);
                  // }}
                />
              ))}
            </>
          }
          render={(content) => {
            //   console.log
            return (
              <ReactSVGPanZoom
                scaleFactorMax={2}
                detectAutoPan={false}
                scaleFactor={1}
                scaleFactorMin={1}
                disableDoubleClickZoomWithToolAuto={true}
                SVGBackground='transparent'
                // style={{ transition: "all 1s ease-in-out" }}
                className='map-container'
                SVGStyle={{ transition: "transform 1s ease-in-out" }}
                // background='red'
                id='viewer1'
                ref={Viewer}
                tool={tool}
                onChangeTool={(tool) => {
                  setTool(tool);
                }}
                // customToolbar={(props) => {
                //   return (
                //     <ToolBarMap
                //       {...props}
                //       changeTool={this.changeTool}
                //       show={estado.showToolbar}
                //       fitToViewer={this.fitToViewer}
                //       toggle={() => {
                //         this.setState({ showToolbar: !estado.showToolbar });
                //       }}
                //     />
                //   );
                // }}
                // toolbarProps={{ activeToolColor: "#ffffff" }}
                value={value}
                detectWheel={estado.tooltip ? false : true}
                // Ya no se necesita, inhabilito PAN cuando existe un Tooltip abierto
                // onPan={(pan) => {
                //   this.setState({ value: pan }, () => this.moveTo(pan));
                // }}
                // onZoom={(zoom) => {
                //   console.log(zoom);
                //   this.setState({ value: zoom }, () => this.moveTo(zoom));
                // }}
                // onChangeValue={(value) => this.changeValue(value)}
                onChangeValue={setValue}
                // onTouchEnd={(value) => {
                //   console.log(value);
                //   return this.changeValue(value);
                // }}
                onMouseMove={(event) => {
                  const { x, y } = event;
                  if (!props.developer) {
                    return false;
                  }
                  //   this.setState({ developerCoords: { x: x.toFixed(4), y: y.toFixed(4) } });
                }}
                /* Habilitar solamente si modo desarrollo esta habiltado
                por el momento */
                onClick={(event) => {
                  console.log(event.originalEvent);
                  if (props.developer) {
                    const node = this.ref.current;
                    copyToClipboard(node);
                    console.log(node);
                  }
                }}
                // Necesarios para Trabajar bien
                width={props.data.mapwidth}
                height={props.data.mapheight}
                // customMiniature={(props) => {
                //   return <div style={{ position: "absolute", left: 0, zIndex: 900, width: "90px", height: "100px" }}>{props.children}</div>;
                // }}
                // miniatureProps={{ position: "left", background: "green", width: 90, height: 70, border: "0px" }}
              >
                <svg width={props.data.mapwidth} height={props.data.mapheight}>
                  {content}
                </svg>
              </ReactSVGPanZoom>
            );
          }}
        />
      );
    } else {
      console.log(extension + "No esta permitido todavía");
    }
  };
  const renderMap = () => {
    const { data, level } = estado;
    const currentMap = data.categories.find((ele) => ele.id == level);
    const Template = props.toolTipTemplate ? React.cloneElement(props.toolTipTemplate, estado.currentSelect) : null;
    return (
      <div className='window' style={{ position: "relative", overflow: "hidden" }}>
        <select
          value={estado.level}
          onChange={(e) => {
            const { value } = e.target;
            setEstado(
              {
                ...estado,
                currentSelect: null,
                tooltip: null,
                level: value,
              }
              // () => {
              //   _fitToViewer1();
              // }
            );
          }}
        >
          {data.categories &&
            data.categories.length > 1 &&
            data.categories.map((ele, index) => {
              return (
                <option key={index} value={ele.id}>
                  {ele.title}
                </option>
              );
            })}
        </select>
        {printMapa(currentMap)}
        {props.developer && <Developer ref={this.ref} data={estado.developerCoords} />}
        <ToolTip
          className='tooltip'
          ref={Tooltip}
          closeTooltip={() => {
            const element = document.getElementById(estado.currentSelect.id);
            element.classList.remove("active-location");
            setEstado(
              (prev) => {
                return { ...prev, currentSelect: null, tooltip: null, tool: TOOL_AUTO };
              }
              // () => {
              //   _fitToViewer1();
              // }
            );
          }}
          style={{
            // transition: "all 5s ease-in-out",
            // transform: `scale(${estado.value.a})`,
            opacity: `${estado.tooltip ? 100 : 0} `,
            visibility: `${estado.tooltip ? "visible" : "hidden"} `,
            position: "absolute",
            left: estado.tooltip ? `${estado.tooltip.x}px` : 0,
            top: estado.tooltip ? `${estado.tooltip.y}px` : 0,
            // animation: "bounce 1s",
          }}
        >
          {Template}
        </ToolTip>
      </div>
    );
  };
  const showTooltip = (id) => {
    // console.log(id);
    waitForElementToDisplay(
      id,
      () => {
        console.log("SE EJCUTA EL CALBACK");
        setCurrentToState(id);
      },
      1000,
      5000
    );
    // setCurrentToState(id);
  };
  const findCurrent = (id) => {
    const { data } = estado;
    const block = head(filter(data.levels, { locations: [{ id: id }] }));
    const target = block.locations.find((ele) => ele.id == id);
    return target;
  };
  const getZoomScale = ({ height = 100, width = 100 }) => {
    const AreaItem = parseInt(height) * parseInt(width);
    const AreaITotal = parseInt(props.data.mapheight) * parseInt(props.data.mapwidth);
    const max = 750;
    const min = 3;
    const formula = (x) => {
      const constante = max / min;
      const res = +(Math.round(x / constante + "e+2") + "e-2");
      return res <= 1 ? 1.5 : res;
    };
    return formula(AreaITotal / AreaItem);
  };
  // funcion que actualiza el estado con el Item que se ha clickeado
  const checkElementExist = (id) => {
    console.log(id);
    const element = document.getElementById(id);
    // waitForElementToDisplay;
    console.log(element);

    if (!element) {
      // cons
      alert("Por favor intente de nuevo");
      return false;
    }
    const all = document.querySelectorAll("[id^=landmark] > *, svg > #items > *");
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active-location");
    }
    element.classList.add("active-location");
    return element;
  };
  const setCurrentToState = (id) => {
    // console.log(id);
    // const element = checkElementExist(id);
    // if (!element) return false;
    // // const getSizes = element.getBBox(); // Necesito un Fallback :c no funciona e IE
    const current = { ...findCurrent(id), id };
    // console.log(current);
    // un aproximado de donde ce centrara el tooltip
    // const x = current.x || current.sizes.x;
    // const y = current.y || current.sizes.y;
    // const zoomScale = getZoomScale(current.sizes);
    // console.log("ESTADO");
    // console.log(estado);
    setEstado({ ...estado, currentSelect: current });
    // return new Promise((resolve) => {
    //   setEstado({ ...estado, currentSelect: current }, () => {
    //     zoomToElement(x, y, zoomScale);
    //     resolve(current);
    //   });
    // });
  };
  const zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    return setValue(setPointOnViewerCenter(value, SVGPointX, SVGPointY, scaleFactor));
  };
  const moveTo = () => {
    const { left, top } = getPositionToolTip();
    setEstado({
      ...estado,
      tooltip: {
        x: left,
        y: top,
      },
    });
    return false;
  };
  const getPositionToolTip = () => {
    console.log(value);
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    console.log(zoom);
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = Tooltip.current ? Tooltip.current.offsetWidth : 5;
    const tooltipHeight = Tooltip.current ? Tooltip.current.offsetHeight : 5;
    // console.log
    if (estado.currentSelect) {
      const { x, y, id } = estado.currentSelect;
      const element = checkElementExist(id);
      if (!element) return false;
      const sizes = element.getBBox();
      console.log(sizes);
      const padding = parseFloat(window.getComputedStyle(Tooltip.current, null).getPropertyValue("padding")) || 5;
      console.log("padding es: " + padding);
      const sumX = (x || sizes.x) * zoom;
      const sumY = (y || sizes.y) * zoom;
      let cx = x ? sumX - tooltipWidth / 2 + e : sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cy = y ? sumY - tooltipHeight + f : sumY + (sizes.height * zoom) / 2 - tooltipHeight + padding + f;
      console.log({ left: cx, top: cy });
      return { left: cx, top: cy };
    }
    return false;
  };
  const { theme } = props;
  return (
    <div>
      {/* <button className='btn' onClick={() => _zoomOnViewerCenter1()}>
        Zoom on center (mode 1)
      </button>
      <button className='btn' onClick={() => _fitSelection1()}>
        Zoom area 200x200 (mode 1)
      </button>
      <button className='btn' onClick={() => _fitToViewer1()}>
        Fit (mode 1)
      </button>
      <hr />

      <button className='btn' onClick={() => _zoomOnViewerCenter2()}>
        Zoom on center (mode 2)
      </button>
      <button className='btn' onClick={() => _fitSelection2()}>
        Zoom area 200x200 (mode 2)
      </button>
      <button className='btn' onClick={() => _fitToViewer2()}>
        Fit (mode 2)
      </button>
      <hr /> */}
      <Window theme={theme ? theme : undefined} dark>
        {/* {renderMap()} */}
        <div style={{ display: "flex", maxHeight: "100%" }}>
          <div className='body' style={{ position: "relative" }}>
            {renderMap()}
            <div className='test'>
              {/* <button
                onClick={() => {
                  Viewer.reset();
                  // if (this.state.currentSelect) {
                  //   // TODO Create RemoveToolTip
                  //   const element = document.getElementById(this.state.currentSelect.id);
                  //   element.classList.remove("active-location");
                  //   this.setState(
                  //     {
                  //       currentSelect: null,
                  //       tooltip: null,
                  //       tool: TOOL_AUTO,
                  //     },
                  //     () => {
                  //       this.fitToViewer();
                  //     }
                  //   );
                  // }
                }}
                style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}
              >
                RESET ZOOM
              </button> */}
              {/* <button
                style={{ position: "absolute", top: 25, right: 0, zIndex: 999 }}
                disabled={value.a && parseFloat(value.a.toFixed(2)) >= 1.9}
                onClick={(e) => {
                  if (parseFloat(value.a.toFixed(2)) <= 1.9) {
                    console.log(parseFloat(value.a.toFixed(2)));
                    _zoomOnViewerCenter1();
                    e.preventDefault();
                  }
                }}
              >
                ZOOM IN
              </button> */}
              {/* <button
                style={{ position: "absolute", top: 45, right: 0, zIndex: 999 }}
                disabled={value.a && parseFloat(value.a.toFixed(2)) <= 1.1}
                onClick={(e) => {
                  if (parseFloat(value.a.toFixed(2)) >= 1.1) {
                    zoomOnViewerCenter(0.9);
                    e.stopPropagation();
                  }
                }}
              >
                ZOOM OUT
              </button> */}
            </div>
          </div>
          <Search
            data={estado.data}
            filtered={estado.filtered}
            level={estado.level}
            showTooltip={(id) => {
              showTooltip(id);
            }}
            changeBlock={(value, id) => {
              setEstado({
                ...estado,
                currentSelect: null,
                tooltip: null,
                level: value,
              });
              setTimeout(() => {
                showTooltip(id);
              }, 300);
            }}
            filters={estado.filters}
            // handleCheckChieldElement={this.handleCheckChieldElement}
          />
        </div>
      </Window>
    </div>
  );
};

ReactMapClick.propTypes = {
  /**
     * source: path/to/the/jsonFile,
     * selector: '[id^=landmark] > *, svg > #items > *',
     * csv: Soporte XLS files,
     * landmark: false,
     * height: Altura default Window,
     * portrait: Ancho default Window,
     * minimap: aparece u oculta mini Mapa, (fusionar con configuraciones de Libreria)
     * sidebar: Mostrar o no SideBar,
     * hidenofilter: false,
     * search: Mostrar u ocultar Busqueda,
     * searchfields: 'Campos de busqueda',
     * clearbutton:  Mostrar u ocultar Boton Limpiar,
     * zoombuttons:  Mostrar u ocultar Botones de zoom (fusionar con configuraciones de Libreria),
     * zoomoutclose: Mostrar u ocultar Botones de zoom (fusionar con configuraciones de Libreria),
     * closezoomout: Mostrar u ocultar Botones de zoom (fusionar con configuraciones de Libreria),
     * maxscale: Escala Maxima(merge library) |number,
     * zoom: true,
     * zoommargin: 200,
     * developer: false
     * action:Default - use the global default action defined on the Settings panel.
            Tooltip - open the tooltip with More button redirecting Link.
            Open link - opening Link in the same tab.
            Open link in new tab - opening Link in new tab.
            Lightbox - use the lightbox as popup.
            Image - show 'image' in lightbox
            Reveal - zoom and reveal children
            None - do nothing but zoom to the location.
            Disabled - no action
     * linknewtab: Abrir en una nueva Ventana,
     * hovertip: Mostrar Hover,
     * marker: 'default',
     * fullscreen: Habilitar FullScreen,
     * mousewheel: Habilitar MouseWheel (probar),
     * alphabetic: Ordernar Alfabeticamente (bol),
     * theme:tema del Plugin | object
     */
  theme: PropTypes.exact({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    fontSize: PropTypes.string,
    body: PropTypes.string,
  }),
  zoomConfig: PropTypes.object,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onLocationOpened: PropTypes.func,
  tooltipHover: PropTypes.bool,
};

// Same approach for defaultProps too
ReactMapClick.defaultProps = {
  data: [],
  developer: false,
  tooltipHover: false,
  dark: false,
};

export default ReactMapClick;
