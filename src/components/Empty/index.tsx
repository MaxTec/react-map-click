import React from 'react';
import { TbMoodEmpty } from 'react-icons/tb';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 200px;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    return `${props.theme.color.primary}`;
  }};
`;
export const P = styled.p`

  font-size: ${(props) => {
    return `${props.fontSize}`;
  }};
`;
const Empty = () => {
  return (
    <React.Fragment>
      <Container>
        <TbMoodEmpty size="4em" />
        <P>No se encontró ningún elemento</P>
      </Container>
    </React.Fragment>
  );
};

export default Empty;
