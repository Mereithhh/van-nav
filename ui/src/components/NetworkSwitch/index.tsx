import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./index.css";

const NetworkSwitch = ({ showGithub }: { showGithub: boolean }) => {
  const [networkMode, setNetworkMode] = useState<'internet' | 'intranet'>('internet');
  const { current } = useRef<any>({ hasInit: false });

  useLayoutEffect(() => {
    if (!current.hasInit) {
      current.hasInit = true;
      const savedMode = localStorage.getItem("networkMode");
      if (savedMode === 'intranet' || savedMode === 'internet') {
        setNetworkMode(savedMode);
      } else {
        setNetworkMode('internet');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("networkMode", networkMode);
    // 触发自定义事件，通知其他组件网络模式已切换
    window.dispatchEvent(new CustomEvent('networkModeChanged', { 
      detail: { mode: networkMode } 
    }));
  }, [networkMode]);

  const handleSwitch = () => {
    setNetworkMode(prev => prev === 'internet' ? 'intranet' : 'internet');
  };

  const internetIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="internet icon"
      width={20}
      height={20}
    >
      <circle cx="12" cy="12" r="10" fill="white" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="7" fill="none" stroke="black" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4" fill="none" stroke="black" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="black"/>
    </svg>
  );

  const intranetIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="intranet icon"
      width={20}
      height={20}
    >
      <circle cx="12" cy="12" r="10" fill="white" stroke="white" stroke-width="2"/>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="black"/>
      <rect x="7.5" y="7.5" width="9" height="2" fill="white"/>
      <rect x="7.5" y="10.5" width="9" height="2" fill="white"/>
      <rect x="7.5" y="13.5" width="9" height="2" fill="white"/>
    </svg>
  );

  return (
    <div 
      className={`network-switch-box ${showGithub ? "" : "hide-github"}`} 
      onClick={handleSwitch}
      title={networkMode === 'internet' ? '当前：外网模式，点击切换到内网' : '当前：内网模式，点击切换到外网'}
    >
      {networkMode === 'internet' ? internetIcon : intranetIcon}
    </div>
  );
};

export default NetworkSwitch;

