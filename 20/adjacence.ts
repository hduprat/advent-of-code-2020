import { lineBreak, text } from "../utils/console";
import { toNumber } from "../utils/number";
import { reverseString } from "../utils/string";
import {
  Direction,
  DIRECTIONS,
  getAbsoluteDirection,
  oppositeDirection,
  getVector,
} from "./direction";
import { combineVariants } from "./grid";
import { Tile, getBorder, getTileVariant } from "./tile";

export type V2TileAdjacence = Map<Direction, string>;
export type AdjacenceGraph = Map<string, V2TileAdjacence>;

export const doTilesFit = (
  fixedTile: Tile,
  direction: Direction,
  tile: Tile,
  variant: string
): "fit" | "flip" | "no" => {
  const tileVariant = getTileVariant(tile, variant);
  const fixedBorder = getBorder(fixedTile, direction);
  const border = getBorder(tileVariant, oppositeDirection(direction));

  if (fixedBorder === border) return "fit";
  if (fixedBorder === reverseString(border)) return "flip";
  return "no";
};

const TILE_ID_REGEX = /(\d+)(-(R\d(H|V)?))?/;

export const getTileAdjacence = (
  fixedTile: Tile,
  tileMap: Map<string, Tile>
): V2TileAdjacence => {
  const adjacence: V2TileAdjacence = new Map<Direction, string>();
  DIRECTIONS.forEach((dir) => {
    tileMap.forEach((tile, id) => {
      if (TILE_ID_REGEX.exec(id)[1] === TILE_ID_REGEX.exec(fixedTile.id)[1])
        return;
      for (let r = 0; r < 4; r++) {
        const fits = doTilesFit(fixedTile, dir, tile, `R${r}`);
        if (fits === "no") continue;
        if (fits === "fit") {
          adjacence.set(dir, `${id}-R${r}`);
          return;
        }
        adjacence.set(
          dir,
          `${id}-R${r}${dir === "right" || dir === "left" ? "H" : "V"}`
        );
        return;
      }
    });
  });

  return adjacence;
};

export const buildAdjacenceGraph = (
  tileMap: Map<string, Tile>
): AdjacenceGraph => {
  const adjGraph = new Map<string, V2TileAdjacence>();
  tileMap.forEach((tile) => {
    adjGraph.set(tile.id, getTileAdjacence(tile, tileMap));
  });

  return adjGraph;
};

const extractIdAndVariant = (
  idWithVariant: string
): { id: string; variant: string } => {
  const [, id, , variantStr] = TILE_ID_REGEX.exec(idWithVariant);
  const variant = variantStr || "R0";

  return { id, variant };
};

const addVectorToCoords = (
  coords: string,
  [dx, dy]: [number, number]
): string => {
  const [x, y] = coords.split(",").map(toNumber);
  return [x + dx, y + dy].join(",");
};

export const placeTilesOnGrid = (
  startingTileVariant: string,
  adjGraph: AdjacenceGraph,
  tileMap: Map<string, Tile>,
  finalMap: Map<string, Tile> = new Map<string, Tile>(),
  coords: string = "0,0"
) => {
  // lineBreak();
  // text("Step", finalMap.size + 1);
  const { id, variant } = extractIdAndVariant(startingTileVariant);
  if (finalMap.has(coords)) return;
  finalMap.set(coords, getTileVariant(tileMap.get(id), variant));
  // text("Tile", startingTileVariant, "has been set to coords", coords);
  if (finalMap.size === tileMap.size) return;

  adjGraph.get(id).forEach((tileIdAndVariant, direction) => {
    const { id: nextId, variant: nextVariant } = extractIdAndVariant(
      tileIdAndVariant
    );
    const nextTile = `${nextId}-${combineVariants(nextVariant, variant)}`;
    const newDir = getAbsoluteDirection(direction, variant);
    // text("Next tile", nextTile, "will be put on the", newDir);
    placeTilesOnGrid(
      nextTile,
      adjGraph,
      tileMap,
      finalMap,
      addVectorToCoords(coords, getVector(newDir))
    );
  });
};

export const displayArrangementMapIds = (arrangementMap: Map<string, Tile>) => {
  let [xmin, ymin, xmax, ymax] = [0, 0, 0, 0];
  arrangementMap.forEach((_, coords) => {
    const [x, y] = coords.split(",").map(toNumber);
    xmin = Math.min(xmin, x);
    xmax = Math.max(xmax, x);
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
  });
  const lines: string[][] = [];
  for (let y = ymin; y <= ymax; y++) {
    lines.push([]);
    for (let x = xmin; x <= xmax; x++) {
      if (arrangementMap.has(`${x},${y}`))
        lines[y - ymin].push(arrangementMap.get(`${x},${y}`).id.padEnd(8));
      else lines[y - ymin].push("--------");
    }
  }

  lines.forEach((line) => text(line.join(" ")));
};

export const displayArrangementMap = (
  arrangementMap: Map<string, Tile>,
  gridSize: number
) => {
  let [xmin, ymin, xmax, ymax] = [0, 0, 0, 0];
  arrangementMap.forEach((_, coords) => {
    const [x, y] = coords.split(",").map(toNumber);
    xmin = Math.min(xmin, x);
    xmax = Math.max(xmax, x);
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
  });
  for (let y = ymin; y <= ymax; y++) {
    lineBreak();
    for (let k = 0; k < gridSize; k++) {
      let line = "";
      for (let x = xmin; x <= xmax; x++) {
        if (arrangementMap.has(`${x},${y}`))
          line += arrangementMap.get(`${x},${y}`).grid[k] + " ";
        else line += ".".repeat(gridSize) + " ";
      }
      text(line);
      line = "";
    }
  }
};
