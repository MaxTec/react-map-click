import { darken, lighten, invert, rgba } from 'polished';
import styled from 'styled-components';

export const SearchInput = styled.input`
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-size: ${(props) => {
    return `${props.theme.fontSize}`;
  }};
  outline: none;
  color: ${(props) => props.theme.color.text};
  /* padding-inline: 0.5rem;
  padding-block: 0.25rem; */
  border-inline: 0;
  border-block: ${(props) => {
    return `${props.theme.borderWidth} solid ${props.theme.color.primary}`;
  }};
  box-shadow: ${(props) => {
    return `${props.theme.boxShadow}`;
  }};
  &::placeholder {
    color: ${(props) => lighten(0.5, props.theme.color.text)};
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 200px;
  height: ${(props) => {
    return `${props.height}px`;
  }};
  padding-bottom: 35px;
  background: #ffffff;
  overflow: hidden;
  position: absolute;
  left: -202px;
  z-index: 100;
  top: -2px;
  box-sizing: border-box;
  border-style: solid;
  border-width: ${(props) => {
    return `${props.theme.borderWidth}`;
  }};
  border-color: ${(props) => {
    return `${props.theme.color.primary}`;
  }};
  /* border: ${(props) => {
    return `2px solid ${props.theme.color.primary}`;
  }}; */
  border-right: 0;
`;

export const SearchContainer = styled.ul`
  width: 100%;
  /* max-height: 600px; */
  max-height: calc(600px - 141px);
  height: 100%;
  background: #ffffff;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-track {
    background-color: lightgrey;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => lighten(0.05, props.theme.color.primary)};
    opacity: 0.1;
    cursor: pointer;
    &:hover {
      opacity: 1;
      background-color: ${(props) => props.theme.color.primary};
    }
  }
`;
export const SearchItem = styled.li`
  width: 100%;
  position: relative;
  min-height: 35px;
  line-height: 35px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: ${(props) => {
    return `1px solid ${props.theme.color.neutral.light}`;
  }};
`;
export const SearchItemInner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.35rem;
  height: 35px;
  background-color: ${(props) => {
    return props.theme.color.primary;
  }};
  color: ${(props) => {
    return props.theme.color.neutral.light;
  }};
`;

export const LotContainer = styled.ul`
  width: 100%;
  color: ${(props) => {
    return props.theme.secondaryColor;
  }};
`;

export const HideButton = styled.button`
  width: 100%;
  position: absolute;
  height: 40px;
  line-height: 0;
  width: 40px;
  left: -40px;
  top: ${(props) => {
    return `-${props.theme.borderWidth}`;
  }};
  border-radius: 5px 0px 0px 5px;
  cursor: pointer;
  border: ${(props) => {
    return `${props.theme.borderWidth} solid ${props.theme.color.primary}`;
  }};
  color: ${(props) => {
    return props.theme.color.primary;
  }};
  background-color: ${(props) => {
    return `${props.theme.color.neutral.light}`;
  }};
`;

export const FilterContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => {
    return props.theme.color.neutral.light;
  }};
`;

export const WrapSearchInput = styled.div`
  position: relative;
`;

export const CloseSearch = styled.div`
  position: absolute;
  cursor: pointer;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
`;

export const LotItem = styled.li`
  width: 100%;
  background-color: ${(props) => {
    return props.theme.color.neutral.lighten;
  }};
  color: ${(props) => {
    return props.theme.color.primary;
  }};
  padding: 0 1rem;
  &:hover {
    background-color: ${(props) => {
      return rgba(props.theme.color.primary, 0.2);
    }};
    color: ${(props) => {
      return invert(props.theme.color.neutral.light);
    }};
  }
`;
