import { useMemo } from "react";
import "./index.css";
import { getLogoUrl } from "../../utils/check";
import { getJumpTarget } from "../../utils/setting";
const Card = ({ title, url, des, logo, catelog, onClick, index, isSearching, noImageMode }) => {
  const el = useMemo(() => {
    if (url === "admin") {
      return <img src={logo} alt={title} />
    } else {
        return <img src={getLogoUrl(logo)} alt={title} />
    }
  }, [logo, title, url])
  
  // 处理空分类，显示为"未分类"
  const displayCatelog = useMemo(() => {
    return catelog === null || catelog === undefined || catelog === "" || (typeof catelog === 'string' && catelog.trim() === "") 
      ? "未分类" 
      : catelog;
  }, [catelog]);
  
  const showNumIndex = index < 10 && isSearching;
  return (
    <a
      href={url === "toggleJumpTarget" ? undefined : url}
      onClick={() => {
        onClick();
      }}
      target={getJumpTarget() === "blank" ? "_blank" : "_self"}
      rel="noreferrer"
      className="card-box"
    >
      {showNumIndex && <span className="card-index">{index + 1}</span>}
      <div className="card-content">
        {!noImageMode && (
          <div className="card-left">
            {el}
          </div>
        )}
        <div className="card-right">
          <div className="card-right-top">
            <span className="card-right-title" title={title}>{title}</span>
            <span className="card-tag" title={displayCatelog}>{displayCatelog}</span>
          </div>
          <div className="card-right-bottom" title={des}>{des}</div>
        </div>
      </div>
    </a>
  );
};

export default Card;
