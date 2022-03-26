import { useEffect } from "react";
import "./index.scss";
// import { useState } from 'react';

interface SearchBarProps {
  setSearchText: (t: string) => void;
}
const SearchBar = (props: SearchBarProps) => {
  const onKeyDown = (ev) => {
    if(ev.code === "Enter") {
      const el = document.getElementById("search-bar");
      if (el) {
        el.focus();
      }
    }
  }
  useEffect(()=> {
    document.addEventListener("keydown",onKeyDown);
    return () => {
      document.removeEventListener("keydown",onKeyDown)

    }
  })
  return (
    <div className="search span-3">
      <div className="search-wraper">
        <input
          id="search-bar"
          type="search"
          placeholder="按回车键聚焦并搜索应用"
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
