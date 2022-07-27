import React, { useEffect, useState } from 'react';
import { BiPointer } from 'react-icons/bi';
import { IoOptions } from 'react-icons/io5';
import { MdCenterFocusWeak } from 'react-icons/md';
import {
  VscChromeClose,
  VscMove,
  VscZoomIn,
  VscZoomOut,
} from 'react-icons/vsc';
import {
  TOOL_AUTO,
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  // ToolbarButton,
} from 'react-svg-pan-zoom';

import Button from '../Button';
import { ToolbarMap, ToolbarMapClose } from './styles.js';

// eslint-disable-next-line react/display-name
const ToolBar = ({ fitToViewer, tool, onChangeTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    console.log('SE RENDERIZA');
  }, []);
  return (
    <>
      <ToolbarMap>
        {isOpen ? (
          <>
            <Button
              fit
              title="NONE"
              active={tool === TOOL_NONE}
              onClick={() => {
                onChangeTool(TOOL_NONE);
              }}
            >
              <BiPointer size="1.3em" />
            </Button>
            <Button
              fit
              active={tool === TOOL_ZOOM_IN}
              title="ZOOM"
              onClick={() => {
                onChangeTool(TOOL_ZOOM_IN);
              }}
            >
              <VscZoomIn size="1.3em" />
            </Button>
            <Button
              fit
              active={tool === TOOL_ZOOM_OUT}
              title="ZOOM"
              onClick={() => {
                onChangeTool(TOOL_ZOOM_OUT);
              }}
            >
              <VscZoomOut size="1.3em" />
            </Button>
            <Button
              fit
              active={tool === TOOL_PAN}
              title="MOVE"
              onClick={() => {
                onChangeTool(TOOL_PAN);
              }}
            >
              <VscMove size="1.5em" />
            </Button>
            <Button
              fit
              active={false}
              title="CENTER"
              onClick={() => {
                fitToViewer();
              }}
            >
              <MdCenterFocusWeak size="1.5em" />
            </Button>
            {isOpen && (
              <ToolbarMapClose
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <VscChromeClose size="1.3em" />
              </ToolbarMapClose>
            )}
          </>
        ) : (
          <Button
            fit
            onClick={() => {
              // toggle();
              setIsOpen(true);
            }}
          >
            <IoOptions />
          </Button>
        )}
      </ToolbarMap>
    </>
  );
};

export default ToolBar;
