import React from "react";
const Checkbox = ({ value, ...props }) => {
  const handleChange = (event) => {
    console.log(props);
    props.handleChange(event);
    // props.reset();
  };
  return (
    <label htmlFor={value}>
      <span>{value}</span>
      <input
        id={value}
        name={value}
        checked={props.checked}
        type='checkbox'
        onChange={(event) => {
          handleChange(event);
        }}
        value={value}
      />
    </label>
  );
};

export default Checkbox;
