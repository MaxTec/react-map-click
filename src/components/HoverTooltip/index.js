// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
import { TooltipContainer, TooltipTriangle, TooltipInner } from './styles.js';
import { VscClose } from 'react-icons/vsc';
// i need to add TS
const HoverTooltip = React.forwardRef(function Tooltip(
  { children, closeTooltip, ...props },
  ref
) {
  return (
    <TooltipContainer {...props} ref={ref}>
      <TooltipInner>{children}</TooltipInner>
      <TooltipTriangle />
    </TooltipContainer>
  );
});

export default HoverTooltip;
