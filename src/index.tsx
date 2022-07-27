/* eslint-disable operator-linebreak */
/* eslint-disable object-property-newline */
import { useWindowSize } from '@react-hook/window-size';
import { filter, head } from 'lodash';
// import PropTypes from 'prop-types';
import * as React from 'react';
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  setPointOnViewerCenter,
  TOOL_NONE,
} from 'react-svg-pan-zoom';
import { SvgLoader, SvgProxy } from 'react-svgmt';

import Developer from './components/Developer';
import Info from './components/Info';
import Search from './components/Search';
import Select from './components/Select';
import ToolBarMap from './components/ToolbarMap';
import ToolTip, { TooltipTemplate } from './components/tooltip';
import Window from './components/window';
import useStateCallback from './hooks/useStateCallback';
import { copyToClipboard } from './utils/copyToClipboard';

const ReactMapClick = ({ data, theme, showSearch, developer }) => {
  const { mapheight, mapwidth } = data;
  const Viewer:any = React.useRef(null);
  const Tooltip = React.useRef<HTMLInputElement>(null);
  const Hovertooltip = React.useRef<HTMLInputElement>(null);
  const DeveloperRef = React.useRef<HTMLInputElement>(null);
  const [tool, setTool] = React.useState(TOOL_NONE);
  const [value, setValue] = React.useState(INITIAL_VALUE);
  const [developerCoords, setDeveloperCoords] = React.useState({});
  type CoordsTooltip = {
    left: number;
    top: number;
  } | null;
  // const [wearablesList, setWearablesList] = useState<Provider[]>([]);
  const [tooltip, setTooltip] = React.useState<CoordsTooltip>(null);
  const [hoverTooltip, setHoverTooltip] = React.useState(null);
  const [fullWidth, setFullWidth] = React.useState(false);
  const [isMapLoaded, setisMapLoaded] = React.useState(false);
  // se debe filtrar la disponibilidad desde el back :v
  const [currentMap, setCurrentMap] = useStateCallback(data.levels[0]);
  const [selected, setSelected] = useStateCallback(null);
  const [width, height] = useWindowSize({
    initialWidth: mapheight,
    initialHeight: mapwidth,
  });

  const _fitToViewer = () => Viewer.current?.fitToViewer();

  React.useEffect(() => {
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
  React.useEffect(() => {
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
    if (tooltip) {
      setTooltip(null);
    }
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
      // ! Refactor ANY
      const element: any = document.getElementById(id);
      const sizes = element!.getBBox();
      const sizesRect = element.getBoundingClientRect();
      console.log(zoom);
      const sumX = (sizes.x || x) * zoom;
      const sumY = (sizes.y || y) * zoom;
      let cx = 0;
      cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e; // this works with sizes GetBBox()
      let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + f; // this works with sizes GetBBox()
      return { left: cx, top: cy };
    }
    return { left: 0, top: 0 };
  };
  const getHoverTooltipPosition = (el) => {
    const zoom = parseFloat(value.a.toFixed(4));
    const e = parseFloat(value.e.toFixed(4));
    const f = parseFloat(value.f.toFixed(4));
    const sizes = el.getBBox();
    const tooltipWidth = Hovertooltip.current
      ? Hovertooltip.current.offsetWidth
      : 80;
    const tooltipHeight = Hovertooltip.current
      ? Hovertooltip.current.offsetHeight
      : 40;
    const sumX = sizes.x * zoom;
    const sumY = sizes.y * zoom;
    let cx = sumX + (sizes.width * zoom) / 2 - tooltipWidth / 2 + e; // this works with sizes GetBBox()
    let cy = sumY + (sizes.height * zoom) / 2 - tooltipHeight + f; // this works with sizes GetBBox()
    // sobreescribimos x y y (si no necesitamos el fallback)
    if (selected && selected.id == el.id) return false;
    setHoverTooltip({ ...findLot(el.id), left: cx, top: cy });
    return false;
  };
  const moveTooltipTo = () => {
    const { left, top } = getPositionToolTip();
    setTooltip({
      left,
      top,
    });
    return false;
  };
  const zoomToElement = (SVGPointX, SVGPointY, scaleFactor) => {
    return setValue(
      setPointOnViewerCenter(value, SVGPointX, SVGPointY, scaleFactor)
    );
  };
  const getSizes = (selected) => {
    const element: any = document.getElementById(selected);
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
      {/* <div style={{ height: '10vh' }}>HOA</div> */}
      <Window
        id="cuack"
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
          background='lightgray'
          // background={theme ? theme.primaryColor : 'lightgray'}
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
          miniatureProps={{
            position: 'left';
            background: 'white',
            width: 100,
            height: 70,
          }}
        >
          <svg
            viewBox={`0 0 ${mapwidth} ${mapheight}`}
            width={mapwidth}
            height={mapheight}
          >
            <SvgLoader
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
                  fill={currentMap.fill || '#8e44ad'} // tener un color por defecto.
                  onMouseEnter={(e) => {
                    if (width > 600) {
                      getHoverTooltipPosition(e.target);
                    }
                  }}
                  onMouseLeave={(e) => {
                    setHoverTooltip(null);
                  }}
                  onClick={(e) => {
                    // !NOTA: developer puede ir aca
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
          ref={Tooltip}
          closeTooltip={() => {
            setSelected(false);
            setTooltip(null);
            markItem(null);
            Viewer.current.reset();
          }}
          datos={tooltip}
          active={selected}
        >
          <TooltipTemplate {...selected} />
        </ToolTip>
        {developer && <Developer data={developerCoords} ref={DeveloperRef} />}
        {hoverTooltip && (
          <ToolTip
            className="hover"
            hover={true}
            ref={Hovertooltip}
            datos={hoverTooltip}
          >
            {hoverTooltip && hoverTooltip.title}
          </ToolTip>
        )}
        {/* we need block Info  */}
        <Info data={currentMap}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of
        </Info>
      </Window>
    </React.Fragment>
  );
};
ReactMapClick.defaultProps = {
  data: [],
  developer: false,
  tooltipHover: false,
  dark: false,
  showSearch: true,
};
export default ReactMapClick;
