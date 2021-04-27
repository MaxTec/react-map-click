import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  width: 18px;
  height: 18px;
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  position: ${(props) => {
    if (!props.position) return false;
    return `absolute`;
  }};
  right: ${(props) => {
    if (props.position && props.position == "right") return "10px";
    return false;
  }};
  border: ${(props) => {
    return `1px solid ${props.theme.secondaryColor}`;
  }};
`;
const Badge = ({ counter, position, ...props }) => {
  //   console.log(counter);
  return (
    <Container hasData={counter > 0} position={position}>
      {counter}
    </Container>
  );
};

export default Badge;
