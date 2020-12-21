import { text } from "../utils/console";
import { toNumber } from "../utils/number";
import { reverseString } from "../utils/string";

export const displayGrid = (grid: string[]): void => {
  grid.forEach((line) => text(line));
};

/**
 * Rotates one quarter of a turn clockwise.
 * @param grid The base grid
 */
export const rotateGridOnce = (grid: string[]): string[] => {
  const size = grid.length;
  const rotatedGrid: string[] = new Array(size).fill("");

  for (let i = 0; i < size; i++) {
    const line = grid[i];
    for (let j = 0; j < size; j++) {
      rotatedGrid[j] = line[j] + rotatedGrid[j];
    }
  }

  return rotatedGrid;
};

/**
 * Flips a grid along the horizontal or vertical axis.
 * @param grid The base grid
 * @param axis The flip axis
 */
export const flipGrid = (
  grid: string[],
  axis: "vertical" | "horizontal"
): string[] => {
  if (axis === "horizontal") {
    return grid.reverse();
  }
  return grid.map((line) => reverseString(line));
};

export const VARIANT_REGEX = /R(\d)(H|V)?/;

export const getGridVariant = (grid: string[], variant: string): string[] => {
  const [_, rotations, axis] = VARIANT_REGEX.exec(variant);
  let finalGrid = grid;
  for (let n = 0; n < parseInt(rotations); n++) {
    finalGrid = rotateGridOnce(finalGrid);
  }
  if (!axis) return finalGrid;
  if (axis == "H") {
    return flipGrid(finalGrid, "horizontal");
  }
  return flipGrid(finalGrid, "vertical");
};

export const combineVariants = (v1: string, v2: string): string => {
  // text("Combining following variants:", v1, "and", v2);
  const [, r1str, f1] = VARIANT_REGEX.exec(v1);
  const [, r2str, f2] = VARIANT_REGEX.exec(v2);

  const [r1, r2] = [r1str, r2str].map(toNumber);
  // text("Rotation factors:", r1, "and", r2);
  // text("Flip factors:", f1, "and", f2);

  let R = (r1 + r2) % 4;
  // text("Combined rotation factor:", R);

  let F = !f1 ? "" : r2 % 2 === 0 ? f1 : f1 === "H" ? "V" : "H";
  // text("Modified flip factor:", F);

  if (!f2) return `R${R}${F}`;
  if (!F) return `R${R}${f2}`;
  if (f2 === F) return `R${R}`;
  return `R${(R + 2) % 4}`;
};

export const decodeVariant = (
  variant?: string
): { r: number; f: "H" | "V" | "" } => {
  if (!variant) return { r: 0, f: "" };
  const [, rStr, f] = VARIANT_REGEX.exec(variant);
  const r = toNumber(rStr);
  switch (f) {
    case "H":
    case "V":
      return { r, f };
    default:
      return { r, f: "" };
  }
};
