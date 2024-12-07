import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from "./serviceWorker"
// import reportWebVitals from './reportWebVitals';

console.log("欢迎使用 Van Nav 项目")
console.log("项目地址: https://github.com/mereithhh/van-nav")


createRoot(
  document.getElementById('root') as HTMLElement
).render(<App />);

serviceWorker.register(null);