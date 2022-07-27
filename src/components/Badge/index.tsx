import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 11px;
  line-height: 20px;
  text-align: center;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  position: ${(props) => {
    if (!props.position) return false;
    return `absolute`;
  }};
  right: ${(props) => {
    if (props.position && props.position === 'right') return '10px';
    return false;
  }};
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
  background-color: ${(props) => props.theme.color.neutral.light};
  color: ${(props) => props.theme.color.primary};
`;
const Badge = ({ counter, position, ...props }) => {
  return (
    <Container hasData={counter > 0} position={position}>
      {counter}
    </Container>
  );
};

export default Badge;
