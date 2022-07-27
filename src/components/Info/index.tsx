import React, { useState } from 'react';
import { VscInfo } from 'react-icons/vsc';
import styled, { css } from 'styled-components';

const Btn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0px;
  cursor: pointer;
  transition: all 0.5s;
  box-shadow: ${(props) => {
    return `${props.theme.boxShadow}`;
  }};
  color: ${(props) => {
    return `${props.theme.color.primary}`;
  }};
  background-color: ${(props) => {
    return `${props.theme.color.neutral.light}`;
  }};
  ${(props) => {
    if (props.open) {
      return css`
        top: 0px;
        right: 0px;
      `;
    }
    return false;
  }}
`;
const Container = styled.div`
  width: 250px;
  min-height: 100px;
  padding: 1rem;
  position: absolute;
  top: 15px;
  right: 15px;
  clip-path: circle(12% at 89.8% 25.5%);
  transition: all 0.5s;
  ${(props) => {
    if (props.open) {
      return css`
        clip-path: circle(130% at 87.5% 25%);
        box-shadow: ${(props) => {
          return `${props.theme.boxShadow}`;
        }};
      `;
    }
    return false;
  }}
  border-radius: ${(props) => {
    return `${props.theme.borderRadius}`;
  }};
  color: ${(props) => {
    return `${props.theme.color.neutral.dark}`;
  }};
  background-color: ${(props) => {
    return `${props.theme.color.neutral.light}`;
  }};
`;
const Title = styled.div`
  height: 20px;
  width: 200px;
  line-height: 20px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  letter-spacing: 0.35px;
  color: ${(props) => {
    return `${props.theme.color.primary}`;
  }};
`;

const Content = styled.div`
  overflow: auto;
  max-height: 400px;
  padding-block: 0.5rem;
  color: ${(props) => {
    return `${props.theme.color.neutral.dark}`;
  }};
  font-size: 13px;
`;
const AdditionalInfo = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  return (
    <Container open={open}>
      <Btn
        open={open}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <VscInfo size="2em" />
      </Btn>
      <Title>{data.title}</Title>
      <Content>
        {open && children}
        {/* {data.description}
        <pre>{JSON.stringify(data)}</pre> */}
      </Content>
      {/* <Content>{open && children}</Content> */}
    </Container>
  );
};

export default AdditionalInfo;
