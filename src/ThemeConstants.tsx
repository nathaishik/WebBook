import { createContext, useContext } from "react";

export interface ThemeSettings {
    bg: string;
    fg: string;
    primary: string; 
}

export type ThemeContextValue = {
  savedTheme: ThemeSettings;
  draftTheme: ThemeSettings;
  updateDraftTheme: (nextSettings: Partial<ThemeSettings>) => void;
  saveSettings: () => void;
  resetDraftTheme: () => void;
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
    bg: "#1f2b72",
    fg: "#25e048",
    primary: "#4985da",
};

export const THEME_KEY = "notebook_app_theme";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}