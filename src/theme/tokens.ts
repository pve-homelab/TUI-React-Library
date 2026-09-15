export type ThemeName = 'mocha' | 'latte';
export type AccentName = 'blue' | 'teal' | 'mauve' | 'peach' | 'green';

export interface ColorTokens {
  bg: string;
  surface0: string;
  surface1: string;
  surface2: string;
  overlay0: string;
  overlay1: string;
  text: string;
  subtext0: string;
  subtext1: string;
  accent: string;
  accentMuted: string;
  green: string;
  yellow: string;
  red: string;
  peach: string;
  teal: string;
  mauve: string;
  blue: string;
  border: string;
  focus: string;
  selection: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeTokens {
  name: ThemeName;
  colors: ColorTokens;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  space: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
  };
  radius: {
    none: string;
    sm: string;
    md: string;
  };
  borderWidth: string;
  zIndex: {
    dropdown: number;
    modal: number;
    toast: number;
    tooltip: number;
  };
}

const accents: Record<AccentName, { solid: string; muted: string }> = {
  blue: { solid: '#89b4fa', muted: 'rgba(137, 180, 250, 0.18)' },
  teal: { solid: '#94e2d5', muted: 'rgba(148, 226, 213, 0.18)' },
  mauve: { solid: '#cba6f7', muted: 'rgba(203, 166, 247, 0.18)' },
  peach: { solid: '#fab387', muted: 'rgba(250, 179, 135, 0.18)' },
  green: { solid: '#a6e3a1', muted: 'rgba(166, 227, 161, 0.18)' },
};

const mochaBase = {
  bg: '#1e1e2e',
  surface0: '#313244',
  surface1: '#45475a',
  surface2: '#585b70',
  overlay0: '#6c7086',
  overlay1: '#7f849c',
  text: '#cdd6f4',
  subtext0: '#a6adc8',
  subtext1: '#bac2de',
  green: '#a6e3a1',
  yellow: '#f9e2af',
  red: '#f38ba8',
  peach: '#fab387',
  teal: '#94e2d5',
  mauve: '#cba6f7',
  blue: '#89b4fa',
};

const latteBase = {
  bg: '#eff1f5',
  surface0: '#e6e9ef',
  surface1: '#dce0e8',
  surface2: '#ccd0da',
  overlay0: '#9ca0b0',
  overlay1: '#8c8fa1',
  text: '#4c4f69',
  subtext0: '#6c6f85',
  subtext1: '#5c5f77',
  green: '#40a02b',
  yellow: '#df8e1d',
  red: '#d20f39',
  peach: '#fe640b',
  teal: '#179299',
  mauve: '#8839ef',
  blue: '#1e66f5',
};

const lightAccents: Record<AccentName, { solid: string; muted: string }> = {
  blue: { solid: '#1e66f5', muted: 'rgba(30, 102, 245, 0.14)' },
  teal: { solid: '#179299', muted: 'rgba(23, 146, 153, 0.14)' },
  mauve: { solid: '#8839ef', muted: 'rgba(136, 57, 239, 0.14)' },
  peach: { solid: '#fe640b', muted: 'rgba(254, 100, 11, 0.14)' },
  green: { solid: '#40a02b', muted: 'rgba(64, 160, 43, 0.14)' },
};

export function createTheme(name: ThemeName = 'mocha', accent: AccentName = 'blue'): ThemeTokens {
  const base = name === 'mocha' ? mochaBase : latteBase;
  const accentPair = name === 'mocha' ? accents[accent] : lightAccents[accent];

  const colors: ColorTokens = {
    ...base,
    accent: accentPair.solid,
    accentMuted: accentPair.muted,
    border: base.surface1,
    focus: accentPair.solid,
    selection: accentPair.muted,
    danger: base.red,
    warning: base.yellow,
    success: base.green,
    info: base.blue,
  };

  return {
    name,
    colors,
    fontFamily:
      '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
    fontSize: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      lg: '15px',
      xl: '18px',
    },
    space: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '32px',
      8: '40px',
    },
    radius: {
      none: '0',
      sm: '2px',
      md: '4px',
    },
    borderWidth: '1px',
    zIndex: {
      dropdown: 1000,
      modal: 1100,
      toast: 1200,
      tooltip: 1300,
    },
  };
}

export const defaultTheme = createTheme('mocha', 'blue');
