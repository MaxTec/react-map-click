import React, { useState } from "react";
import reset from "styled-reset";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import WindowNavBar from "./navbar";
const GlobalStyle = createGlobalStyle`
 ${reset}
 *, *:before, *:after{
   box-sizing:border-box;
 }
  body {
    background-color: tomato;
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
    &:hover {
      opacity:0.8;
    }
  }
  //clase requerida para animaciones en mapas
  /* .map-container > svg > g{
    transition:transform 0.35s ease-in-out
  } */
`;
const Window = ({ theme, ...props }) => {
  // const mergedTheme = theme ? { ...lightTheme, ...theme } : lightTheme;
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <WindowNavBar
        toggleTheme={() => {
          setIsDark(!isDark);
        }}
      />
      {props.children}
    </ThemeProvider>
  );
};

export default Window;
