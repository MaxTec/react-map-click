import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import reset from 'styled-reset';

import WindowNavBar from './navbar';
import { darkTheme, lightTheme } from './theme';

console.log(reset);
const GlobalStyle = createGlobalStyle`
 ${reset}
 button{
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
 }
 @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
 *, *:before, *:after{
   box-sizing:border-box;
 }
  body {
    background-color: #ffffff;
    font-family:  'Roboto', sans-serif;
    font-size: 14px;
  }
  ul{
    list-style:none;
    padding:0;
    margin:0;
  }
  .active-location{
    stroke: #ffffff;
    stroke-width: 1.5;
    transform:scale(1)
  }
  //Hover para todos los elementos clickeables
  [id^=landmark] > *, svg > #items > * {
    cursor:pointer;
    stroke:0;
    &:hover {
      opacity:0.8;
    }
    &.selected{
      transition:all 0.5s;
      stroke:#ffffff;
      stroke-width: 2px;
      stroke-linejoin: round;
    }
  }
  //clase requerida para animaciones en mapas
  .zoomAble > svg > g{
    transition:transform 0.5s ease-in-out
  }
  input[type="text"]{
    padding-inline:0.5rem;
    padding-block:0.25rem;
  }
`;
const BodyWindow = styled.div`
  width: ${(props) => {
    return props.width;
  }}px;
  /* height: ${(props) => props.height + 10}px; */
  /* border-radius: 0px 0px 5px 5px; */
  color: ${(props) => props.theme.primaryColor};
  position: relative;
  margin: auto;
  z-index: 1000;
`;
const Window = ({ theme, ...props }) => {
  const [isDark, setIsDark] = useState(false);
  return (
    <React.Fragment>
      <ThemeProvider
        theme={
          isDark ? { ...darkTheme, ...theme } : { ...lightTheme, ...theme }
        }
      >
        <GlobalStyle />
        <WindowNavBar
          // {...props}
          width={props.width}
          toggleTheme={() => {
            setIsDark(!isDark);
          }}
        />
        <BodyWindow {...props}>
          <>{props.children}</>
        </BodyWindow>
      </ThemeProvider>
    </React.Fragment>
  );
};

Window.propTypes = {
  theme: PropTypes.obj,
  children: PropTypes.node,
};
export default Window;
