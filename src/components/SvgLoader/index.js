import React from 'react';
import { SvgLoader, SvgProxy } from 'react-svgmt';

const SvgLoaderCustom = (props, proxy) => {
  return (
    <SvgLoader {...props}>
      {proxy}
      {/* <SvgProxy selector="rect" fill="red" />
      {selectors.map((selector, ix) => (
        <SvgProxy key={ix} selector={selector} fill="blue" />
      ))} */}
    </SvgLoader>
  );
};

export default SvgLoaderCustom;
