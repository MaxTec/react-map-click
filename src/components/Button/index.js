import { darken, desaturate, lighten, invert, complement } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
// Define our button
export const ButtonContainer = styled.button`
  font-size: ${(props) => props.theme.fontSize || '14px'};
  /* display: ${(props) => (props.fit ? 'inline' : 'inline-block')}; */
  min-width: 35px;
  user-select: none;
  font-weight: 400;
  width: ${(props) => (props.width || props.fit ? 'auto' : '100%')};
  height: 35px;
  color: ${(props) => props.color || props.theme.color.primary};
  background-color: ${(props) => props.bg || props.theme.color.neutral.light};
  border-radius: 5px;
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
  display: inline;
  white-space: nowrap;
  cursor: pointer;
  line-height: 0;
  &:hover {
    transition: all 0.5s;
    transform: scale(1.03);
    background-color: ${(props) => props.theme.color.primary};
    color: ${(props) =>
      props.bg ? invert(props.bg) : props.theme.color.neutral.light};
    border-color: ${(props) => props.theme.color.neutral.light};
  }
  ${(props) => {
    if (props.active) {
      return css`
        background-color: white;
        transition: all 0.5s;
        transform: scale(1.03);
        background-color: ${(props) => props.theme.color.primary};
        color: ${(props) =>
          props.bg ? invert(props.bg) : props.theme.color.neutral.light};
        border-color: ${(props) => props.theme.color.neutral.light};
      `;
    }
    return false;
  }}
`;
const Button = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <ButtonContainer {...props}>{children || 'Press Me'}</ButtonContainer>
    </React.Fragment>
  );
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
