import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeConstants";
import type { ThemeSettings, ThemeContextValue } from "./ThemeConstants";
import { THEME_KEY, DEFAULT_THEME_SETTINGS } from "./ThemeConstants";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [savedTheme, setSavedTheme] = useState<ThemeSettings>(() => {
    const storedValue = localStorage.getItem(THEME_KEY);
    if (!storedValue) {
      return DEFAULT_THEME_SETTINGS;
    }

    try {
      return JSON.parse(storedValue) as ThemeSettings;
    } catch {
      return DEFAULT_THEME_SETTINGS;
    }
  });

  const [draftTheme, setDraftTheme] =
    useState<ThemeSettings>(savedTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(savedTheme));
    document.documentElement.style.setProperty("--bg", savedTheme.bg);
    document.documentElement.style.setProperty("--fore", savedTheme.fg);
    document.documentElement.style.setProperty(
      "--primary",
      savedTheme.primary,
    );
  }, [savedTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--bg", draftTheme.bg);
    document.documentElement.style.setProperty("--fore", draftTheme.fg);
    document.documentElement.style.setProperty(
      "--primary",
      draftTheme.primary,
    );
  }, [draftTheme]);



  function updateDraftTheme(nextSettings: Partial<ThemeSettings>) {
    setDraftTheme((currentSettings) => ({
      ...currentSettings,
      ...nextSettings,
    }));
  }

  function saveSettings() {
    setSavedTheme(draftTheme);
  }

  function resetDraftTheme() {
    setDraftTheme(savedTheme);
  }

  const value: ThemeContextValue = {
    savedTheme,
    draftTheme,
    updateDraftTheme,
    saveSettings,
    resetDraftTheme,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
