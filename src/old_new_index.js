import { useWindowSize } from '@react-hook/window-size';
import { filter, head, includes, omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
// import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, fitSelection, zoomOnViewerCenter, fitToViewer } from "react-svg-pan-zoom";
import {
  fitSelection,
  fitToViewer,
  INITIAL_VALUE,
  ReactSVGPanZoom,
  setPointOnViewerCenter,
  TOOL_AUTO,
  TOOL_NONE,
  zoomOnViewerCenter,
} from 'react-svg-pan-zoom';
import {
  ReactSvgPanZoomLoader,
  SvgLoaderSelectElement,
} from 'react-svg-pan-zoom-loader';

import Developer from './components/Developer';
import Search from './components/Search';
import ToolTip from './components/tooltip';
import Window from './components/window';
import useStateCallback from './hooks/useStateCallback';
import { copyToClipboard } from './utils/copyToClipboard';

const ReactMapClick = (props) => {
  const Viewer = useRef(null);
  const Tooltip = useRef(null);
  const DeveloperRef = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [developerCoords, setDeveloperCoords] = useState({});
  const [value, setValue] = useStateCallback(INITIAL_VALUE);
  const [tooltip, setTooltip] = useStateCallback(null);
  const [currentSelect, setCurrentSelect] = useStateCallback(null);
  const [fullWidth, setFullWidth] = useState(false);
  const [width, height] = useWindowSize({
    initialWidth: 800,
    initialHeight: 600,
  });
  console.log(width, height);
  const [estado, setEstado] = useState({
    level: props.data.categories[0].id,
    data: props.data,
    filtered: props.data,
    filters: [],
    searchString: '',
    loading: true,
    showToolbar: true,
  });

  useEffect(() => {
    // Centramos el mapa
    Viewer.current.fitToViewer();
    // solamente para agregar los filtros que aparecerán en el buscador, se pueden mover al ciclo de vida del componente
    // y manejar un estado local
    const optionsFilter = Object.keys(
      omit(props.data.levels[0].locations[0], ['id', 'id_huerto', 'fill'])
    );
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
    if (value.f && value.e && tooltip) {
      moveTooltipTo();
    }
  }, [value.f, value.e]);
  useEffect(() => {
    _fitToViewer();
  }, [estado.level]);
  useEffect(() => {
    if (currentSelect) {
      // if (!element) return false;
      const { id } = currentSelect;
      const element = document.getElementById(id);
      const getSizes = element.getBBox();
      const { x, y } = getSizes;
      console.log('POINTS TO CENTER', x, y);
      const zoomScale = getZoomScale(getSizes);
      zoomToElement(x, y, zoomScale);
    }
  }, [currentSelect]);
  // const _zoomOnViewerCenter1 = () => Viewer.current.zoomOnViewerCenter(1.2);
  // const _fitSelection1 = () => Viewer.current.fitSelection(40, 40, 200, 200);
  const _fitToViewer = () => Viewer.current.fitToViewer();

  // const _zoomOnViewerCenter2 = () => setValue(zoomOnViewerCenter(value, 1.1));
  // const _fitSelection2 = () => setValue(fitSelection(value, 40, 40, 200, 200));
  // const _fitToViewer2 = () => setValue(fitToViewer(value));

  const printMapa = (mapa) => {
    // podemos validar si es Móvil o no y asi hacer un preventDefault en el click o en el touchend
    const { data } = props;
    const getLevel = data.levels.find((ele) => includes(ele.id, mapa.id));
    const extension = getLevel.map
      .substr(getLevel.map.lastIndexOf('.') + 1)
      .toLowerCase();
    const maxWidth =
      width <= props.data.mapwidth ? width : fullWidth ? width : 800;
    const maxHeight =
      height <= props.data.mapheight ? height : fullWidth ? height : 600;
    if (extension == 'svg') {
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
                  selector={'#' + ele.id}
                  fill={ele.fill || '#8e44ad'}
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
            const cloned = React.cloneElement(content, {
              width: maxWidth,
              height: maxHeight,
            });
            return (
              <ReactSVGPanZoom
                scaleFactorMax={2}
                detectAutoPan={false}
                scaleFactor={1}
                scaleFactorMin={1}
                disableDoubleClickZoomWithToolAuto={true}
                SVGBackground="transparent"
                // style={{ transition: "all 1s ease-in-out" }}
                className="map-container"
                SVGStyle={{ transition: 'transform 1s ease-in-out' }}
                // background='red'
                id="viewer1"
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
                detectWheel={tooltip ? false : true}
                // Ya no se necesita, inhabilito PAN cuando existe un Tooltip abierto
                // onPan={(pan) => {
                //   this.setState({ value: pan }, () => this.moveTooltipTo(pan));
                // }}
                // onZoom={(zoom) => {
                //   console.log(zoom);
                //   this.setState({ value: zoom }, () => this.moveTooltipTo(zoom));
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
                  setDeveloperCoords({ x: x.toFixed(4), y: y.toFixed(4) });
                }}
                /* Habilitar solamente si modo desarrollo esta habiltado
                por el momento */
                onClick={(event) => {
                  console.log(event.originalEvent);
                  if (props.developer) {
                    const node = DeveloperRef.current;
                    copyToClipboard(node);
                    console.log(node);
                  }
                }}
                // Necesarios para Trabajar bien
                // width={props.data.mapwidth}
                // height={props.data.mapheight}
                width={maxWidth}
                height={maxHeight}
                // customMiniature={(props) => {
                //   return <div style={{ position: "absolute", left: 0, zIndex: 900, width: "90px", height: "100px" }}>{props.children}</div>;
                // }}
                miniatureProps={{
                  position: 'left',
                  background: 'green',
                  width: 90,
                  height: 70,
                  border: '0px',
                }}
              >
                <svg width={maxWidth} height={maxHeight}>
                  {cloned}
                </svg>
              </ReactSVGPanZoom>
            );
          }}
        />
      );
    } else {
      console.log(extension + 'No esta permitido todavía');
    }
  };
  const getZoomScaleTooltip = () => {
    const { a } = value;
    console.log('ZOOM VALUE', Math.round((a + Number.EPSILON) * 100) / 100);
    if (a > 1) {
      return (a / 100) * 60;
    }
    return 1;
  };
  const renderMap = () => {
    const { data, level } = estado;
    const currentMap = data.categories.find((ele) => ele.id == level);
    const Template = props.toolTipTemplate
      ? React.cloneElement(props.toolTipTemplate, currentSelect)
      : null;
    return (
      <div
        className="window"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <select
          value={estado.level}
          onChange={(e) => {
            const { value } = e.target;
            setEstado({
              ...estado,
              level: value,
            });
            setTooltip(null);
            setCurrentSelect(null);
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
        {props.developer && (
          <Developer data={developerCoords} ref={DeveloperRef} />
        )}
        {/* No lo desaparecemos por que necesitamos saber su tamaño via JS */}
        <ToolTip
          className="tooltip"
          ref={Tooltip}
          closeTooltip={() => {
            const element = document.getElementById(currentSelect.id);
            element.classList.remove('active-location');
            setEstado((prev) => {
              return { ...prev, tool: TOOL_AUTO };
            });
            setCurrentSelect(null);
            Viewer.current.reset();
          }}
          style={{
            transitionProperty: 'top, left',
            transitionDuration: '.2s',
            transitionTimingFunction: 'linear',
            // transform: `scale(${getZoomScaleTooltip()})`,
            opacity: `${tooltip && currentSelect ? 100 : 0} `,
            visibility: `${tooltip && currentSelect ? 'visible' : 'hidden'} `,
            position: 'absolute',
            left: tooltip ? `${tooltip.x}px` : 0,
            top: tooltip ? `${tooltip.y}px` : 0,
            // animation: "bounce 1s",
          }}
        >
          {Template}
        </ToolTip>
      </div>
    );
  };
  const showTooltip = (id) => {
    setCurrentToState(id);
  };
  const findCurrent = (id) => {
    const { data } = estado;
    // busco la manzana en la que se encuentra
    const block = head(filter(data.levels, { locations: [{ id: id }] }));
    // y luego busco la locacion
    const target = block.locations.find((ele) => ele.id == id);
    return target;
  };
  const getZoomScale = ({ height = 100, width = 100 }) => {
    const AreaItem = parseInt(height) * parseInt(width);
    const AreaITotal =
      parseInt(props.data.mapheight) * parseInt(props.data.mapwidth);
    const max = 750;
    const min = 3;
    const formula = (x) => {
      const constante = max / min;
      const res = +(Math.round(x / constante + 'e+2') + 'e-2');
      return res <= 1 ? 1.5 : res;
    };
    return formula(AreaITotal / AreaItem);
  };
  // funcion que actualiza el estado con el Item que se ha clickeado
  const checkElementExist = (id) => {
    console.log(id);
    const element = document.getElementById(id);
    console.log(element);

    if (!element) {
      // cons
      alert('Por favor intente de nuevo');
      return false;
    }
    const all = document.querySelectorAll(
      '[id^=landmark] > *, svg > #items > *'
    );
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove('active-location');
    }
    element.classList.add('active-location');
    return element;
  };
  const setCurrentToState = (id) => {
    const current = { ...findCurrent(id), id };

    setCurrentSelect(current, () => {
      moveTooltipTo();
    });
  };
  const zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    return setValue(
      setPointOnViewerCenter(value, SVGPointX, SVGPointY, scaleFactor)
    );
  };
  const moveTooltipTo = () => {
    console.log('SE EJECUTA MOVETooltipTO');
    const { left, top } = getPositionToolTip();
    setTooltip({
      x: left,
      y: top,
    });
    return false;
  };
  const getPositionToolTip = () => {
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = Tooltip.current ? Tooltip.current.offsetWidth : 5;
    const tooltipHeight = Tooltip.current ? Tooltip.current.offsetHeight : 5;
    // console.log
    if (currentSelect) {
      const { x, y, id } = currentSelect;
      const element = document.getElementById(id);
      const sizes = element.getBBox();
      console.log(sizes);
      const padding =
        parseFloat(
          window
            .getComputedStyle(Tooltip.current, null)
            .getPropertyValue('padding')
        ) || 5;
      // const sumX = x * zoom;
      // const sumY = y * zoom;
      const sumX = (sizes.x || x) * zoom;
      const sumY = (sizes.y || y) * zoom;
      // let cx = x ? sumX - tooltipWidth / 2 + e : sumX / 2 - tooltipWidth / 2 + e;
      // let cy = y ? sumY - tooltipHeight + f : sumY / 2 - tooltipHeight + padding + f;
      let cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + padding + f;
      return { left: cx, top: cy };
    }
    return false;
  };
  const handleCheckChildElement = (event) => {
    let filters = estado.filters;
    filters.forEach((item) => {
      const length = estado.filters
        .filter((ele) => ele.isChecked == true)
        .map((ele) => ele.value);
      if (item.value === event.target.value)
        item.isChecked = length.length > 1 ? event.target.checked : true;
    });
    setEstado({ ...estado, filters: filters });
  };
  const { theme } = props;
  return (
    <div>
      <Window theme={theme ? theme : undefined} dark>
        {/* {renderMap()} */}
        {/* TODO: pasar todo a styled Components */}
        <div style={{ display: 'flex', maxHeight: '100%' }}>
          <div
            className="body"
            style={{
              position: fullWidth ? 'fixed' : 'relative',
              top: 0,
              left: 0,
              overflow: 'hidden',
              height: height <= 600 ? height : fullWidth ? height : 600,
              width: width <= 800 ? width : fullWidth ? width : 800,
            }}
          >
            {renderMap()}
            <div className="test">
              <button
                onClick={() => {
                  Viewer.current.reset();
                }}
                style={{ position: 'absolute', top: 0, right: 0, zIndex: 999 }}
              >
                RESET ZOOM
              </button>
              <button
                onClick={() => {
                  setFullWidth(!fullWidth);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 130,
                  zIndex: 999,
                }}
              >
                {fullWidth ? 'Minimizar' : 'Maximizar'}
              </button>
              <button
                style={{
                  position: 'absolute',
                  bottom: 25,
                  right: 100,
                  zIndex: 999,
                }}
                disabled={value.a && parseFloat(value.a.toFixed(2)) >= 1.8}
                onClick={(e) => {
                  e.preventDefault();
                  Viewer.current.zoomOnViewerCenter(1.1);
                }}
              >
                ZOOM IN
              </button>
              <button
                style={{
                  position: 'absolute',
                  bottom: 25,
                  right: 10,
                  zIndex: 999,
                }}
                disabled={value.a && parseFloat(value.a.toFixed(2)) <= 1.1}
                onClick={(e) => {
                  e.preventDefault();
                  Viewer.current.zoomOnViewerCenter(0.9);
                }}
              >
                ZOOM OUT
              </button>
            </div>
          </div>
          <Search
            height={height <= 600 ? height : 600}
            data={estado.data}
            filtered={estado.filtered}
            level={estado.level}
            showTooltip={(id) => {
              showTooltip(id);
            }}
            changeBlock={(value, id) => {
              setEstado({
                ...estado,
                level: value,
              });
              setTooltip(null);
              setCurrentSelect(null);
              showTooltip(id);
            }}
            filters={estado.filters}
            handleCheckChildElement={handleCheckChildElement}
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
