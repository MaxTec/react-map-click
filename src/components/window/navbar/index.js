import { invert, rgba } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscCode,
  VscSymbolColor,
} from 'react-icons/vsc';
import styled from 'styled-components';

import Button from '../../Button';
import Dropdown from '../../DropDown';
// Define our button
const NavbarWindow = styled.div`
  /* font-size: 1em; */
  font-size: ${(props) => props.theme.fontSize};
  width: ${(props) => {
    return props.width;
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
const LiItem = styled.li`
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => {
      return rgba(props.theme.color.primary, 0.2);
    }};
    color: ${(props) => {
      return invert(props.theme.color.neutral.light);
    }};
  }
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
            <Dropdown>
              <ul>
                <LiItem
                  onClick={() => {
                    props.toggleTheme();
                  }}
                >
                  Toggle theme{' '}
                  <VscSymbolColor style={{ marginLeft: 10 }} size="1.3rem" />
                </LiItem>
                <LiItem>
                  Enable developer tools{' '}
                  <VscCode style={{ marginLeft: 10 }} size="1.3rem" />
                </LiItem>
              </ul>
            </Dropdown>
          </div>
          <Controls>
            <Button fit>
              <VscChromeMinimize />
            </Button>
            <Button fit>
              <VscChromeMaximize
                onClick={() => {
                  props.fullWidth(true);
                }}
              />
            </Button>
            <Button fit>
              <VscChromeClose />
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
