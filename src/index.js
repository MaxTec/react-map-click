/* eslint-disable operator-linebreak */
/* eslint-disable object-property-newline */
import { useWindowSize } from '@react-hook/window-size';
import { filter, head } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  setPointOnViewerCenter,
  TOOL_NONE,
} from 'react-svg-pan-zoom';
import { SvgLoader, SvgProxy } from 'react-svgmt';

import Developer from './components/Developer';
import Search from './components/Search';
import Select from './components/Select';
import ToolBarMap from './components/ToolbarMap';
import ToolTip, { TooltipTemplate } from './components/tooltip';
import Window from './components/window';
import useStateCallback from './hooks/useStateCallback';
import { copyToClipboard } from './utils/copyToClipboard';

const ReactMapClick = ({ data, theme, showSearch, developer }) => {
  const { mapheight, mapwidth } = data;
  const Viewer = useRef(null);
  const Tooltip = useRef(null);
  const DeveloperRef = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [developerCoords, setDeveloperCoords] = useState({});
  const [tooltip, setTooltip] = useState(null);
  const [fullWidth, setFullWidth] = useState(false);
  const [isMapLoaded, setisMapLoaded] = useState(false);
  // se debe filtrar la disponibilidad desde el back :v
  const [currentMap, setCurrentMap] = useStateCallback(data.levels[0]);
  const [selected, setSelected] = useStateCallback(null);
  const [width, height] = useWindowSize({
    initialWidth: mapheight,
    initialHeight: mapwidth,
  });

  const _fitToViewer = () => Viewer.current.fitToViewer();
  useEffect(() => {
    if (selected && selected !== '' && isMapLoaded && !developer) {
      const sizes = getSizes(selected.id);
      const area = (sizes.width * sizes.height) / 2;
      const x = area < 5000 ? sizes.x : sizes.x + sizes.width / 2;
      const y = area < 5000 ? sizes.y : sizes.y + sizes.height / 2;
      // Note: pass zoomValue as prop
      zoomToElement(x, y, 1.8);
      moveTooltipTo();
      markItem(selected.id);
    }
  }, [selected, isMapLoaded]);
  useEffect(() => {
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
  const changeBlockandLot = (block, lote = '') => {
    setisMapLoaded(false);
    const getRow = getCurrentBlock(block);
    setCurrentMap(getRow);
    setSelected(findLot(lote));
  };
  const changeBlock = (block) => {
    setisMapLoaded(false);
    setSelected(null);
    const getRow = getCurrentBlock(block);
    setCurrentMap(getRow);
    _fitToViewer();
  };
  const getPositionToolTip = () => {
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    // TODO: Hacer que el tamaño del tooltip sea dinámico
    const tooltipWidth = Tooltip.current ? Tooltip.current.offsetWidth : 5;
    const tooltipHeight = Tooltip.current ? Tooltip.current.offsetHeight : 5;
    console.log(tooltipWidth, tooltipHeight);
    if (selected) {
      const { x, y, id } = selected;
      const element = document.getElementById(id);
      const sizes = element.getBBox();
      const sizesRect = element.getBoundingClientRect();
      // console.log('RECT :', sizesRect.x * zoom, sizesRect.y);
      // console.log('SVG :', sizes.x * zoom, sizes.y);
      // return {
      //   left: x - tooltipWidth / 2 + sizesRect.width / 2,
      //   top: y,
      // };
      console.log('AREA:', (sizesRect.width * sizesRect.height) / 2);
      // return {
      //   left: sizesRect.x / zoom - sizesRect.width / zoom,
      //   top: sizesRect.y / zoom - sizesRect.height / zoom,
      // };
      // console.log(sizes, zoom);
      // padding is not necessary anymore, because box-sizing:border-box
      // const padding = parseFloat(window.getComputedStyle(Tooltip.current, null).getPropertyValue('padding')) || 5;
      console.log(zoom);
      // const sumX = x * zoom;
      // const sumX = x * zoom;
      const sumX = (sizes.x || x) * zoom;
      // const sumY = y * zoom;
      // const sumY = y * zoom;
      const sumY = (sizes.y || y) * zoom;
      // if (x && y && !developer) return { left: sumX, top: sumY };

      // let cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e;
      let cx = 0;
      console.log(x, y, (x * y) / 2);
      // if ((sizesRect.width * sizesRect.height) / 2 < 8000) {
      cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e; // this works with sizes GetBBox()
      // } else {
      //   cx = sumX + (sizes.width * zoom) / 2 - sizes.width + e;
      // }

      let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + f; // this works with sizes GetBBox()
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
    const element = document.getElementById(selected);
    return element.getBBox();
  };
  const markItem = (selected = null) => {
    const element = selected ? document.getElementById(selected) : null;
    const allSelectable = document.querySelectorAll('[id^=landmark] > *');
    for (let i = 0; i < allSelectable.length; i++) {
      allSelectable[i].classList.remove('selected');
    }
    if (element) element.classList.add('selected');
  };
  const findLot = (id) => {
    // busco la manzana en la que se encuentra
    const block = head(filter(data.levels, { locations: [{ id: id }] }));
    // y luego busco la locación
    const target = block.locations.find((ele) => ele.id === id);
    return target;
  };
  const maxWidth = width <= mapwidth ? width : fullWidth ? width : 800;
  const maxHeight = height <= mapheight ? height : fullWidth ? height : 600;
  return (
    <React.Fragment>
      <div style={{ height: '10vh' }}>HOA</div>
      <Window
        theme={theme ? theme : undefined}
        dark
        height={maxHeight}
        width={maxWidth}
        fullWidth={setFullWidth}
      >
        <Select
          data={data}
          value={currentMap.id}
          callback={(value) => {
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
        </Select>
        <ReactSVGPanZoom
          scaleFactorMax={3}
          detectAutoPan={false}
          scaleFactor={1.1}
          scaleFactorMin={1}
          className={tool !== 'pan' ? 'zoomAble' : ''}
          // disableDoubleClickZoomWithToolAuto={true}
          SVGBackground={theme ? theme.primaryColor : 'lightgray'}
          background={theme ? theme.primaryColor : 'lightgray'}
          // SVGStyle={{ transition: 'transform 1s ease-in-out' }}
          ref={Viewer}
          tool={tool}
          onChangeTool={(tool) => {
            setTool(tool);
          }}
          customToolbar={useCallback((props) => {
            return <ToolBarMap {...props} fitToViewer={_fitToViewer} />;
          }, [])}
          value={value}
          onChangeValue={(value) => {
            console.log(value);
            setValue(value);
          }}
          width={maxWidth}
          height={maxHeight}
          detectWheel={tooltip ? false : true}
          // onMouseMove={(event) => {
          //   const { x, y } = event;
          //   if (!developer) {
          //     return false;
          //   }
          //   setDeveloperCoords({ x: x.toFixed(2), y: y.toFixed(2) });
          // }}
          // onClick={(event) => {
          //   if (developer) {
          //     const sizes = event.originalEvent.target.getBBox();
          //     console.log(sizes);
          //     console.log(event.x, event.y);
          //     console.log(getPositionToolTip());
          //   }
          //   return false;
          // }}
          miniatureProps={{
            background: 'white',
            width: 100,
            height: 70,
            border: '1px solid red',
          }}
          // customMiniature={(element, func) => {
          //   console.log(element, func);
          //   return (
          //     <div
          //       className="mini"
          //       style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
          //     >
          //       <svg width="100" height="80" style={{ pointerEvents: 'none' }}>
          //         {element.children}
          //       </svg>
          //     </div>
          //   );
          // }}
        >
          <svg
            viewBox={`0 0 ${mapwidth} ${mapheight}`}
            width={mapwidth}
            height={mapheight}
          >
            <SvgLoader
              // viewBox={`0 0 ${mapwidth} ${mapheight}`}
              // width={mapwidth}
              // height={mapheight}
              path={currentMap.map}
              onSVGReady={() => {
                setisMapLoaded(true);
              }}
            >
              {currentMap.locations.map((ele) => (
                <SvgProxy
                  // class="selectable"
                  key={ele.id}
                  selector={`#${ele.id}`}
                  // selector="[id^=landmark] > *"
                  fill={currentMap.fill || '#8e44ad'}
                  onClick={(e) => {
                    const { id } = e.target;
                    setSelected(findLot(id));
                  }}
                />
              ))}
            </SvgLoader>
          </svg>
        </ReactSVGPanZoom>
        {showSearch && (
          <Search
            height={mapheight <= 600 ? mapheight : 600}
            data={data}
            filtered={data}
            level={currentMap.id}
            showTooltip={(id) => {
              setSelected(findLot(id));
            }}
            changeBlock={(mz, lot) => {
              changeBlockandLot(mz, lot);
            }}
          />
        )}
        <ToolTip
          className="tooltip"
          ref={Tooltip}
          closeTooltip={() => {
            setSelected(false);
            setTooltip(null);
            markItem(null);
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
            // animation: 'bounce 1s',
          }}
        >
          <TooltipTemplate {...selected} />
        </ToolTip>
        {developer && <Developer data={developerCoords} ref={DeveloperRef} />}
      </Window>
    </React.Fragment>
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
  showSearch: PropTypes.bool,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onLocationOpened: PropTypes.func,
  tooltipHover: PropTypes.bool,
  developer: PropTypes.bool,
};

ReactMapClick.defaultProps = {
  data: [],
  developer: false,
  tooltipHover: false,
  dark: false,
  showSearch: true,
};
export default ReactMapClick;
