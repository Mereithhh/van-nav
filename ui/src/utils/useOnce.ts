import { useEffect, useRef } from 'react';

/**
 * 确保回调函数只执行一次的 Hook，即使在 Strict Mode 下也生效
 * @param callback 需要执行的回调函数
 * @param deps 依赖数组（可选）
 */
export function useOnce(callback: () => void | (() => void), deps?: React.DependencyList) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      return callback();
    }
  }, deps);
}
