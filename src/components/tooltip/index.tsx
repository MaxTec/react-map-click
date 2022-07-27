// eslint-disable-next-line simple-import-sort/imports
import DOMPurify from 'dompurify';
import React from 'react';
import {
  TooltipContainer,
  TooltipTriangle,
  TooltipClose,
  TooltipInner,
} from './styles.js';
import { VscClose } from 'react-icons/vsc';
// i need to add TS
const Tooltip = React.forwardRef(function Tooltip(
  { children, closeTooltip, ...props },
  ref
) {
  return (
    <TooltipContainer {...props} ref={ref}>
      {!props.hover && (
        <TooltipClose onClick={() => closeTooltip()}>
          <VscClose size="1.5em" />
        </TooltipClose>
      )}

      <TooltipInner>{children}</TooltipInner>
      <TooltipTriangle />
    </TooltipContainer>
  );
});

export const TooltipTemplate = ({
  title,
  about,
  category,
  description,
  ...props
}) => {
  return (
    <div className="tooltip__content">
      <ul className="tooltip__list">
        <li>{title || 'N/A'}</li>
        {about && (
          <li>
            about:
            {
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about) }}
              ></div>
            }
          </li>
        )}
        <li>{category}</li>
      </ul>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
      ></div>
    </div>
  );
};

export default Tooltip;
