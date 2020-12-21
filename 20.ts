import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { Tile } from "./20/tile";
import {
  AdjacenceGraph,
  buildAdjacenceGraph,
  placeTilesOnGrid,
} from "./20/adjacence";
import { getImage } from "./20/image";
import {
  getAllSeaMonstersCoordinates,
  getPotentialSeaMonstersCoordinates,
  highlightSeaMonsterInImage,
} from "./20/seaMonster";
import { rotateGridOnce } from "./20/grid";

const TILE_TITLE_REGEX = /^Tile (\d+):$/;

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

const getCornerIds = (adjGraph: AdjacenceGraph): string[] => {
  const cornerIds: string[] = [];
  adjGraph.forEach((adjacence, id) => {
    if (adjacence.size === 2) cornerIds.push(id);
  });

  return cornerIds;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const tileMap = getTiles(lines);
  const graph = buildAdjacenceGraph(tileMap);
  // text(graph);
  const cornerIds = getCornerIds(graph);

  title(
    `First exercise: find the tile arrangement and multiply the corner IDs.`,
    "green"
  );

  result(
    "result:",
    cornerIds.reduce((product, id) => (product *= parseInt(id)), 1)
  );
  lineBreak();

  title(
    `Second exercise: Reconstruct the image and find some sea monsters!`,
    "green"
  );
  text("First, reconstruct the image.");
  const arrangement = new Map<string, Tile>();
  placeTilesOnGrid(cornerIds[0], graph, tileMap, arrangement);

  // displayArrangementMapIds(arrangement);
  lineBreak();
  const image = getImage(arrangement, lines[1].length);
  rotateGridOnce(image).forEach((line) => text(line));

  lineBreak();

  const {
    result: seaMonsterCoords,
    image: correctlyOrientedImage,
  } = getAllSeaMonstersCoordinates(image);
  result("sea monsters are probably here:", JSON.stringify(seaMonsterCoords));
  lineBreak();
  highlightSeaMonsterInImage(correctlyOrientedImage, seaMonsterCoords);
  // // code here

  // result("result:", 0);
  // lineBreak();
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
