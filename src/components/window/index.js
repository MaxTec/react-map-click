import PropTypes from 'prop-types';
import { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import reset from 'styled-reset';

import WindowNavBar from './navbar';
import { darkTheme, lightTheme } from './theme';

const GlobalStyle = createGlobalStyle`
 ${reset}
 @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
 *, *:before, *:after{
   box-sizing:border-box;
 }
  body {
    background-color: tomato;
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
    &:hover {
      opacity:0.8;
    }
  }
  //clase requerida para animaciones en mapas
  /* .map-container > svg > g{
    transition:transform 0.25s ease-in-out
  } */
`;
const BodyWindow = styled.div`
  width: ${(props) => {
    console.log(props);
    return props.width + 3;
  }}px;
  height: ${(props) => props.height + 10}px;
  border-radius: 0px 0px 5px 5px;
  color: ${(props) => props.theme.primaryColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
  position: relative;
  overflow: hidden;
  margin: auto;
`;
// aca puedo recibir las props
const Window = ({ theme, ...props }) => {
  // const mergedTheme = theme ? { ...lightTheme, ...theme } : lightTheme;
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <WindowNavBar
        {...props}
        toggleTheme={() => {
          setIsDark(!isDark);
        }}
      />
      <BodyWindow {...props}>{props.children}</BodyWindow>
    </ThemeProvider>
  );
};

Window.propTypes = {
  theme: PropTypes.obj,
  children: PropTypes.node,
};
export default Window;
