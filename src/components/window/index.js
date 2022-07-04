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
    transition:transform 0.35s ease-in-out
  }
  input[type="text"]{
    padding-inline:0.5rem;
    padding-block:0.25rem;
  }
`;
const BodyWindow = styled.div`
  width: ${(props) => {
    // console.log(props);
    return props.width - 2;
  }}px;
  /* height: ${(props) => props.height + 10}px; */
  border-radius: 0px 0px 5px 5px;
  color: ${(props) => props.theme.primaryColor};
  /* border: 2px solid ${(props) => props.theme.primaryColor}; */
  position: relative;
  margin: auto;
  // display: flex;
`;
// aca puedo recibir las props
const Window = ({ theme, ...props }) => {
  // const mergedTheme = theme ? { ...lightTheme, ...theme } : lightTheme;
  const [isDark, setIsDark] = useState(false);
  return (
    <React.Fragment>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <WindowNavBar
          // {...props}
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
