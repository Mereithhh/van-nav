import { useMemo } from "react";
import "./index.css";
const Card = ({ title, url, des, logo, catelog, onClick }) => {
  const el = useMemo(()=>{
    if (url === "admin") {
      return <img src={logo} alt={title} />
    } else {
      if (logo.split(".").pop() === "svg") {
        return <embed src={`/api/img?url=${logo}`} type="image/svg+xml" />
      } else {
        return <img src={`/api/img?url=${logo}`} alt={title} />
      }
    }
  },[logo,title,url])
  return (
    <a
      href={url}
      onClick={() => {
        onClick();
      }}
      target="_blank"
      rel="noreferrer"
      className="card-box"
    >
      <div className="card-content">
        <div className="card-left">
          {el}
          {/* {url === "admin" ? (
            <img src={logo} alt={title} />
          ) : (
            <img src={`/api/img?url=${logo}`} alt={title} />
          )} */}
        </div>
        <div className="card-right">
          <div className="card-right-top">
            <span className="card-right-title">{title}</span>
            <span className="card-tag">{catelog}</span>
          </div>
          <div className="card-right-bottom">{des}</div>
        </div>
      </div>
    </a>
  );
};

export default Card;
