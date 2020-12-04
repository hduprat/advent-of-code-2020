import { Color, modifiers, colors } from "./consoleColors";

export const title = (message: string, color?: Color) => {
  console.log(
    `${modifiers.bold}${color ? colors[color] : ""}${message}${modifiers.reset}`
  );
};

export const lineBreak = () => {
  console.log("");
};

export const result = (message: string, result: unknown) => {
  console.log(
    message,
    `${modifiers.bold}${colors.yellow}${result}${modifiers.reset}`
  );
};

export const text = console.log;

export const error = (message: string) => {
  console.log(`${colors.red}${message}${modifiers.reset}`);
};
