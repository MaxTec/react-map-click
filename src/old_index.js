import React, { Component } from "react";
import PropTypes from "prop-types";
import { filter, includes, some, omit, head } from "lodash";
import AutoSizer from "react-virtualized-auto-sizer";
import Window from "./components/window";
import { setPointOnViewerCenter, fitToViewer, INITIAL_VALUE, ReactSVGPanZoom, zoomOnViewerCenter, TOOL_NONE, TOOL_AUTO } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader, SvgLoaderSelectElement } from "react-svg-pan-zoom-loader";
import ToolTip from "./components/tooltip";
import Developer from "./components/Developer";
import { copyToClipboard } from "./utils/copyToClipboard";
import ToolBarMap from "./components/ToolbarMap";
import Search from "./components/Search";
import { waitForElementToDisplay } from "./utils";
// const
class ReactMapClick extends Component {
  static propTypes = {
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
    // toolTipTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.elementType]),
  };
  // Seteamos props iniciales
  static defaultProps = {
    data: [],
    developer: false,
    tooltipHover: false,
    dark: false,
  };

  state = {
    level: this.props.data.categories[0].id, //cambiar
    data: this.props.data,
    filtered: this.props.data,
    filters: [],
    searchString: "",
    loading: true,
    tool: TOOL_AUTO,
    value: INITIAL_VALUE,
    currentSelect: null,
    developerCoords: {},
    showToolbar: true,
  };
  Viewer = null;
  constructor(props) {
    super(props);
    console.log(props);
    this.ref = React.createRef();
    this.tooltip = React.createRef();
    this.search = React.createRef();
    this.changeTool = this.changeTool.bind(this);
    this.fitToViewer = this.fitToViewer.bind(this);
    this.zoomOnViewerCenter = this.zoomOnViewerCenter.bind(this);
    this.checkboxes = [{ checked: false }, { checked: false }];
    // this.waitForElementToDisplay = this.waitForElementToDisplay.bind(this);
  }
  componentDidMount() {
    if (this.Viewer) {
      this.Viewer.fitToViewer();
    }
    const optionsFilter = Object.keys(omit(this.props.data.levels[0].locations[0], ["id", "id_huerto", "fill"]));
    if (optionsFilter.length > 0) {
      this.setState({
        filters: optionsFilter.map((ele) => {
          return { id: ele, value: ele, isChecked: true };
        }),
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log("termino de actualizar");
    // console.log(prevProps, prevState);
    // if (prevProps.size.width !== this.props.size.width && prevProps.size.width < 1023) {
    //   // this.fitToViewer();
    // }
    // console.log(this.state.level, prevState.level);
  }
  changeTool(nextTool) {
    this.setState({ tool: nextTool });
  }

  changeValue(nextValue) {
    // a	rx	Redimensiona horizontalmente el dibujo.	1
    // d	ry	Redimensiona verticalmente el dibujo	1
    // b	sy	Sesga verticalmente el dibujo	0
    // c	sx	Sesga horizontalmente el dibujo	0
    // e	mx	Mueve horizontalmente el dibujo	0
    // f	my	Mueve verticalmente el dibujo	0
    // scale(a, d)
    // skew(b, c)
    // translate(e, f)
    // console.log(nextValue);
    this.setState({ value: nextValue });
  }
  zoomOnViewerCenter(value) {
    this.setState(
      (state) => ({ value: zoomOnViewerCenter(state.value, value) }),
      () => {
        this.moveTo();
      }
    );
  }

  fitToViewer() {
    this.setState((state) => ({ value: fitToViewer(state.value) }));
  }
  zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    this.setState((state) => {
      return {
        value: setPointOnViewerCenter(state.value, SVGPointX, SVGPointY, scaleFactor),
      };
    });
  };
  // Función para renderizar El Mapa
  getPositionToolTip = (id) => {
    const { value } = this.state;
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = this.tooltip.current ? this.tooltip.current.offsetWidth : 5;
    const tooltipHeight = this.tooltip.current ? this.tooltip.current.offsetHeight : 5;
    // console.log
    if (this.state.currentSelect) {
      const { sizes, x, y } = this.state.currentSelect;
      const padding = parseFloat(window.getComputedStyle(this.tooltip.current, null).getPropertyValue("padding")) || 5;
      const sumX = (x || sizes.x) * zoom;
      const sumY = (y || sizes.y) * zoom;
      let cx = x ? sumX - tooltipWidth / 2 + e : sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cy = y ? sumY - tooltipHeight + f : sumY + (sizes.height * zoom) / 2 - tooltipHeight + padding + f;
      return { left: cx, top: cy };
    }
    return false;
  };
  // Función Solo tiene efecto si se permite scrollWhell
  moveTo = () => {
    console.log("works");
    // if (this.state.tooltip) {
    const { left, top } = this.getPositionToolTip();
    setEstado({
      ...estado,
      tooltip: {
        x: left,
        y: top,
      },
    });
    // }
    // return false;
  };
  showTooltip = (id) => {
    const data = this.findCurrent(id);
    const show = async () => {
      const current = await this.setCurrentToState(id);
      const x = current.x || current.sizes.x;
      const y = current.y || current.sizes.y;
      const zoomScale = this.getZoomScale(current.sizes);
      // Primero debo setear el tamaño del coso
      this.zoomToElement(x, y, zoomScale);
      const { left, top } = this.getPositionToolTip(id);
      this.setState(
        {
          tooltip: {
            x: left,
            y: top,
          },
          //al cambiar con hooks escuchar el cambio
          tool: TOOL_NONE,
        },
        () => {
          if (this.props.onLocationOpened) {
            this.props.onLocationOpened({
              tooltip: {
                x: left,
                y: top,
                data,
              },
            });
          }
          // this.zoomToElement(x, y, 3);
        }
      );
    };
    if (data.category != this.state.level) {
      this.setState(
        {
          currentSelect: null,
          tooltip: null,
          level: data.category,
        },
        () => {
          // La neta no se me ocurrió otra manera que no sea esta o el Settimeout xD
          waitForElementToDisplay(
            id,
            function () {
              show();
            },
            100,
            5000
          );
        }
      );
    } else {
      show();
    }
  };
  findCurrent = (id) => {
    const { data } = this.state;
    const block = head(filter(data.levels, { locations: [{ id: id }] }));
    const target = block.locations.find((ele) => ele.id == id);
    return target;
  };
  // Esto es un tanto engañoso, funciona relativamente, TODO:FIX
  getZoomScale = ({ height, width }) => {
    const AreaItem = parseInt(height) * parseInt(width);
    const AreaITotal = parseInt(this.props.data.mapheight) * parseInt(this.props.data.mapwidth);
    const max = 750;
    const min = 3;
    const formula = (x) => {
      const constante = max / min;
      const res = +(Math.round(x / constante + "e+2") + "e-2");
      return res <= 1 ? 1.5 : res;
    };
    return formula(AreaITotal / AreaItem);
  };
  setCurrentToState = (id, cb) => {
    const element = document.getElementById(id);
    console.log(element);
    const all = document.querySelectorAll("[id^=landmark] > *, svg > #items > *");
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active-location");
    }
    if (!element) {
      alert("Por favor intente de nuevo");
      return false;
    }
    element.classList.add("active-location");
    const getSizes = element.getBBox(); // Necesito un Fallback :c no funciona e IE
    const current = { ...this.findCurrent(id), sizes: getSizes };
    // this.setState({ currentSelect: current }, () => cb(current));
    return new Promise((resolve) => this.setState({ currentSelect: current }, () => resolve(current)));
  };
  printMapa = (mapa) => {
    console.log(mapa);
    // podemos validar si es Móvil o no y asi hacer un preventdefault en el click o en el touchend
    const { data } = this.state;
    const getLevel = data.levels.find((ele) => includes(ele.id, mapa.id));
    const currentWidth = data.mapwidth;
    const extension = getLevel.map.substr(getLevel.map.lastIndexOf(".") + 1).toLowerCase();
    if (extension == "svg") {
      const index = data.categories.findIndex((ele) => ele.id == this.state.level);
      return (
        <ReactSvgPanZoomLoader
          src={getLevel.map}
          proxy={
            <>
              {this.props.data.levels[index].locations.map((ele) => (
                <SvgLoaderSelectElement
                  // class='option-click'
                  selector={"#" + ele.id}
                  fill={ele.fill || "#8e44ad"}
                  // selector='[id^=landmark] > *, svg > #items > *'
                  onClick={(e) => {
                    const { id } = e.target;
                    if (id) this.showTooltip(id);
                  }}
                  onTouchEnd={(e) => {
                    const { id } = e.target;
                    if (id) this.showTooltip(id);
                  }}
                />
              ))}
            </>
          }
          render={(content) => {
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
                ref={(Viewer) => (this.Viewer = Viewer)}
                tool={this.state.tool}
                onChangeTool={(tool) => {
                  console.log(tool);
                  this.changeTool(tool);
                }}
                customToolbar={(props) => {
                  return (
                    <ToolBarMap
                      {...props}
                      changeTool={this.changeTool}
                      show={this.state.showToolbar}
                      fitToViewer={this.fitToViewer}
                      toggle={() => {
                        this.setState({ showToolbar: !this.state.showToolbar });
                      }}
                    />
                  );
                }}
                toolbarProps={{ activeToolColor: "#ffffff" }}
                value={this.state.value}
                detectWheel={this.state.tooltip ? false : true}
                // Ya no se necesita, inhabilito PAN cuando existe un Tooltip abierto
                // onPan={(pan) => {
                //   this.setState({ value: pan }, () => this.moveTo(pan));
                // }}
                // onZoom={(zoom) => {
                //   console.log(zoom);
                //   this.setState({ value: zoom }, () => this.moveTo(zoom));
                // }}
                onChangeValue={(value) => this.changeValue(value)}
                // onTouchEnd={(value) => {
                //   console.log(value);
                //   return this.changeValue(value);
                // }}
                onMouseMove={(event) => {
                  const { x, y } = event;
                  if (!this.props.developer) {
                    return false;
                  }
                  this.setState({ developerCoords: { x: x.toFixed(4), y: y.toFixed(4) } });
                }}
                /* Habilitar solamente si modo desarrollo esta habiltado
                por el momento */
                onClick={(event) => {
                  console.log(event.originalEvent);
                  if (this.props.developer) {
                    const node = this.ref.current;
                    copyToClipboard(node);
                    console.log(node);
                  }
                }}
                // Necesarios para Trabajar bien
                width={1000}
                height={parseInt(currentWidth) * 0.75}
                customMiniature={(props) => {
                  return <div style={{ position: "absolute", left: 0, zIndex: 900, width: "90px", height: "100px" }}>{props.children}</div>;
                }}
                // miniatureProps={{ position: "left", background: "green", width: 90, height: 70, border: "0px" }}
              >
                <svg width={parseInt(data.mapwidth)} height={parseInt(data.mapheight)}>
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
  renderMap = () => {
    const { data, level } = this.state;
    const currentMap = data.categories.find((ele) => ele.id == level);
    // Elegir entre mi template y el pasado por props
    const Template = this.props.toolTipTemplate ? React.cloneElement(this.props.toolTipTemplate, this.state.currentSelect) : null;
    return (
      <div className='window' style={{ position: "relative", overflow: "hidden" }}>
        <select
          value={this.state.level}
          onChange={(e) => {
            const { value } = e.target;
            this.setState(
              {
                currentSelect: null,
                tooltip: null,
                level: value,
              },
              () => {
                this.fitToViewer();
              }
            );
            console.log(value);
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
        {this.printMapa(currentMap)}
        {this.props.developer && <Developer ref={this.ref} data={this.state.developerCoords} />}
        <ToolTip
          className='tooltip'
          ref={this.tooltip}
          closeTooltip={() => {
            const element = document.getElementById(this.state.currentSelect.id);
            element.classList.remove("active-location");
            this.setState({ currentSelect: null, tooltip: null, tool: TOOL_AUTO }, () => this.fitToViewer());
          }}
          style={{
            // transition: "all 5s ease-in-out",
            // transform: `scale(${this.state.value.a})`,
            opacity: `${this.state.tooltip ? 100 : 0} `,
            visibility: `${this.state.tooltip ? "visible" : "hidden"} `,
            position: "absolute",
            left: this.state.tooltip ? `${this.state.tooltip.x}px` : 0,
            top: this.state.tooltip ? `${this.state.tooltip.y}px` : 0,
            // animation: "bounce 1s",
          }}
        >
          {Template}
        </ToolTip>
      </div>
    );
  };
  handleCheckChieldElement = (event) => {
    let filters = this.state.filters;
    filters.forEach((item) => {
      const length = this.state.filters.filter((ele) => ele.isChecked == true).map((ele) => ele.value);
      if (item.value === event.target.value) item.isChecked = length.length > 1 ? event.target.checked : true;
    });
    this.setState({ filters: filters });
    // this.search.current.click();
  };

  render() {
    const { theme, dark } = this.props;
    const { loading, data, filtered } = this.state;
    return (
      <div style={{ marginLeft: "100px", display: "block", height: data.mapheight }}>
        {loading && (
          <Window theme={theme ? theme : undefined} dark>
            <div style={{ display: "flex", maxHeight: "100%" }}>
              <div className='body' style={{ position: "relative" }}>
                {this.renderMap()}
                <div className='test'>
                  <button
                    onClick={() => {
                      this.Viewer.reset();
                      if (this.state.currentSelect) {
                        // TODO Create RemoveToolTip
                        const element = document.getElementById(this.state.currentSelect.id);
                        element.classList.remove("active-location");
                        this.setState(
                          {
                            currentSelect: null,
                            tooltip: null,
                            tool: TOOL_AUTO,
                          },
                          () => {
                            this.fitToViewer();
                          }
                        );
                      }
                    }}
                    style={{ position: "absolute", top: 0, right: 0, zIndex: 999 }}
                  >
                    RESET ZOOM
                  </button>
                  <button
                    style={{ position: "absolute", top: 25, right: 0, zIndex: 999 }}
                    disabled={this.state.value.a && parseFloat(this.state.value.a.toFixed(2)) >= 1.9}
                    onClick={(e) => {
                      if (parseFloat(this.state.value.a.toFixed(2)) <= 1.9) {
                        console.log(parseFloat(this.state.value.a.toFixed(2)));
                        this.zoomOnViewerCenter(1.1);
                        e.preventDefault();
                      }
                    }}
                  >
                    ZOOM IN
                  </button>
                  <button
                    style={{ position: "absolute", top: 45, right: 0, zIndex: 999 }}
                    disabled={this.state.value.a && parseFloat(this.state.value.a.toFixed(2)) <= 1.1}
                    onClick={(e) => {
                      if (parseFloat(this.state.value.a.toFixed(2)) >= 1.1) {
                        this.zoomOnViewerCenter(0.9);
                        e.stopPropagation();
                      }
                    }}
                  >
                    ZOOM OUT
                  </button>
                </div>
              </div>
              <Search
                data={data}
                filtered={filtered}
                showTooltip={(id) => {
                  this.showTooltip(id);
                }}
                changeBlock={(value) => {
                  this.setState(
                    {
                      currentSelect: null,
                      tooltip: null,
                      level: value,
                    },
                    () => {
                      this.fitToViewer();
                    }
                  );
                }}
                filters={this.state.filters}
                handleCheckChieldElement={this.handleCheckChieldElement}
              />
            </div>
          </Window>
        )}
      </div>
    );
  }
}
export default ReactMapClick;
