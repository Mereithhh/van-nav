import { useEffect } from "react";
import "./index.css";
// import { useState } from 'react';

interface SearchBarProps {
  setSearchText: (t: string) => void;
  searchString: string;
}
const SearchBar = (props: SearchBarProps) => {
  const onKeyDown = (ev) => {
    const reg = /[a-zA-Z0-9]|[\u4e00-\u9fa5]/g;
    if (ev.code === "Enter" || reg.test(ev.key)) {
      const el = document.getElementById("search-bar");
      if (el) {
        el.focus();
      }
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  })
  return (
    <div className="search span-3">
      <div className="search-wraper">
        <input
          id="search-bar"
          type="search"
          placeholder="按任意键直接开始搜索"
          value={props.searchString}
          onChange={(ev) => {
            const v = ev.target.value
            props.setSearchText(v);
          }}
        ></input>
      </div>
    </div>
  );
};

export default SearchBar;
