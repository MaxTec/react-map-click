// import './styles.styl';
import { darken, lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';

export const DeveloperSet = styled.div`
  position: absolute;
  top: 20px;
  right: -2px;
  padding: 0.5rem;
  max-width: 250px;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: ${(props) => {
    return `${props.theme.color.neutral.light}`;
  }};
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
`;

export const DeveloperNote = styled.div`
  padding: 0.5rem;
  font-size: ${(props) => props.theme.fontSize};
  color: ${(props) => props.theme.color.primary};
`;
export const Pre = styled.pre`
  width: 400px;
  white-space: normal;
  font-size: 0.8rem;
  color: ${(props) => props.theme.color.neutral.dark};
`;
// eslint-disable-next-line react/display-name
const Developer = React.forwardRef((data, ref) => {
  return (
    <DeveloperSet>
      <DeveloperNote>
        <small>Haz click para copiar al portapapeles</small>
      </DeveloperNote>
      <Pre ref={ref}>{JSON.stringify(data, null, 2)}</Pre>
    </DeveloperSet>
  );
});

export default Developer;
