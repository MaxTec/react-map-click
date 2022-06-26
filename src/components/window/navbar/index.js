import PropTypes from 'prop-types';
import styled from 'styled-components';
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
  return (
    <NavbarWindow {...props}>
      <div className="navbar-window__inner">
        <div className="navbar-window__title">
          Hola, Buenas {hour > 12 ? (hour > 8 ? 'Noches;' : 'Tardes') : 'Dias'}
          <span>{hour > 12 ? '&#127769;' : '&#127774;'}</span>
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
WindowNavBar.propTypes = {
  toggleTheme: PropTypes.func,
  children: PropTypes.node,
};
export default WindowNavBar;
