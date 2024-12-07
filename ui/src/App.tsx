import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { Spin } from 'antd';
import { decodeTheme, initTheme } from './utils/theme';
import './App.css';

// 使用 React.lazy 懒加载组件
const Home = React.lazy(() => import('./pages/Home'));
const AdminPage = React.lazy(() => import('./pages/admin').then(module => ({ default: module.AdminPage })));
const Login = React.lazy(() => import('./pages/Login'));

// 懒加载管理后台的子页面
const Tools = React.lazy(() => import('./pages/admin/tabs/Tools').then(module => ({ default: module.Tools })));
const Catelog = React.lazy(() => import('./pages/admin/tabs/Catelog').then(module => ({ default: module.Catelog })));
const ApiToken = React.lazy(() => import('./pages/admin/tabs/ApiToken').then(module => ({ default: module.ApiToken })));
const Setting = React.lazy(() => import('./pages/admin/tabs/Setting').then(module => ({ default: module.Setting })));

// 加载中的占位组件
const LoadingFallback = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = initTheme();
    const decodedTheme = decodeTheme(theme);
    setIsDarkMode(decodedTheme.includes('dark'));

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement) {
          setIsDarkMode(mutation.target.classList.contains('dark-mode'));
        }
      });
    });

    const body = document.querySelector('body');
    if (body) {
      observer.observe(body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: isDarkMode ? '#121212' : '#ffffff',
      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#272e3b',
    }}>
      <Spin size="large" tip="加载中..." />
    </div>
  );
};

function App() {
  return (
    <AntApp>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Tools />} />
              <Route path="tools" element={<Tools />} />
              <Route path="categories" element={<Catelog />} />
              <Route path="api-token" element={<ApiToken />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AntApp>
  );
}

export default App;


