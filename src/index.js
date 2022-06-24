import React, { useEffect, useRef, useState } from 'react';
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
// import {
//   ReactSvgPanZoomLoader,
//   SvgLoaderSelectElement,
// } from 'react-svg-pan-zoom-loader';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import ToolTip from './components/tooltip';
import useStateCallback from './hooks/useStateCallback';

const ReactMapClick = ({ data, ...props }) => {
  console.log(data);
  const { mapheight, mapwidth } = data;
  const Viewer = useRef(null);
  const Tooltip = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [tooltip, setTooltip] = useState(null);
  // se debe filtrar la disponibilidad desde el back :v
  const [currentMap, setCurrentMap] = useState(data.levels[0]);
  const [selected, setSelected] = useStateCallback(null);

  const getCurrentBlock = (mz) => {
    const res = data.levels.find((ele) => {
      return ele.id === mz;
    });
    return res || [];
  };
  const changeBlockandLot = (block, lote = '') => {
    const getRow = getCurrentBlock(block);
    setSelected('m11lote3');
    setCurrentMap(getRow);
  };
  const changeBlock = (block) => {
    setSelected(null);
    const getRow = getCurrentBlock(block);
    setCurrentMap(getRow);
  };
  const Template = props.toolTipTemplate
    ? React.cloneElement(props.toolTipTemplate, selected)
    : null;
  const getPositionToolTip = () => {
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = Tooltip.current ? Tooltip.current.offsetWidth : 5;
    const tooltipHeight = Tooltip.current ? Tooltip.current.offsetHeight : 5;
    console.log(selected);
    if (selected) {
      // const { x, y, id } = selected;
      const element = document.getElementById(selected);
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
      const sumX = sizes.x * zoom;
      // const sumX = (sizes.x || x) * zoom;
      const sumY = sizes.y * zoom;
      // const sumY = (sizes.y || y) * zoom;
      // let cx = x ? sumX - tooltipWidth / 2 + e : sumX / 2 - tooltipWidth / 2 + e;
      // let cy = y ? sumY - tooltipHeight + f : sumY / 2 - tooltipHeight + padding + f;
      let cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + padding + f;
      return { left: cx, top: cy };
    }
    return false;
  };
  return (
    <>
      <select
        onChange={(e) => {
          const { value } = e.target;
          // console.log(value);
          changeBlock(value);
        }}
      >
        {data.levels &&
          data.levels.length > 1 &&
          data.levels.map((ele, index) => {
            return (
              <option key={index} value={ele.id}>
                {ele.title}
              </option>
            );
          })}
      </select>
      <button
        type="button"
        onClick={() => {
          changeBlock('landmarks-mz11');
        }}
      >
        BUTTON CHAANGE BLOCK
      </button>
      <button
        type="button"
        onClick={() => {
          changeBlockandLot('landmarks-mz11', 'm11lote3');
        }}
      >
        BUTTON CHAANGE BLOCK and LOT
      </button>
      <ReactSVGPanZoom
        scaleFactorMax={2}
        detectAutoPan={false}
        scaleFactor={1}
        scaleFactorMin={1}
        disableDoubleClickZoomWithToolAuto={true}
        SVGBackground="transparent"
        // className="map-container"
        SVGStyle={{ transition: 'transform 1s ease-in-out' }}
        id="viewer1"
        ref={Viewer}
        tool={tool}
        onChangeTool={(tool) => {
          setTool(tool);
        }}
        value={value}
        onChangeValue={setValue}
        width={mapwidth}
        height={mapheight}
      >
        <svg width={mapwidth} height={mapheight}>
          <SvgLoader
            width={mapwidth}
            height={mapheight}
            path={currentMap.map}
            onSVGReady={() => {
              // Si existe un cambio en el cambio de locaccion seleccionada, cambiamos
              if (selected && selected !== '') {
                console.log(getPositionToolTip());
              }
            }}
          >
            {currentMap.locations.map((ele, i) => (
              <SvgProxy
                key={ele.id}
                selector={`#${ele.id}`}
                // selector="[id^=landmark] > *"
                fill={currentMap.fill || '#8e44ad'}
                onClick={(e) => {
                  const { id } = e.target;
                  setSelected(id, () => {
                    console.log(getPositionToolTip());
                    // console.log(getPositionToolTip());
                  });
                  // if (id) showTooltip(id);
                }}
              />
            ))}
          </SvgLoader>
        </svg>
      </ReactSVGPanZoom>
      <ToolTip
        className="tooltip"
        ref={Tooltip}
        closeTooltip={() => {
          // const element = document.getElementById(currentSelect.id);
          // element.classList.remove('active-location');
          // setEstado((prev) => {
          //   return { ...prev, tool: TOOL_AUTO };
          // });
          // setCurrentSelect(null);
          Viewer.current.reset();
        }}
        style={{
          transitionProperty: 'top, left',
          transitionDuration: '.2s',
          transitionTimingFunction: 'linear',
          // transform: `scale(${getZoomScaleTooltip()})`,
          opacity: `${tooltip && selected ? 100 : 0} `,
          visibility: `${tooltip && selected ? 'visible' : 'hidden'} `,
          position: 'absolute',
          left: tooltip ? `${tooltip.x}px` : 0,
          top: tooltip ? `${tooltip.y}px` : 0,
          // animation: "bounce 1s",
        }}
      >
        {Template}
      </ToolTip>
    </>
  );
};

export default ReactMapClick;
