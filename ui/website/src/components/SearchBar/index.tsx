import "./index.scss";
// import { useState } from 'react';

interface SearchBarProps {
  setSearchText: (t: string) => void;
}
const SearchBar = (props: SearchBarProps) => {
  return (
    <div className="search span-3">
      <div className="search-wraper">
        <input
          type="search"
          placeholder="Let's go."
          onChange={(ev) => {
            const v = ev.target.value.trim();
            props.setSearchText(v);
          }}
        ></input>
      </div>
    </div>
  );
};

export default SearchBar;
