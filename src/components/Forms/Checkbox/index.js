import { darken, desaturate } from 'polished';
import React from 'react';
import styled from 'styled-components';
export const CheckboxCheckmark = styled.div`
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  width: 16px;
  background-color: ${(props) => props.color || props.theme.secondaryColor};
  border: 2px solid ${(props) => props.color || props.theme.primaryColor};
  margin-left: 10px;
  position: relative;
`;
export const CheckboxInput = styled.input`
  width: 100%;
  position: absolute;
  z-index: -1;
  left: 89px;
  background: #ffffff;
  visibility: hidden;
  &:checked + ${CheckboxCheckmark}:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    height: 8px;
    width: 8px;
    background: green;
  }
`;
export const CheckboxWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  flex-basis: 50%;
`;
export const CheckboxLabel = styled.label`
  background: #ffffff;
  position: relative;
  align-items: center;
  line-height: 20px;
  cursor: pointer;
`;

export const CheckboxText = styled.span`
  width: 100%;
  font-size: 11px;
  vertical-align: middle;
`;
const Checkbox = ({ value, ...props }) => {
  const handleChange = (event) => {
    // console.log(props);
    props.handleChange(event);
    // props.reset();
  };
  return (
    <CheckboxWrapper>
      <CheckboxLabel htmlFor={value}>
        <CheckboxText>{value.toUpperCase()}</CheckboxText>
        <CheckboxInput
          id={value}
          name={value}
          checked={props.checked}
          type="checkbox"
          onChange={(event) => {
            handleChange(event);
          }}
          value={value}
        />
        <CheckboxCheckmark />
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};

export default Checkbox;
