import { text } from "../utils/console";
import { colors } from "../utils/consoleColors";
import { Direction } from "./direction";
import { getGridVariant } from "./grid";

export interface Tile {
  id: string;
  grid: string[];
}

export const tileCache: Map<string, Tile> = new Map<string, Tile>();

export const getTileVariant = (tile: Tile, variant: string): Tile => {
  const tileCacheKey = `${tile.id}-${variant}`;
  if (!tileCache.has(tileCacheKey)) {
    tileCache.set(tileCacheKey, {
      id: tileCacheKey,
      grid: getGridVariant(tile.grid, variant),
    });
  }
  return tileCache.get(tileCacheKey);
};

export const getBorder = (tile: Tile, direction: Direction): string => {
  switch (direction) {
    case "top":
      return tile.grid[0];
    case "bottom":
      return tile.grid[tile.grid.length - 1];
    case "left":
      return tile.grid.map((line) => line[0]).join("");
    case "right":
      return tile.grid.map((line) => line[line.length - 1]).join("");
  }
};
