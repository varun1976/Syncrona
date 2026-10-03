import { create } from "zustand";
import { THEMES } from "../constants";

const DEFAULT_THEME = "cloud-neumorphism";

const getInitialTheme = () => {
  const saved = localStorage.getItem("chat-theme");
  if (saved && THEMES.includes(saved)) {
    return saved;
  }
  return DEFAULT_THEME;
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    const validTheme = THEMES.includes(theme) ? theme : DEFAULT_THEME;
    localStorage.setItem("chat-theme", validTheme);
    set({ theme: validTheme });
  },
}));