import { darken } from 'polished';
import styled from 'styled-components';

export const TooltipContainer = styled.div`
  /* min-height: 80px; */
  min-height: ${(props) => (!props.hover ? '80px:' : 'auto')};
  width: ${(props) => (!props.hover ? '250px:' : 'auto')};
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  padding-block: 0.5rem;
  padding-inline: 0.5rem;
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  transition-property: top, left;
  transition-duration: 0.2s;
  transition-timing-function: linear;
  pointer-events: ${(props) => (props.hover ? 'none' : 'auto')};
  opacity: ${(props) => (props.datos ? '100' : '0')};
  visibility: ${(props) => (props.datos ? 'visible' : 'hidden')};
  top: ${(props) => (props.datos ? props.datos.top : 0)}px;
  left: ${(props) => (props.datos ? props.datos.left : 0)}px;
  max-width: ${(props) => (props.hover ? '150px' : '250px')};
`;
export const TooltipInner = styled.div`
  padding: 0.25rem;
  font-size: 14px;
  color: ${(props) => props.color || props.theme.color.primary};
`;
export const TooltipClose = styled.div`
  display: inline-block;
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
  cursor: pointer;
  color: ${(props) => props.color || props.theme.color.primary};
  line-height: 0;
`;

export const TooltipTriangle = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #ffffff;
  &:before {
    content: '';
    display: block;
    width: 14px;
    height: ${(props) => props.theme.borderWidth || 2};
    background-color: ${(props) => {
      return `${props.theme.color.primary}`;
    }};
    transform: rotate(45deg);
    position: absolute;
    left: -12px;
    top: -5px;
  }
  &:after {
    content: '';
    display: block;
    width: 14px;
    height: ${(props) => props.theme.borderWidth || 2};
    background-color: ${(props) => {
      return `${props.theme.color.primary}`;
    }};
    transform: rotate(-45deg);
    position: absolute;
    right: -12px;
    top: -5px;
  }
`;
