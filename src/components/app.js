import React, { Component } from "react";
import PropTypes from "prop-types";
import Window from "./window";
import { fitSelection, zoom, setPointOnViewerCenter, fitToViewer, INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, zoomOnViewerCenter } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader, SvgLoaderSelectElement } from "react-svg-pan-zoom-loader";
import { withSize } from "react-sizeme";
import ToolTip from "../components/tooltip";
class App extends Component {
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
  };
  // Seteamos props iniciales
  static defaultProps = {
    data: [],
    developer: false,
    // currentSelect: null
    // tooltip: {}
  };

  state = {
    level: this.props.data.levels[0].id, //cambiar
    data: this.props.data,
    loading: true,
    tool: TOOL_NONE,
    value: INITIAL_VALUE,
    currentSelect: null,
  };
  Viewer = null;
  constructor(props) {
    super(props);
    console.log(props);
    // this.printMapa=this.printMapa.bind(this)
  }
  componentDidMount() {
    // console.log("SE EJECUTA :)");
    this.fitToViewer();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.size.width !== this.props.size.width && prevProps.size.width < 1023) {
      this.fitToViewer();
    }
  }
  changeTool(nextTool) {
    this.setState({ tool: nextTool });
  }

  changeValue(nextValue) {
    // scale(a, d)
    // skew(b, c)
    // translate(e, f)
    // console.log(nextValue);
    this.setState({ value: nextValue });
  }
  zoomOnViewerCenter() {
    this.setState((state) => ({ value: zoomOnViewerCenter(state.value, 1.1) }));
  }

  fitToViewer() {
    this.setState((state) => ({ value: fitToViewer(state.value) }));
  }
  zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    return new Promise((resolve) =>
      this.setState(
        (state) => ({
          value: setPointOnViewerCenter(state.value, SVGPointX - 10, SVGPointY - 10, scaleFactor),
        }),
        () => resolve()
      )
    );
  };
  // Funcion para renderizar El Mapa
  getPositionToolTip = (id) => {
    const { value } = this.state;
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinamico
    const toltipWidth = 75;
    const toltipHeight = 80;
    if (this.state.currentSelect) {
      const { sizes } = this.state.currentSelect;
      console.log(sizes);
      /* Regresa la posicion relativa del Elemento con respecto al contenedor del SVG*/
      const padding = 5;
      let cx = sizes.x * zoom + (sizes.width * zoom) / 2 - toltipWidth + padding + e;
      let cy = sizes.y * zoom + (sizes.height * zoom) / 2 - toltipHeight + padding + f;

      return { left: cx, top: cy };
    }
    return false;
  };
  // Funcion Solo tiene efecto si se pernmite scrollWhell
  moveTo = (zoom) => {
    if (this.state.tooltip) {
      const { left, top } = this.getPositionToolTip();
      console.log(left, top);
      this.setState({
        tooltip: {
          x: left,
          y: top,
        },
      });
    }
    return false;
  };
  showToltip = (id) => {
    // TODO: Crear funcion que devuelva los puntos del elemento clinkeado
    // const { id } = event.target;
    const { x, y } = this.findCurrent(id);
    this.setCurrentToState(id, () => {
      this.zoomToElement(x, y, 3).then((e) => {
        const { left, top } = this.getPositionToolTip(id);
        this.setState({
          tooltip: {
            x: left,
            y: top,
          },
        });
      });
    });
  };
  findCurrent = (id) => {
    const { data } = this.state;
    const index = this.state.data.levels.findIndex((ele) => ele.id == this.state.level);
    let target = data.levels[index].locations.find((ele) => ele.id == id);
    return target;
  };
  setCurrentToState = (id, cb) => {
    const element = document.getElementById(id);
    const getSizes = element.getBBox(); // Necesito un Fallback :c no funciona e IE
    const current = { ...this.findCurrent(id), sizes: getSizes };
    this.setState({ currentSelect: current }, () => cb());
  };
  developer = (cords, element) => {
    const id = element.originalEvent.target.id;
    const { developerCallback } = this.props;
    const { data } = this.state;
    console.log(cords);
    if (!id) {
      // condicion muy ambigua, otro elemento podria contener un ID
      // TODO: Crear elemento alert personalizado
      alert("Por favor haga click sobre un elemento Valido");
      return false;
    }
    if (!!developerCallback) {
      developerCallback(cords, id);
      // si se cumple la promesa...
    }
    // Cnstruye el nuevo Objeto
    let item = data.levels.find((ele) => ele.id == this.state.level);
    const { left, top } = this.getPositionToolTip(cords.x, cords.y, element.originalEvent);
    let locations = item.locations.map((ele) => {
      if (ele.id == id) {
        return { ...ele, x: left, y: top };
      }
      return ele;
    });
    item.locations = locations;
    const index = this.state.data.levels.findIndex((ele) => ele.id == this.state.level);
    const newLocations = data.levels;
    newLocations[index] = item;
    this.setState({
      data: {
        ...this.state.data,
        levels: newLocations,
      },
    });
  };
  printMapa = (mapa) => {
    const { size } = this.props;
    const { data } = this.state;
    const currentWidth = size.width < parseInt(data.mapwidth) ? size.width : data.mapwidth;
    const extension = mapa.map.substr(mapa.map.lastIndexOf(".") + 1).toLowerCase();
    let name = mapa.title.split(" ")[1];
    if (extension == "svg") {
      return (
        <ReactSvgPanZoomLoader
          src={`http://localhost:8081/mapas/mz${name}.svg`}
          proxy={
            <>
              {/* Dos maneras, Le paso el objeto de una vez o le paso el evento y consigo el id */}
              <SvgLoaderSelectElement
                class='option-click'
                selector='[id^=landmark] > *, svg > #items > *'
                onClick={(e) => {
                  const { id } = e.target;
                  if (id) this.showToltip(id);
                  // if (this.props.developer) this.developer()
                }}
              />
              {/* {mapa.locations.map(ele => (
                <SvgLoaderSelectElement
                  class="option-click"
                  // key={ele.id}
                  selector={`#${ele.id}`}
                  onClick={e => this.showToltip(ele)}
                />
              ))} */}
            </>
          }
          render={(content) => (
            <ReactSVGPanZoom
              scaleFactorMax={3}
              detectAutoPan={false}
              scaleFactor={1}
              scaleFactorMin={1}
              SVGBackground='transparent'
              style={{ transition: "all 1s ease-in-out" }}
              className='test'
              // SVGStyle={{ transition: "all 1s ease-in-out" }}
              background='red'
              ref={(Viewer) => (this.Viewer = Viewer)}
              tool={this.state.tool}
              onChangeTool={(tool) => this.changeTool(tool)}
              value={this.state.value}
              detectWheel={this.state.tooltip ? false : true}
              onPan={(pan) => {
                this.setState({ value: pan }, () => this.moveTo(pan));
              }}
              onZoom={(zoom) => {
                this.setState({ value: zoom }, () => this.moveTo(zoom));
              }}
              onChangeValue={(value) => this.changeValue(value)}
              // onMouseMove={event => console.log(event.x, event.y)}
              /* Habilitar solamente si modo desarrollo esta habiltado
              por el momento */
              onClick={
                (event) => console.log(event.x, event.y)
                // this.developer({ x: event.x, y: event.y }, event)
              }
              width={parseInt(currentWidth)}
              height={parseInt(currentWidth) * 0.75}
            >
              <svg width={parseInt(data.mapwidth)} height={parseInt(data.mapheight)}>
                {content}
              </svg>
            </ReactSVGPanZoom>
          )}
        />
      );
    } else {
      console.log(extension + " not supported yet :(");
    }
  };
  renderMap = () => {
    const { onFinishLoad } = this.props;
    const { data } = this.state;
    return (
      <div className='window' style={{ position: "relative", overflow: "hidden" }}>
        {/* Solo mostramos el primero */}
        {data.levels &&
          data.levels.map((ele, index, array) => {
            if (ele.id == this.state.level) {
              return this.printMapa(ele);
            }
            if (!!onFinishLoad && index == array.length - 1) {
              //termino de Cargar el mapa :)
              onFinishLoad();
            }
          })}
        {/* { && ( */}
        <ToolTip
          closeTooltip={() => {
            this.setState({ currentSelect: null, tooltip: null }, () => this.fitToViewer());
          }}
          style={{
            display: `${this.state.tooltip ? "block" : "none"} `,
            // transform: `scale(${this.state.value.a})`,
            position: "absolute",
            left: this.state.tooltip ? `${this.state.tooltip.x}px` : 0,
            top: this.state.tooltip ? `${this.state.tooltip.y}px` : 0,
          }}
        >
          lokishadhewroikera ewrqiugearou reqoiugre
        </ToolTip>
        // )}
      </div>
    );
  };
  render() {
    const { theme } = this.props;
    const { loading, data } = this.state;
    return (
      <div style={{ marginLeft: "100px", display: "block" }}>
        {loading && (
          <Window theme={theme ? theme : undefined}>
            {/* Componente Select */}
            {/* Este contenedor debe estar en el Layout */}
            <div style={{ display: "flex" }}>
              {/* {this.props.developer && (
                <div className="developer">
                  <pre style={{ width: 400, whiteSpace: "normal" }}>
                    {JSON.stringify(
                      data.levels.find(ele => ele.id == this.state.level)
                    )}
                  </pre>
                </div>
              )} */}
              <div className='body'>
                <select
                  onChange={(e) => {
                    const { value } = e.target;
                    this.setState({
                      level: value,
                    });
                    console.log(value);
                  }}
                >
                  {data.levels &&
                    data.levels.map((ele, index) => {
                      return (
                        <option key={index} value={ele.id}>
                          {ele.title}
                        </option>
                      );
                    })}
                </select>
                {this.renderMap()}
              </div>
            </div>
          </Window>
        )}
      </div>
    );
  }
}
const withSizeHOC = withSize({
  monitorHeight: true,
});
export default withSizeHOC(App);
