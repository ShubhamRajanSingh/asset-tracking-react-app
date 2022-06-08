import * as React from 'react';
import '../styles/Dropdown.css'

const Dropdown = ({ label, value, options, onChange }) => {
    return (
      <label>
        {/* {label} */}
        <select value={value} onChange={onChange} >
          {options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  export default Dropdown;
  