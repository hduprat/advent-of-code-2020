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
const HEX_DIRECTIONS = [
  [2, 0],
  [1, -1],
  [-1, -1],
  [-2, 0],
  [-1, 1],
  [1, 1],
];

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

export const createHexNeighborMap = (
  tiling: HexTiling,
  verbose: boolean = true
): Map<string, number> => {
  const neighborMap = new Map<string, number>();

  for (const [coords, isBlack] of tiling) {
    if (verbose) text("Tile", coords, "is", isBlack ? "black" : "white");
    const [x, y] = str2coords(coords);
    if (isBlack) {
      // Tile is black, so we need to add it in the neighbor map because it might be flipped
      if (!neighborMap.has(coords)) neighborMap.set(coords, 0);

      HEX_DIRECTIONS.forEach(([dx, dy]) => {
        const neighborKey = coords2str([x + dx, y + dy]);
        const count = neighborMap.has(neighborKey)
          ? neighborMap.get(neighborKey) + 1
          : 1;
        if (verbose)
          text("Tile", neighborKey, "has", count, "black tiles around");
        neighborMap.set(neighborKey, count);
      });
    }
    if (verbose) lineBreak();
  }

  return neighborMap;
};

export const flipGreatLivingHexTiling = (
  tiling: HexTiling,
  verbose: boolean = true
): void => {
  const neighborMap = createHexNeighborMap(tiling, verbose);
  for (const [coord, blackAdjacentTileCount] of neighborMap) {
    if (!tiling.get(coord)) {
      // Tile is white
      if (verbose)
        text(
          "Tile",
          coord,
          "is white and has",
          blackAdjacentTileCount,
          "black tiles around"
        );
      if (blackAdjacentTileCount === 2) {
        if (verbose) text("Flipping tile!");
        tiling.set(coord, true);
      }
    } else {
      // Tile is black
      if (verbose)
        text(
          "Tile",
          coord,
          "is black and has",
          blackAdjacentTileCount,
          "black tiles around"
        );
      if (blackAdjacentTileCount === 0 || blackAdjacentTileCount > 2) {
        if (verbose) text("Flipping tile!");
        tiling.set(coord, false);
      }
    }
  }
  if (verbose) lineBreak();
};
