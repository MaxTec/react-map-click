import React, { useState } from "react";
import {
  ToolbarButton,
  IconCursor,
  IconPan,
  IconFit,
  IconZoomIn,
  IconZoomOut,
  TOOL_AUTO,
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  POSITION_TOP,
} from "react-svg-pan-zoom";
import "./styles.styl";
const ToolBar = ({ fitToViewer, ...props }) => {
  return (
    <>
      <div className='toolbar-map'>
        {props.show ? (
          <>
            <ToolbarButton
              activeColor='green'
              toolbarPosition={POSITION_TOP}
              title='NONE'
              name='NONE'
              active={props.tool == TOOL_NONE}
              onClick={() => {
                props.changeTool(TOOL_NONE);
              }}
            >
              <IconCursor />
            </ToolbarButton>
            <ToolbarButton
              activeColor='green'
              toolbarPosition={POSITION_TOP}
              active={props.tool == TOOL_ZOOM_IN}
              title='ZOOM'
              name='ZOOM'
              onClick={() => {
                props.changeTool(TOOL_ZOOM_IN);
              }}
            >
              <IconZoomIn />
            </ToolbarButton>
            <ToolbarButton
              activeColor='green'
              toolbarPosition={POSITION_TOP}
              active={props.tool == TOOL_PAN}
              title='MOVE'
              name='MOVE'
              onClick={() => {
                props.changeTool(TOOL_PAN);
              }}
            >
              <IconPan />
            </ToolbarButton>
            <ToolbarButton
              activeColor='green'
              toolbarPosition={POSITION_TOP}
              active={false}
              title='CENTER'
              name='CENTER'
              onClick={() => {
                fitToViewer();
              }}
            >
              <span>CENTRAR</span>
            </ToolbarButton>
            <button
              onClick={() => {
                props.toggle();
              }}
              className='hide'
            >
              >
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              props.toggle();
            }}
          >
            Show
          </button>
        )}
      </div>
    </>
  );
};

export default ToolBar;
