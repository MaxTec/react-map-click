import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
// Define our button
const ButtonContainer = styled.button`
  font-size: 1em;
  width: ${(props) => props.width || '100%'};
  padding: 1em;
  color: ${(props) => props.theme.secondaryColor};
  background-color: ${(props) => props.theme.primaryColor};
  border-radius: 5px;
  border: 2px solid ${(props) => props.theme.primaryColor};
  cursor: pointer;
`;
const Button = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <ButtonContainer {...props}>{children || 'Press Me'}</ButtonContainer>
    </React.Fragment>
  );
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
