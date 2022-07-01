import PropTypes from 'prop-types';
import React from 'react';
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscSettingsGear,
  VscSymbolColor,
} from 'react-icons/vsc';
import styled from 'styled-components';

import Button from '../../Button';
// Define our button
const NavbarWindow = styled.div`
  /* font-size: 1em; */
  font-size: ${(props) => props.theme.fontSize};
  width: ${(props) => {
    return props.width + 3;
  }}px;
  margin: 0 auto;
  padding: 0.35em;
  color: ${(props) => props.theme.color.primary};
  background-color: ${(props) => props.theme.color.neutral.light};
  border-radius: ${(props) =>
    `${props.theme.borderRadius} ${props.theme.borderRadius} 0px 0px`};
  /* border-radius: 5px 5px 0px 0px; */
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
`;
const Controls = styled.div`
  justify-content: space-between;
  max-width: 120px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 5px;
`;
const NavbarWindowInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const WindowNavBar = (props) => {
  // !NOTA: pasa como prop
  const d = new Date();
  let hour = d.getHours();
  // ! NOTE: migrate all dictionary words to external file
  return (
    <React.Fragment>
      <NavbarWindow {...props}>
        <NavbarWindowInner>
          <div className="navbar-window__title">
            {/* Hola, Buenas{' '}
            {hour > 12 ? (hour > 20 ? 'Noches;' : 'Tardes') : 'Dias'}
            {hour > 7 ? <span>&#127769;</span> : <span>&#127774;</span>} */}
            <Button
              width="200px"
              onClick={() => {
                props.toggleTheme();
              }}
            >
              <VscSettingsGear size="1.3em" />
            </Button>
          </div>
          <Controls>
            <Button fit>
              <VscChromeMinimize />
            </Button>
            <Button fit>
              <VscChromeClose />
            </Button>
            <Button fit>
              <VscChromeMaximize
                onClick={() => {
                  props.fullWidth(true);
                }}
              />
            </Button>
          </Controls>
        </NavbarWindowInner>
      </NavbarWindow>
    </React.Fragment>
  );
};
WindowNavBar.propTypes = {
  toggleTheme: PropTypes.func,
  children: PropTypes.node,
};
export default WindowNavBar;
