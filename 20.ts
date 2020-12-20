import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { reverseString } from "./utils/string";

interface Tile {
  id: string;
  grid: string[];
}

type Adjacence = "top" | "right" | "bottom" | "left";

type TileAdjacence = {
  [adj in Adjacence]?: string;
};

const TILE_TITLE_REGEX = /^Tile (\d+):$/;

const getBorderAdjacentInTile = (
  border: string,
  tile: Tile
): Adjacence | null => {
  const top = tile.grid[0];
  if (top === border || reverseString(top) === border) return "top";
  const bottom = tile.grid[tile.grid.length - 1];
  if (bottom === border || reverseString(bottom) === border) return "bottom";
  const left = tile.grid.map((line) => line[0]).join("");
  if (left === border || reverseString(left) === border) return "left";
  const right = tile.grid.map((line) => line[line.length - 1]).join("");
  if (right === border || reverseString(right) === border) return "right";
  return null;
};

const isCorner = (
  tileId: string,
  adjacenceMap: Map<string, TileAdjacence>
): boolean => {
  let adjacenceDegree = 0;
  const tileAdjacence = adjacenceMap.get(tileId);
  if (tileAdjacence.top) adjacenceDegree++;
  if (tileAdjacence.bottom) adjacenceDegree++;
  if (tileAdjacence.left) adjacenceDegree++;
  if (tileAdjacence.right) adjacenceDegree++;

  return adjacenceDegree === 2;
};

const buildTileAdjacenceMap = (
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

const getTiles = (input: string[]): Map<string, Tile> => {
  const tileMap = new Map<string, Tile>();
  let id = "";
  let grid: string[] = [];

  input.forEach((line) => {
    if (line === "") {
      tileMap.set(id, { id, grid: [...grid] });
      id = "";
      grid = [];
      return;
    }
    if (TILE_TITLE_REGEX.test(line)) {
      [, id] = TILE_TITLE_REGEX.exec(line);
      return;
    }
    grid.push(line);
  });
  if (id !== "") tileMap.set(id, { id, grid: [...grid] });

  return tileMap;
};

const multiplyCornerIds = (
  adjacenceMap: Map<string, TileAdjacence>
): number => {
  let product = 1;
  adjacenceMap.forEach((_, id) => {
    if (isCorner(id, adjacenceMap)) product *= parseInt(id);
  });

  return product;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const tileMap = getTiles(lines);
  text(tileMap);
  const adjacenceMap = buildTileAdjacenceMap(tileMap);

  text(adjacenceMap);

  title(
    `First exercise: find the tile arrangement and multiply the corner IDs.`,
    "green"
  );

  result("result:", multiplyCornerIds(adjacenceMap));
  lineBreak();

  // title(`Second exercise: ZZZZ.`, "green");

  // // code here

  // result("result:", 0);
  // lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/20.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/20");
  lineBreak();
}

main();
