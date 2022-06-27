/* eslint-disable prettier/prettier */
import { filter, includes, map, mapValues, omit, pick, some } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Badge from '../Badge';
import Empty from '../Empty';
import Checkbox from '../Forms/Checkbox';
import {
  Container,
  SearchContainer,
  SearchInput,
  SearchItem,
  SearchItemInner,
} from './styles';

const Search = ({ data, showTooltip, height, changeBlock, level }) => {
  const [filtered, setFiltered] = useState(data);
  let [filters, setFilters] = useState([]);
  const [searchString, setSearchString] = useState('');
  const inputEl = useRef(null);
  useEffect(() => {
    setFiltered(data.levels);
    setSearchString('');
  }, [filters]);
  useEffect(() => {
    let optionFilters = Object.keys(
      omit(data.levels[0].locations[0], ['id', 'id_huerto', 'fill', 'x', 'y'])
    ).map((ele) => {
      return { id: ele,
value: ele,
isChecked: true };
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
      <Container height={height}>
        <div className="filter-btns">
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
        </div>
        <form action="">
          <SearchInput
            type="text"
            value={searchString}
            ref={inputEl}
            onChange={(e) => {
              const filtros = filters
                .filter((ele) => ele.isChecked === true)
                .map((ele) => ele.value);
              const value = e.target.value.toLowerCase();
              const filteredData = filter(data.levels, (blocks) =>
                some(blocks.locations, (loc) =>
                  Object.values(Object.values(pick(loc, filtros))).some((el) =>
                    includes(el.toString().toLowerCase(), value)
                  )
                )
              );
              const res = map(filteredData, (ele) => {
                return mapValues(omit(ele, ['map']), (i, key) => {
                  // return mapValues(omit(ele, ["map", "id"]), (i, key) => {
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
        </form>
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
                />
              );
            })
          ) : (
            <Empty />
          )}
        </SearchContainer>
      </Container>
    </React.Fragment>
  );
};

const SearchItemComponent = ({ data, showTooltip, level, changeBlock }) => {
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
          <ul className="nav-maps--content">
            {data.locations.map((ele) => {
              return (
                <li
                  key={ele.id}
                  className="nav-maps--children"
                  data-category={ele.category}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(ele.id);
                    // const { id } = data;
                    // const currentBlock = /landmarks-(.*)/.exec(data.id)[1];
                    // console.log(currentBlock, level, data.id);
                    if (data.id !== level) {
                      changeBlock(data.id, ele.id);
                    } else {
                      showTooltip(ele.id);
                    }
                  }}
                >
                  {ele.title}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </SearchItem>
  );
};

Search.propTypes = {
  data: PropTypes.object.isRequired,
  level: PropTypes.object,
  showTooltip: PropTypes.func,
  height: PropTypes.number,
  changeBlock: PropTypes.func,
};
SearchItemComponent.propTypes = {
  data: PropTypes.object.isRequired,
  level: PropTypes.object,
  showTooltip: PropTypes.func,
  changeBlock: PropTypes.func,
};

export default Search;
