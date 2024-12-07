import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  items: MenuItem[];
  currentKey: string;
  onChange: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  currentKey,
  onChange
}) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`h-full bg-white border-r border-gray-200 transition-all duration-300 relative
      ${expanded ? 'w-64' : 'w-20'}`}>
      <nav className="pt-4 relative h-full">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            onClick={() => onChange(item.key)}
            className={`
              flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer no-underline
              border-l-4 
              ${(currentKey === item.key || location.pathname === item.path)
                ? 'bg-gray-100 border-blue-500'
                : 'border-transparent'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {expanded && <span className="ml-3 truncate">{item.label}</span>}
          </Link>
        ))}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-5 -right-3 p-2 hover:bg-gray-100 rounded-full 
          bg-white border border-gray-200 shadow-sm z-50 w-6 h-6 
          flex items-center justify-center text-sm"
        >
          {expanded ? '←' : '→'}
        </button>

        <a
          href="https://github.com/mereithhh/van-nav"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            absolute bottom-4 left-4
            flex items-center justify-start  py-2
            text-gray-600 hover:text-gray-900
          `}
        >
          <svg height="24" width="24" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          {expanded && <span className="ml-2">GitHub</span>}
        </a>
      </nav>
    </div>
  );
};