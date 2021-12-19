import "./index.scss";
import { useState } from "react";
const Card = ({ title, url, des, logo }) => {
  const [hover, setHover] = useState(false);


  const newClassBox = () => {
    if (hover) {
      return "card-box card-box-hover";
    }
    return "card-box";
  };
  const newClassTitle = () => {
    if (hover) {
      return "card-title card-title-hover";
    }
    return "card-title";
  };
  // const genTag = () => {
  //   if (type === "webpage") {
  //     return (
  //       <img
  //         src="https://pic.mereith.com/img/web%20link.png-slim"
  //         width="20px"
  //         height="20px"
  //         alt="webpage"
  //         className="card-tag"
  //       ></img>
  //     );
  //   } else if (type === "service") {
  //     return (
  //       <img
  //         src="https://pic.mereith.com/img/Optional%20Services.png-slim"
  //         width="20px"
  //         height="20px"
  //         alt="service"
  //         className="card-tag"
  //       ></img>
  //     );
  //   } else {
  //     // 默认是网页
  //     return (
  //       <img
  //         src="https://pic.mereith.com/img/web%20link.png-slim"
  //         width="20px"
  //         height="20px"
  //         alt="webpage"
  //         className="card-tag"
  //       ></img>
  //     );
  //   }
  // };
  return (
    <div
      className={newClassBox()}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.open(url);
      }}
    >
      <div className="card-header">
        <div className="card-header-left">
          <img src={logo} alt={title} width="40px" height="40px"/>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={newClassTitle()}
          >
            {title}
          </a>
        </div>
        {/* <div className="card-header-right">{genTag()}</div> */}
      </div>
      <div className="card-des">{des}</div>
      <div className="card-url">
        {url.replace("https://", "").replace("http://", "")}
      </div>
    </div>
  );
};

export default Card;
