import { useMemo } from "react";
import "./index.css";
import { getLogoUrl } from "../../utils/check";
const Card = ({ title, url, des, logo, catelog, onClick }) => {
  const el = useMemo(() => {
    if (url === "admin") {
      return <img src={logo} alt={title} />
    } else {
      if (logo.split(".").pop().includes("svg")) {
        return <embed src={getLogoUrl(logo)} type="image/svg+xml" />
      } else {
        return <img src={getLogoUrl(logo)} alt={title} />
      }
    }
  }, [logo, title, url])
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
            <span className="card-right-title" title={title}>{title}</span>
            <span className="card-tag" title={catelog}>{catelog}</span>
          </div>
          <div className="card-right-bottom" title={des}>{des}</div>
        </div>
      </div>
    </a>
  );
};

export default Card;
