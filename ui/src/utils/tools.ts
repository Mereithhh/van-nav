import { useRef, useCallback } from "react";

export const useDebounce = (fn: any, delay: number) => {
  const { current } = useRef<{ time: any }>({ time: null });
  return useCallback(
    (...args: any[]) => {
      if (current.time) {
        clearTimeout(current.time);
        current.time = null;
      }
      current.time = setTimeout(() => {
        fn.apply(this, args);
        clearTimeout(current.time);
        current.time = null;
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, delay]
  );
};