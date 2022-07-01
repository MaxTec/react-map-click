import { darken } from 'polished';
import styled from 'styled-components';
import { ButtonContainer } from '../Button';
export const ToolbarMap = styled.div`
  /* background-color: ${(props) => {
    return `${props.theme.secondaryColor}`;
  }}; */
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  /* border-radius: ${(props) => {
    return `${props.theme.borderRadius}`;
  }}; */
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  & ${ButtonContainer}:not(:last-child) {
    margin-bottom: 2.5px;
  }
`;
export const ToolbarMapClose = styled.button`
  color: ${(props) => props.theme.color.neutral.light};
  /* margin-top: 5x; */
`;
