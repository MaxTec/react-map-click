import React from "react";
import "./styles.styl";
import DOMPurify from "dompurify";

const Tooltip = React.forwardRef(({ children, closeTooltip, ...props }, ref) => {
  console.log(props);
  return (
    <div className='tooltip' {...props} ref={ref}>
      <div className='tooltip__close' onClick={() => closeTooltip()}>
        X
      </div>
      <div className='tooltip__inner'>{children}</div>
      <div className='tooltip__triangle'></div>
    </div>
  );
});

export const TooltipTemplate = ({ title, about, category, description, ...props }) => {
  return (
    <div className='tooltip__content'>
      <ul className='tooltip__list'>
        <li>title:{title || "N/A"}</li>
        {about && <li>about:{<div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about) }}></div>}</li>}
        <li>category:{category}</li>
        <div className='content' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}></div>
      </ul>
    </div>
  );
};

export default Tooltip;
