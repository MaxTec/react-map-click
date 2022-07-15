import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { VscChevronDown, VscChevronUp, VscSettingsGear } from 'react-icons/vsc';
import styled, { css, keyframes } from 'styled-components';

import useOnClickOutside from '../../hooks/clickOutside';
import Button from '../Button';

const slowDropDown = keyframes`
 0% {
    transform: translateY(-1rem);
    opacity: 0;
    visibility: hidden;
  }

  100% {
    transform: translateY(0rem);
    opacity: 1;
    visibility: visible;
  }
`;
const animationInjected = css`
  ${slowDropDown} 0.2s ease-in-out 1 forwards; ;
`;
const DDContainer = styled.div`
  width: 100%;
  padding: 0 0.35rem;
  transition: all 0.5s;
  position: relative;

  color: ${(props) => {
    return props.theme.color.neutral.light;
  }};
`;
const DDContainerInner = styled.div`
  /* padding: 0.25rem 0.5rem; */
  position: absolute;
  min-width: 150px;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  background-color: ${(props) => {
    return props.theme.color.neutral.light;
  }};
  color: ${(props) => {
    return props.theme.color.primary;
  }};
  animation: ${(props) => {
    return props.isOpen ? animationInjected : 'none';
  }};
  border: ${(props) => {
    return `${props.theme.borderWidth} solid ${props.theme.color.primary}`;
  }};
  z-index: 999999;
  font-size: 14px;
  /* animation: ${slowDropDown} s linear infinite; */
`;
const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  // useOnClickOutside(ref, () => setOpen(false));
  return (
    <>
      <Button
        width="200px"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <VscSettingsGear size="1.3em" />
        {/* <IoMdArrowDropdown size="0.8em" /> */}
      </Button>
      <DDContainer ref={ref}>
        <DDContainerInner isOpen={open}>{children}</DDContainerInner>
      </DDContainer>
    </>
  );
};

export default Dropdown;
