export const modifiers = {
  bold: "\x1b[1m",
  light: "\x1b[2m",
  italic: "\x1b[3m",
  fraktur: "\x1b[20m",
  reset: "\x1b[0m",
};

export const colors = {
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  cyan: "\x1b[36m",
  black: "\x1b[30m",
  bgRed: "\x1b[41m",
  bgBlack: "\x1b[100m",
  bgWhite: "\x1b[107m",
};

export type Modifier = keyof typeof modifiers;
export type Color = keyof typeof colors;
