import { decodeVariant } from "./grid";

export type Direction = "top" | "right" | "bottom" | "left";
export const DIRECTIONS: readonly Direction[] = [
  "top",
  "right",
  "bottom",
  "left",
];

export const oppositeDirection = (direction: Direction): Direction => {
  const index = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(index + 2) % 4];
};

export const getAbsoluteDirection = (
  direction: Direction,
  variant: string
): Direction => {
  const { r, f } = decodeVariant(variant);
  const index = DIRECTIONS.indexOf(direction);
  const rotatedIndex = (index + r) % 4;
  if (!f) return DIRECTIONS[rotatedIndex];
  if (f == "H")
    return DIRECTIONS[
      rotatedIndex % 2 === 0 ? (rotatedIndex + 2) % 4 : rotatedIndex
    ];
  if (f == "V")
    return DIRECTIONS[
      rotatedIndex % 2 === 1 ? (rotatedIndex + 2) % 4 : rotatedIndex
    ];
};

export const getVector = (direction: Direction): [number, number] => {
  switch (direction) {
    case "top":
      return [0, -1];
    case "right":
      return [1, 0];
    case "bottom":
      return [0, 1];
    case "left":
      return [-1, 0];
  }
};
