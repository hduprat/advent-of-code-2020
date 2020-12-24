import { lineBreak, text } from "../utils/console";
import { colors, modifiers } from "../utils/consoleColors";
import { coords2str, str2coords } from "./coords";

/**
 * A type describing a hexagonal tiling.
 *
 * - **Key:** The center coordinates of a given tile (ex `0,0` or `-2,-1`)
 * - **Value:** `true` if the tile is black, `false` if it is white.
 */
export type HexTiling = Map<string, boolean>;

const DIRECTION_REGEX = /e|ne|nw|w|sw|se/g;

export const fillHexTiling = (
  instructions: string[],
  verbose: boolean = true
): HexTiling => {
  const tiling = new Map<string, boolean>();

  instructions.forEach((instruction) => {
    if (verbose) text("instruction:", instruction);
    let [x, y] = [0, 0];
    const directions = instruction.match(DIRECTION_REGEX);
    directions.forEach((direction) => {
      switch (direction) {
        case "e":
          x += 2;
          return;
        case "ne":
          x += 1;
          y -= 1;
          return;
        case "nw":
          x -= 1;
          y -= 1;
          return;
        case "w":
          x -= 2;
          return;
        case "sw":
          x -= 1;
          y += 1;
          return;
        case "se":
          x += 1;
          y += 1;
          return;
        default:
          return;
      }
    });
    const key = coords2str([x, y]);
    if (verbose) text("Flip the tile in coordinates", key);
    if (tiling.has(key)) tiling.set(key, !tiling.get(key));
    else tiling.set(key, true);
    if (verbose)
      text(
        "It becomes",
        tiling.get(key)
          ? colors.bgWhite +
              modifiers.bold +
              colors.black +
              "black" +
              modifiers.reset
          : "white" + modifiers.reset
      );
    if (verbose) lineBreak();
  });

  return tiling;
};

export const countBlackTiles = (tiling: HexTiling): number => {
  let count = 0;
  for (const [, isBlack] of tiling) {
    if (isBlack) count++;
  }
  return count;
};

