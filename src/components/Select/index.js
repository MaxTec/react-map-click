import { lighten } from 'polished';
import React, { useEffect, useRef, useState } from 'react';
import { VscChevronDown, VscChevronUp } from 'react-icons/vsc';
import styled from 'styled-components';

import useOnClickOutside from '../../hooks/clickOutside';

const SelectWrapper = styled.div`
  width: 130px;
  display: inline-block;
  position: absolute;
  z-index: 100;
  top: 10px;
  left: 10px;
`;
const DropDownContainer = styled('div')`
  max-height: 500px;
  overflow-y: auto;
  box-shadow: ${(props) => props.theme.shadow};
  position: relative;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: lightgrey;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => lighten(0.05, props.theme.color.primary)};
    opacity: 0.1;
    cursor: pointer;
    &:hover {
      opacity: 1;
      background-color: ${(props) => props.theme.color.primary};
    }
  }
  background-color: #fff;
  border-inline: ${(props) => props.color || props.theme.borderWidth} solid
    ${(props) => props.color || props.theme.primaryColor};
  border-block-end: 2px solid
    ${(props) => props.color || props.theme.primaryColor};
`;
const List = styled('ul')``;
const ListItem = styled('li')`
  cursor: pointer;
  padding-inline: 0.5rem;
  line-height: 35px;
  color: ${(props) => props.color || props.theme.color.primary};
  font-size: ${(props) => props.theme.fontSize};
  display: block;
  &:hover {
    background-color: ${(props) => lighten(0.4, props.theme.color.primary)};
  }
`;
const Selected = styled('div')`
  border-style: solid;
  border-width: ${(props) => props.theme.borderWidth || 2};
  border-color: ${(props) => props.color || props.theme.color.primary};
  color: ${(props) => props.color || props.theme.color.primary};
  font-size: ${(props) => props.theme.fontSize};
  padding: 0.5rem;
  height: 35px;
  line-height: 35px;
  /* border-radius: 5px; */
  border-radius: ${(props) => (props.active ? '5px 5px 0px 0px' : '5px')};
  cursor: pointer;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Search = styled('input')`
  height: 30px;
  box-sizing: border-box;
  /* padding: 0.25rem; */
  width: 100%;
  background-color: #fff;
  outline: none;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.color.primary};
  color: ${(props) => props.theme.color.text};
  position: sticky;
  top: 0;
  left: 0;
  &::placeholder {
    color: ${(props) => lighten(0.5, props.theme.color.text)};
  }
`;
const Select = ({ data, value, callback, ...props }) => {
  // console.log(data);
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stringSearch, setStringSearch] = useState('');
  useOnClickOutside(ref, () => setOpen(false));
  useEffect(() => {
    setVal(data.levels[0]);
    setFiltered(data.levels);
  }, []);
  useEffect(() => {
    if (val.id && val.id !== '') {
      setOpen(false);
    }
  }, [val]);
  useEffect(() => {
    if (stringSearch !== '') {
      const filtered = data.levels.filter((ele) =>
        ele.title.toLowerCase().includes(stringSearch.toLowerCase())
      );
      setFiltered(filtered);
    } else {
      setFiltered(data.levels);
    }
  }, [stringSearch]);
  return (
    <React.Fragment>
      <SelectWrapper ref={ref}>
        <Selected onClick={(e) => setOpen(!open)} active={open}>
          {val.title}
          {open ? (
            <VscChevronUp size="1.3em" />
          ) : (
            <VscChevronDown size="1.3em" />
          )}
        </Selected>

        {open && (
          <>
            <DropDownContainer>
              <Search
                type="text"
                placeholder="Manzana No.:"
                value={stringSearch}
                onChange={(e) => {
                  setStringSearch(e.target.value);
                }}
              />
              <List>
                {filtered &&
                  filtered.length > 0 &&
                  filtered.map((ele, index) => {
                    return (
                      <ListItem
                        key={index}
                        value={ele.id}
                        onClick={() => {
                          setVal(ele);
                          callback(ele.id);
                          if (stringSearch !== '') setStringSearch('');
                        }}
                      >
                        {ele.title}
                      </ListItem>
                    );
                  })}
              </List>
            </DropDownContainer>
          </>
        )}
      </SelectWrapper>
    </React.Fragment>
  );
};

export default Select;
