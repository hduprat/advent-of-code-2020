import { buildTileAdjacenceMap } from "./20/buildAdjacenceMap";
import { TileAdjacence, Tile } from "./20/types";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

interface TileArrangement {
  id: string;
  flip: string;
  rotate: string;
}

const TILE_TITLE_REGEX = /^Tile (\d+):$/;

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

const getCornerIds = (adjacenceMap: Map<string, TileAdjacence>): string[] => {
  const cornerIds: string[] = [];
  adjacenceMap.forEach((_, id) => {
    if (isCorner(id, adjacenceMap)) cornerIds.push(id);
  });

  return cornerIds;
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
  const adjacenceMap = buildTileAdjacenceMap(tileMap);
  const cornerIds = getCornerIds(adjacenceMap);

  text(adjacenceMap);

  title(
    `First exercise: find the tile arrangement and multiply the corner IDs.`,
    "green"
  );

  result("result:", multiplyCornerIds(adjacenceMap));
  lineBreak();

  title(`Reconstruct the image and find some sea monsters!`, "green");

  // code here

  result("result:", 0);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/20.example");
  lineBreak();

  // title("----------------------------------");
  // lineBreak();

  // title("Real scenario", "cyan");
  // await playScenario("input/20");
  // lineBreak();
}

main();
