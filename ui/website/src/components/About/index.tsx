
import './index.scss';
import {  useEffect } from 'react';
const About = (props:any) => {
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'd') {
        window.localStorage.setItem("door","1");
        console.log("有点door");
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    }
  });

  
  return (
    <div className="aboutcard" >
      <h1>关于</h1>
      <p className="aboutcard-line1">平时总是需要找各种各样的小工具，很不方便，所以就想着做一个工具站都集合在一起了，2333...</p>
      <p className="aboutcard-line2">点击卡片任意处即可关闭</p>
      <p className="aboutcard-footer">联系方式: wanglu@mereith.com</p>
    </div>
  );
}

export default About;