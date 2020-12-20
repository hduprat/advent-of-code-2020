import { reverseString } from "../utils/string";
import { Tile, Direction, TileAdjacence } from "./types";

const getBorderAdjacentInTile = (
  border: string,
  tile: Tile
): Direction | null => {
  const top = tile.grid[0];
  if (top === border) return "top";
  if (reverseString(top) === border) return "top";
  const bottom = tile.grid[tile.grid.length - 1];
  if (bottom === border) return "bottom";
  if (reverseString(bottom) === border) return "bottom";
  const left = tile.grid.map((line) => line[0]).join("");
  if (left === border) return "left";
  if (reverseString(left) === border) return "left";
  const right = tile.grid.map((line) => line[line.length - 1]).join("");
  if (right === border) return "right";
  if (reverseString(right) === border) return "right";
  return null;
};

export const buildTileAdjacenceMap = (
  tileMap: Map<string, Tile>
): Map<string, TileAdjacence> => {
  const adjacenceMap = new Map<string, TileAdjacence>();
  const passedTileIds: string[] = [];

  tileMap.forEach((tile, id) => {
    const borders = {
      top: tile.grid[0],
      bottom: tile.grid[tile.grid.length - 1],
      left: tile.grid.map((line) => line[0]).join(""),
      right: tile.grid.map((line) => line[line.length - 1]).join(""),
    };

    const adjacence = adjacenceMap.has(id) ? adjacenceMap.get(id) : {};

    tileMap.forEach((comparedTile, comparedId) => {
      if (comparedId === id) return;
      if (passedTileIds.includes(comparedId)) return;
      ["top", "right", "bottom", "left"].forEach((direction) => {
        if (adjacence[direction]) return;

        const adjacenceToDirection = getBorderAdjacentInTile(
          borders[direction],
          comparedTile
        );
        if (!adjacenceToDirection) return;
        adjacence[direction] = comparedId;
        if (adjacenceMap.has(comparedId)) {
          adjacenceMap.set(comparedId, {
            ...adjacenceMap.get(comparedId),
            [adjacenceToDirection]: id,
          });
          return;
        }
        adjacenceMap.set(comparedId, {
          [adjacenceToDirection]: id,
        });
      });
    });
    adjacenceMap.set(id, adjacence);
    passedTileIds.push(id);
  });

  return adjacenceMap;
};
