import { darken } from 'polished';
import styled from 'styled-components';

export const TooltipContainer = styled.div`
  min-height: 80px;
  width: 250px;
  background-color: #ffffff;
  border-radius: 5px;
  position: relative;
  padding-block: 0.5rem;
  padding-inline: 0.5rem;
  box-shadow: 4px 4px 5px rgba(#000, 20%);
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
export const TooltipInner = styled.div`
  padding: 0.25rem;
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
