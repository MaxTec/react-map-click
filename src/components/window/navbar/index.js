import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Button from '../../Button';
// Define our button
const NavbarWindow = styled.div`
  font-size: 1em;
  width: ${(props) => {
    return props.width + 3;
  }}px;
  margin: 0 auto;
  margin-inline-top: 1em;
  padding: 0.25em 1em;
  color: ${(props) => props.theme.primaryColor};
  border-radius: 5px 5px px 0px;
  border-inline: 2px solid ${(props) => props.theme.primaryColor};
  border-top: 2px solid ${(props) => props.theme.primaryColor};
`;
const WindowNavBar = (props) => {
  console.log(props);
  // !NOTA: pasa como prop
  const d = new Date();
  let hour = d.getHours();
  // ! NOTE: migrate all dictionary words to external file
  return (
    <React.Fragment>
      <NavbarWindow {...props}>
        <div className="navbar-window__inner">
          <div className="navbar-window__title">
            Hola, Buenas{' '}
            {hour > 12 ? (hour > 20 ? 'Noches;' : 'Tardes') : 'Dias'}
            {hour > 7 ? <span>&#127769;</span> : <span>&#127774;</span>}
            <Button
              width="200px"
              onClick={() => {
                props.toggleTheme();
              }}
            >
              Toggle theme
            </Button>
          </div>
        </div>
      </NavbarWindow>
    </React.Fragment>
  );
};
WindowNavBar.propTypes = {
  toggleTheme: PropTypes.func,
  children: PropTypes.node,
};
export default WindowNavBar;
