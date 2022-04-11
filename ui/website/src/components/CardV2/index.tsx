import "./index.css"
const Card = ({ title, url, des, logo, catelog, onClick }) => {
  return (
    <a href={url} onClick={()=>{
      onClick()
    }} target="_blank" rel="noreferrer" className="card-box">
      <div className="card-content">
        <div className="card-left">
          <img src={logo} alt={title} />
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
