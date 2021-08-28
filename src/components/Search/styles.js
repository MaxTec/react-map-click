import styled from "styled-components";

export const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  padding-left: 1rem;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  padding-right: 0.25rem;
  border: ${(props) => {
    return `1px solid ${props.theme.secondaryColor}`;
  }};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 200px;
  max-height: ${(props) => {
    return `${props.height}px`;
  }};
  padding-bottom: 26px;
  background: #ffffff;
  overflow: hidden;
  border: ${(props) => {
    console.log(props);
    return `1px solid ${props.theme.secondaryColor}`;
  }};
`;

export const SearchContainer = styled.ul`
  width: 100%;
  height: 100%;
  max-height: calc(100% - 60px);
  background: #ffffff;
  overflow-y: scroll;
`;
export const SearchItem = styled.li`
  width: 100%;
  position: relative;

  min-height: 35px;
  line-height: 35px;
  cursor: pointer;
  font-size: "Gill Sans Extrabold", Helvetica, sans-serif;
  /* padding: 0 0.25rem; */
  border-bottom: ${(props) => {
    return `1px solid ${props.theme.secondaryColor}`;
  }};
`;
export const SearchItemInner = styled.div`
  width: 100%;
  display: "block";
  padding: 0 0.25rem;
  background-color: ${(props) => {
    return props.theme.primaryColor;
  }};
  color: ${(props) => {
    return props.theme.secondaryColor;
  }};
`;
