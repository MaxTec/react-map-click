/* eslint-disable operator-linebreak */
/* eslint-disable object-property-newline */
import { filter, head } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  setPointOnViewerCenter,
  TOOL_NONE,
} from 'react-svg-pan-zoom';
import { SvgLoader, SvgProxy } from 'react-svgmt';

import ToolTip, { TooltipTemplate } from './components/tooltip';
import Window from './components/window';
import useStateCallback from './hooks/useStateCallback';

const ReactMapClick = ({ data, theme }) => {
  const { mapheight, mapwidth } = data;
  const Viewer = useRef(null);
  const Tooltip = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [tooltip, setTooltip] = useState(null);
  const [isMapLoaded, setisMapLoaded] = useState(false);
  // se debe filtrar la disponibilidad desde el back :v
  const [currentMap, setCurrentMap] = useStateCallback(data.levels[0]);
  const [selected, setSelected] = useStateCallback(null);

  const _fitToViewer = () => Viewer.current.fitToViewer();
  useEffect(() => {
    if (selected && selected !== '' && isMapLoaded) {
      const sizes = getSizes(selected.id);
      const area = (sizes.width * sizes.height) / 2;
      zoomToElement(sizes.x, sizes.y, area < 5000 ? 1.8 : 1.1);
      moveTooltipTo();
    }
  }, [selected, isMapLoaded]);
  useEffect(() => {
    // console.log("HAY UN CAMBIO EN F o E (horizontal o vertical");
    if (value.f && value.e && tooltip) {
      moveTooltipTo();
    }
  }, [value.f, value.e]);
  const getCurrentBlock = (mz) => {
    const res = data.levels.find((ele) => {
      return ele.id === mz;
    });
    return res || [];
  };
  // const changeBlockandLot = (block, lote = '') => {
  //   setisMapLoaded(false)
  //   const getRow = getCurrentBlock(block);
  //   console.log(getRow)
  //   setCurrentMap(getRow);
  //   setSelected(findLot('m11lote3'));
  // };
  const changeBlock = (block) => {
    setisMapLoaded(false);
    setSelected(null);
    const getRow = getCurrentBlock(block);
    console.log(getRow);
    setCurrentMap(getRow);
    _fitToViewer();
  };
  // const Template = props.toolTipTemplate
  //   ? React.cloneElement(props.toolTipTemplate, selected)
  //   : null;
  const getPositionToolTip = () => {
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = Tooltip.current ? Tooltip.current.offsetWidth : 5;
    const tooltipHeight = Tooltip.current ? Tooltip.current.offsetHeight : 5;
    console.log(selected);
    if (selected) {
      const { x, y, id } = selected;
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
      // const sumX = sizes.x * zoom;
      const sumX = (sizes.x || x) * zoom;
      // const sumY = sizes.y * zoom;
      const sumY = (sizes.y || y) * zoom;
      // let cx = x ? sumX - tooltipWidth / 2 + e : sumX / 2 - tooltipWidth / 2 + e;
      // let cy = y ? sumY - tooltipHeight + f : sumY / 2 - tooltipHeight + padding + f;
      let cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + padding + f;
      return { left: cx, top: cy };
    }
    return false;
  };
  const moveTooltipTo = () => {
    const { left, top } = getPositionToolTip();
    setTooltip({
      x: left,
      y: top,
    });
    return false;
  };
  const zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    return setValue(
      setPointOnViewerCenter(value, SVGPointX, SVGPointY, scaleFactor)
    );
  };
  const getSizes = (selected) => {
    console.log(selected);
    const element = document.getElementById(selected);
    return element.getBBox();
  };
  const findLot = (id) => {
    // const { data } = estado;
    // busco la manzana en la que se encuentra
    const block = head(filter(data.levels, { locations: [{ id: id }] }));
    // y luego busco la locacion
    const target = block.locations.find((ele) => ele.id === id);
    return target;
  };
  return (
    <Window
      theme={theme ? theme : undefined}
      dark
      height={mapheight}
      width={mapwidth}
    >
      <select
        value={currentMap.id}
        onChange={(e) => {
          const { value } = e.target;
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
      {/* <button
        type="button"
        onClick={() => {
          changeBlockandLot('landmarks-mz11', 'm11lote3');
        }}
      >
        BUTTON CHAANGE BLOCK and LOT
      </button> */}
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
              setisMapLoaded(true);
            }}
          >
            {currentMap.locations.map((ele) => (
              <SvgProxy
                key={ele.id}
                selector={`#${ele.id}`}
                // selector="[id^=landmark] > *"
                fill={currentMap.fill || '#8e44ad'}
                onClick={(e) => {
                  const { id } = e.target;
                  setSelected(findLot(id));
                  // console.log(getPositionToolTip());
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
          setSelected(false);
          setTooltip(null);
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
        <TooltipTemplate {...selected} />
      </ToolTip>
    </Window>
  );
};
ReactMapClick.propTypes = {
  theme: PropTypes.exact({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    fontSize: PropTypes.string,
    body: PropTypes.string,
  }),
  data: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onLocationOpened: PropTypes.func,
  tooltipHover: PropTypes.bool,
};

export default ReactMapClick;
