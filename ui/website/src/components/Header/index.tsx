import './index.scss';
import { useState } from 'react';
const Header = (props: any) => {
  const {onClick, data, curr, handleShowAbout} = props;
  const [Hover, setHover] = useState("");
  const renderList = () => {
    const lls: any = [];
    const newClass = (data) => {
      if (Hover !== "") {
        if (Hover === data) {
          return "item item-hover";
        } else {
          return "item";
        }
      } else {
        if (curr === data ) {
          return "item item-hover";
        } else {
          return "item";
        }
      }
    };
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      lls.push(
        <li 
          key={i} 
          className={newClass(item.type)}
          onClick={() => {onClick(item.type)}} 
          onMouseEnter={()=> {setHover(item.type)}}
          onMouseLeave={()=> {setHover("")}}

        >
          <span className="item-text">{item.type}</span>
        </li>
      );
    }
    return lls;
  };
  return (
    <header className='header'>
      <ul className='header-left'>{renderList()}</ul>
      <div className="header-right">
        <div className="about" onClick={()=>{handleShowAbout(true)}}>帮助</div>
      </div>
    </header>
  );
}

export default Header;