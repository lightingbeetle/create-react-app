/* eslint-disable import/prefer-default-export */

import { rem } from './utils';

export const sizes = {
  headerHeight: '60px',
  sidebarWidth: '230px',
  menuWidth: '180px',
};

export const breakpoints = {
  xs: '0',
  s: '480px',
  m: '640px',
  l: '960px',
  xl: '1280px',
};

export const spaces = {
  mini: '3px',
  tiny: '6px',
  small: '12px',
  default: '18px',
  medium: '24px',
  large: '48px',
  xlarge: '60px',
};

export const contentSpacing = spaces.large;

export const fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';

export const fontSizes = {
  base: '16px',
  small: '14px',
  tiny: '12px',
};

export const fontWeights = {
  normal: 400,
  bold: 700,
};

export const lineHeights = {
  base: 1.5,
};

export const nav = {
  listTopBottomIndent: rem(5), // TODO refactor/remove
};

export const zIndex = {
  header: 3,
  sidebar: 101,
  overlay: 100,
  menuButton: 101,
  preview: 1000,
};

const functionalColors = {
  froly: '#e06c75',
  orchid: '#c678dd',
  portage: '#7881dd',
  malibu: '#61afef',
  viking: '#56b6c2',
  darkCyan: '#049588',
  oxley: '#6fa572',
  olivine: '#98c379',
  wildRice: '#e8d571',
  whiskey: '#d19a66',
  coralTree: '#b67963',
  redDamask: '#cb6b4d',
};

/* *** TODO temp names (while full design won't exist) *** */
export const colors = {
  accent: '#f85013',
  main: '#F7F7F7',
  white: '#fff',
  black: '#1d1f21',
  grey: '#f2f2f2',
  greyDark: '#949494',
  success: '#98c379',
  warning: '#e8d571',
  error: '#e06c75',
  info: '#61afef',
  overlay: 'rgba(255, 255, 255, 0.5)',
  ...functionalColors,
};

export const previewBackgrounds = {
  white: colors.white,
  dark: colors.greyDark,
  accent: colors.accent,
};

export const shadows = {
  default: '0 24px 48px -12px rgba(0,0,0,0.05)',
};

export const borderRadius = {
  default: '0',
};

export const contentWidth = '55rem';
