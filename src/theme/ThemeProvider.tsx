import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createTheme, type AccentName, type ThemeName, type ThemeTokens } from './tokens';
import { themeToCssVars } from './cssVars';

export interface ThemeContextValue {
  theme: ThemeTokens;
  themeName: ThemeName;
  accent: AccentName;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  theme?: ThemeName;
  accent?: AccentName;
  tokens?: ThemeTokens;
  children: ReactNode;
}

export function ThemeProvider({
  theme = 'mocha',
  accent = 'blue',
  tokens,
  children,
  style,
  className,
  ...rest
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => {
    const resolved = tokens ?? createTheme(theme, accent);
    return {
      theme: resolved,
      themeName: resolved.name,
      accent,
    };
  }, [theme, accent, tokens]);

  const cssVars = useMemo(() => themeToCssVars(value.theme), [value.theme]);
  const mergedStyle: CSSProperties = { ...cssVars, ...style };

  return createElement(
    ThemeContext.Provider,
    { value },
    createElement(
      'div',
      {
        ...rest,
        className: ['tui-root', className].filter(Boolean).join(' '),
        style: mergedStyle,
        'data-tui-theme': value.themeName,
      },
      children,
    ),
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
