export function decodeAuto(disableTimeBased: boolean = false) {
  const d = new Date().getHours();
  const night = d > 18 || d < 8;
  if (typeof window == "undefined") {
    // 服务端渲染时的逻辑
    if (disableTimeBased) {
      return "auto-light"; // 默认亮色
    }
    if (night) {
      return "auto-dark";
    } else {
      return "auto-light";
    }
  }

  // 客户端逻辑
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (disableTimeBased) {
    // 仅跟随系统主题
    return systemPrefersDark ? "auto-dark" : "auto-light";
  }

  // 时间或系统主题满足其一即使用暗色
  if (night || systemPrefersDark) {
    return "auto-dark";
  } else {
    return "auto-light";
  }
}
export const decodeTheme = (t: "auto" | "light" | "dark", disableTimeBased: boolean = false) => {
  if (t === "auto") {
    return decodeAuto(disableTimeBased);
  } else {
    return t;
  }
};
export const applyTheme = (t: string) => {
  if (t.includes("light")) {
    const bodyEl = document.querySelector("body")!;
    bodyEl.classList.toggle("dark-mode", false);
  } else {
    const bodyEl = document.querySelector("body")!;
    bodyEl.classList.toggle("dark-mode", true);
  }
};
export const initTheme = () => {
  if (typeof localStorage == "undefined") {
    return "auto";
  }
  // 2种情况： 1. 自动。 2.手动
  if (!("theme" in localStorage) || localStorage.theme === "auto") {
    return "auto";
  } else {
    if (localStorage.theme === "dark") {
      return "dark";
    } else {
      return "light";
    }
  }
};
