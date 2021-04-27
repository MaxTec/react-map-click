import React from "react";
import styled from "styled-components";
export const Container = styled.div`
  width: 100%;
  max-width: 200px;
  max-height: 100%;
  background: #ffffff;
  overflow: hidden;
  padding: 1rem;
  text-align: center;
  border: ${(props) => {
    console.log(props);
    return `1px solid ${props.theme.secondaryColor}`;
  }};
`;
const Empty = () => {
  return <Container>No se encontró ningún elemento</Container>;
};

export default Empty;
