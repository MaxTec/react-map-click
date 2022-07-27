/* eslint-disable prettier/prettier */
import { filter, includes, map, mapValues, omit, pick, some } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { VscClose, VscFilter, VscSearch } from 'react-icons/vsc';

import Badge from '../Badge';
import Empty from '../Empty';
import Checkbox from '../Forms/Checkbox';
import {
  CloseSearch,
  Container,
  FilterContainer,
  HideButton,
  LotContainer,
  LotItem,
  SearchContainer,
  SearchInput,
  SearchItem,
  SearchItemInner,
  WrapSearchInput,
} from './styles';

const Search = ({ data, showTooltip, height, changeBlock, level }) => {
  const [filtered, setFiltered] = useState(data);
  let [filters, setFilters] = useState([]);
  let [hide, setHide] = useState(true);
  const [searchString, setSearchString] = useState('');
  const inputEl = useRef(null);
  useEffect(() => {
    setFiltered(data.levels);
    setSearchString('');
  }, [filters]);
  useEffect(() => {
    if (searchString === '') setFiltered(data.levels);
  }, [searchString]);
  useEffect(() => {
    let optionFilters = Object.keys(
      omit(data.levels[0].locations[0], ['id', 'id_huerto', 'fill', 'x', 'y'])
    ).map((ele) => {
      return { id: ele, value: ele, isChecked: true };
    });
    setFilters(optionFilters);
  }, []);
  const handleCheckChildElement = (event) => {
    const hasItems = filters.filter((ele) => ele.isChecked);
    const newFilters = filters.map((ele) => {
      if (ele.value === event.target.value) {
        ele.isChecked = hasItems.length > 1 ? event.target.checked : true;
      }
      return ele;
    });
    setFilters(newFilters);
  };
  return (
    <React.Fragment>
      {hide ? (
        <HideButton
          onClick={() => {
            setHide(!hide);
          }}
        >
          <VscFilter size="1.5em" />
        </HideButton>
      ) : (
        <Container height={height}>
          {/* <FilterContainer className="filter-btns">
            {filters.map((val) => {
              return (
                <Checkbox
                  key={val.id}
                  value={val.id}
                  checked={val.isChecked}
                  handleChange={handleCheckChildElement}
                />
              );
            })}
          </FilterContainer> */}
          <WrapSearchInput>
            <SearchInput
              isSearching={searchString !== ''}
              type="text"
              placeholder="Buscar"
              value={searchString}
              ref={inputEl}
              onChange={(e) => {
                const filtros = filters
                  .filter((ele) => ele.isChecked === true)
                  .map((ele) => ele.value);
                const value = e.target.value.toLowerCase();
                const filteredData = filter(data.levels, (blocks) =>
                  some(blocks.locations, (loc) =>
                    Object.values(Object.values(pick(loc, filtros))).some(
                      (el) => includes(el.toString().toLowerCase(), value)
                    )
                  )
                );
                const res = map(filteredData, (ele) => {
                  return mapValues(omit(ele, ['map']), (i, key) => {
                    if (key === 'locations')
                      return filter(i, (item) =>
                        some(pick(item, filtros), (el) =>
                          includes(el.toString().toLowerCase(), value)
                        )
                      );
                    return i;
                  });
                });
                setSearchString(e.target.value);
                setFiltered(res);
              }}
            />

            <CloseSearch
              onClick={() =>
                searchString !== '' ? setSearchString('') : false
              }
            >
              {searchString !== '' ? (
                <VscClose size="1em" />
              ) : (
                <VscSearch size="1em" />
              )}
            </CloseSearch>
          </WrapSearchInput>
          <SearchContainer>
            {filtered && filtered.length > 0 ? (
              filtered.map((ele) => {
                return (
                  <SearchItemComponent
                    key={ele.id}
                    data={ele}
                    showTooltip={showTooltip}
                    level={level}
                    changeBlock={changeBlock}
                    clearSearch={() => {
                      setSearchString('');
                    }}
                  />
                );
              })
            ) : (
              <Empty />
            )}
          </SearchContainer>
        </Container>
      )}
    </React.Fragment>
  );
};

const SearchItemComponent = ({
  data,
  showTooltip,
  level,
  changeBlock,
  clearSearch,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SearchItem
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >
      <SearchItemInner style={{ position: 'relative' }}>
        <span>{data.title}</span>
        <Badge counter={data.locations.length} position="right" />
      </SearchItemInner>

      {open && (
        <>
          <LotContainer>
            {data.locations.map((ele) => {
              return (
                <LotItem
                  key={ele.id}
                  data-category={ele.category}
                  onClick={(e) => {
                    e.stopPropagation();
                    // console.log(ele.id);
                    if (data.id !== level) {
                      changeBlock(data.id, ele.id);
                    } else {
                      showTooltip(ele.id);
                    }
                    clearSearch('');
                  }}
                >
                  {ele.title}
                </LotItem>
              );
            })}
          </LotContainer>
        </>
      )}
    </SearchItem>
  );
};

Search.propTypes = {
  data: PropTypes.object.isRequired,
  level: PropTypes.string,
  showTooltip: PropTypes.func,
  height: PropTypes.number,
  changeBlock: PropTypes.func,
};
SearchItemComponent.propTypes = {
  data: PropTypes.object.isRequired,
  level: PropTypes.string,
  showTooltip: PropTypes.func,
  changeBlock: PropTypes.func,
  clearSearch: PropTypes.func,
};

export default Search;
