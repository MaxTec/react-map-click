import React from "react";
import styled from "styled-components";
// Define our button
const NavbarWindow = styled.div`
  font-size: 1em;
  width: 100%;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: ${(props) => props.theme.primaryColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
`;
const WindowNavBar = (props) => {
  return (
    <NavbarWindow>
      <div className='navbar-window__inner'>
        <div className='navbar-window__title'>
          HOLA
          <button
            onClick={() => {
              props.toggleTheme();
            }}
          >
            Toggle theme
          </button>
        </div>
      </div>
    </NavbarWindow>
  );
};

export default WindowNavBar;
