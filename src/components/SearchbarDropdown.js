import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/SearchBarDropdown.css'

const SearchbarDropdown = (props) => {
    const { options, onInputChange } = props;
    const ulRef = useRef();
    const inputRef = useRef();
    useEffect(() => {
      inputRef.current.addEventListener('click', (event) => {
        event.stopPropagation();
        ulRef.current.style.display = 'flex';
        onInputChange(event);
      });
      document.addEventListener('click', (event) => {
        ulRef.current.style.display = 'none';
      });
    }, []);
    return (
      <div className="search-bar-dropdown" id="searchBarDropdown" >
        <input
          id="search-bar"
          type="text"
          className="form-control"
          placeholder="Search" style={{
            // border:'2px solid #167D42',
          borderLeft:'2px solid #167D42',
          borderTop:'2px solid #167D42',
          borderBottom:'2px solid #167D42',
          borderRight:"none",
        borderRadius:'10px 0px 0px 10px',
        boxSizing: 'border-box'}}
          ref={inputRef}
          onChange={onInputChange}
         disabled/>
        <ul id="results" className="list-group" ref={ulRef}>
          {options.map((option, index) => {
            return (
              <button
                type="button"
                key={index}
                onClick={(e) => {
                  inputRef.current.value = option;
                  document.getElementById("search-bar").click();
                }}
                className="list-group-item list-group-item-action"
              >
                {option}
              </button>
            );
          })}
        </ul>
      </div>
    );
  }
  export default SearchbarDropdown;