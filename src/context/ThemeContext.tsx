'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'arbor' | 'obsidian' | 'atelier' | 'slate';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  arbor: {
    id: 'arbor',
    name: 'Arbor Charcoal',
    bg: '#0c0d10',
    surface: '#121418',
    surfaceSubtle: '#181a20',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#f5f4f0',
    textMuted: '#9a9ca3',
    accent: '#d4af37', // Warm architectural gold/brass
    accentText: '#e5c158',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Noir',
    bg: '#050507',
    surface: '#0b0b0e',
    surfaceSubtle: '#121217',
    border: 'rgba(255, 255, 255, 0.07)',
    text: '#ffffff',
    textMuted: '#8e8f96',
    accent: '#ffffff',
    accentText: '#ffffff',
  },
  atelier: {
    id: 'atelier',
    name: 'Linen Atelier',
    bg: '#111215',
    surface: '#17181d',
    surfaceSubtle: '#1e2026',
    border: 'rgba(255, 255, 255, 0.09)',
    text: '#f7f6f2',
    textMuted: '#a0a2aa',
    accent: '#38bdf8', // Clean cyan
    accentText: '#7dd3fc',
  },
  slate: {
    id: 'slate',
    name: 'Nordic Slate',
    bg: '#0a0e14',
    surface: '#111620',
    surfaceSubtle: '#171e2c',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#edf2f7',
    textMuted: '#8d97a5',
    accent: '#10b981', // Emerald
    accentText: '#34d399',
  },
};

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.arbor,
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>('arbor');

  useEffect(() => {
    const saved = localStorage.getItem('devforge-theme') as ThemeId;
    if (saved && THEMES[saved]) {
      setThemeId(saved);
    }
  }, []);

  const handleSetTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('devforge-theme', id);
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId], setThemeId: handleSetTheme }}>
      <div 
        style={{
          backgroundColor: THEMES[themeId].bg,
          color: THEMES[themeId].text,
          minHeight: '100vh',
          width: '100%',
          transition: 'background-color 0.25s ease, color 0.25s ease',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
