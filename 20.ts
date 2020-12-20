import { buildTileAdjacenceMap } from "./20/buildAdjacenceMap";
import { TileAdjacence, Tile, Direction } from "./20/types";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { reverseString } from "./utils/string";
import { toNumber } from "./utils/number";

interface TileArrangement {
  id: string;
  flip: boolean;
  rotate: number;
}

const displayArrangementMap = (
  arrangementMap: Map<string, TileArrangement>
) => {
  let [xmin, ymin, xmax, ymax] = [0, 0, 0, 0];
  arrangementMap.forEach((_, coords) => {
    const [x, y] = coords.split(",").map(toNumber);
    xmin = Math.min(xmin, x);
    xmax = Math.max(xmax, x);
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
  });
  text([xmin, ymin, xmax, ymax]);
  const lines: string[][] = [];
  for (let y = ymin; y <= ymax; y++) {
    lines.push([]);
    for (let x = xmin; x <= xmax; x++) {
      if (arrangementMap.has(`${x},${y}`))
        lines[y - ymin].push(arrangementMap.get(`${x},${y}`).id);
      else lines[y - ymin].push("----");
    }
  }

  lines.forEach((line) => text(line.join(" ")));
};

const TILE_TITLE_REGEX = /^Tile (\d+):$/;
const DIRECTIONS: Direction[] = ["top", "right", "bottom", "left"];

const oppositeDirection = (direction: Direction): Direction => {
  const index = DIRECTIONS.indexOf(direction);
  return DIRECTIONS[(index + 2) % 4];
};

const countRotations = (fromDir: Direction, toDir: Direction): number => {
  const fromIndex = DIRECTIONS.indexOf(fromDir);
  const toIndex = DIRECTIONS.indexOf(toDir);

  return (toIndex - fromIndex + 4) % 4;
};

const getBorder = (tile: Tile, direction: Direction): string => {
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

const shouldFlip = (
  fixedTile: Tile,
  fixedDir: Direction,
  movingTile: Tile,
  movingDir: Direction,
  baseFlip: boolean
): boolean => {
  const fixedBorder = getBorder(fixedTile, fixedDir);
  const movingBorder = getBorder(movingTile, movingDir);

  if (fixedBorder === movingBorder) return baseFlip;
  if (fixedBorder === reverseString(movingBorder)) return !baseFlip;
  throw new Error("should not happen!");
};

const getVector = (
  direction: Direction,
  rotation: number
): [number, number] => {
  const index = DIRECTIONS.indexOf(direction);
  switch ((index + rotation) % 4) {
    case 0:
      return [0, -1];
    case 1:
      return [1, 0];
    case 2:
      return [0, 1];
    case 3:
      return [-1, 0];
  }
};

const arrangeTile = (
  coords: string,
  tileMap: Map<string, Tile>,
  arrangementMap: Map<string, TileArrangement>,
  adjacenceMap: Map<string, TileAdjacence>
) => {
  const [x, y] = coords.split(",").map(toNumber);
  if (!arrangementMap.has(coords)) return;

  const baseArrangement = arrangementMap.get(coords);
  const adjacence = adjacenceMap.get(baseArrangement.id);

  DIRECTIONS.forEach((baseDir) => {
    const [dx, dy] = getVector(baseDir, baseArrangement.rotate);
    const newCoords = [x + dx, y + dy].join(",");
    if (arrangementMap.has(newCoords)) return;
    const compareId = adjacence[baseDir];
    if (!compareId) return;
    const compareAdjacence = adjacenceMap.get(compareId);
    const arrangement: TileArrangement = {
      id: compareId,
      rotate: 0,
      flip: false,
    };
    DIRECTIONS.forEach((compareDir) => {
      if (!compareAdjacence[compareDir]) return;
      if (compareAdjacence[compareDir] !== baseArrangement.id) return;
      const rotate = countRotations(baseDir, oppositeDirection(compareDir));
      const flip = shouldFlip(
        tileMap.get(baseArrangement.id),
        baseDir,
        tileMap.get(compareId),
        compareDir,
        baseArrangement.flip
      );
      text(newCoords, compareId, "( rotate:", rotate, "flip:", flip, ")");
      arrangement.rotate = baseArrangement.rotate + rotate;
      arrangement.flip = [1, 2].includes(rotate) ? !flip : flip;
      arrangementMap.set(newCoords, arrangement);
    });
  });

  text("current state for arrangement map:", arrangementMap);
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
  adjacenceMap.forEach((_, adj) => {});
  const startingTileId = cornerIds[0];
  const arrangementMap = new Map<string, TileArrangement>();
  arrangementMap.set("0,0", { id: startingTileId, flip: false, rotate: 0 });
  text(arrangementMap);
  lineBreak();
  arrangeTile("0,0", tileMap, arrangementMap, adjacenceMap);
  // arrangeTile("1,0", tileMap, arrangementMap, adjacenceMap);
  // arrangeTile("1,-1", tileMap, arrangementMap, adjacenceMap);
  // arrangeTile("1,-2", tileMap, arrangementMap, adjacenceMap);
  displayArrangementMap(arrangementMap);
  lineBreak();

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
