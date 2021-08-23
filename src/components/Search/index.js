import React, { useEffect, useState, useRef } from "react";
import Checkbox from "../Forms/Checkbox";
import { filter, includes, some, omit, pick, map, mapValues } from "lodash";
import { Container, SearchInput, SearchContainer, SearchItem, SearchItemInner } from "./styles";
import Badge from "../Badge";
import Empty from "../Empty";
const Search = ({ filters, data, handleCheckChieldElement, showTooltip, changeBlock, level, ...props }) => {
  const [filtered, setFiltered] = useState([]);
  const [searchString, setSearchString] = useState("");
  const inputEl = useRef(null);
  useEffect(() => {
    setFiltered(data.levels);
    setSearchString("");
  }, [JSON.stringify(filters)]);

  return (
    <>
      <Container>
        <div className='filter-btns'>
          {filters.map((val, i) => {
            return <Checkbox key={val.id} value={val.id} checked={val.isChecked} handleChange={handleCheckChieldElement} />;
          })}
        </div>
        <form action=''>
          <SearchInput
            type='text'
            value={searchString}
            ref={inputEl}
            onChange={(e) => {
              const filtros = filters.filter((ele) => ele.isChecked == true).map((ele) => ele.value);
              const value = e.target.value.toLowerCase();
              const filteredData = filter(data.levels, (blocks) =>
                some(blocks.locations, (loc) => Object.values(Object.values(pick(loc, filtros))).some((el) => includes(el.toString().toLowerCase(), value)))
              );
              const res = map(filteredData, (ele, key) => {
                return mapValues(omit(ele, ["map"]), (i, key) => {
                  // return mapValues(omit(ele, ["map", "id"]), (i, key) => {
                  if (key == "locations") return filter(i, (item) => some(pick(item, filtros), (el) => includes(el.toString().toLowerCase(), value)));
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
              return <SearchItemComponent key={ele.id} data={ele} showTooltip={showTooltip} level={level} changeBlock={changeBlock} />;
            })
          ) : (
            <Empty />
          )}
        </SearchContainer>
      </Container>
    </>
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
      <SearchItemInner style={{ position: "relative" }}>
        <span>{data.title}</span>
        <Badge counter={data.locations.length} position='right' />
      </SearchItemInner>

      {open && (
        <>
          <ul className='nav-maps--content'>
            {data.locations.map((ele) => {
              return (
                <li
                  key={ele.id}
                  className='nav-maps--children'
                  data-category={ele.category}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(ele.id);
                    // const { id } = data;
                    const currentBlock = /landmarks-(.*)/.exec(data.id)[1];
                    if (currentBlock != level) {
                      changeBlock(currentBlock, ele.id);
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

export default Search;
