import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { resetTileCache, Tile } from "./20/tile";
import {
  AdjacenceGraph,
  buildAdjacenceGraph,
  placeTilesOnGrid,
} from "./20/adjacence";
import { countHashes, getImage } from "./20/image";
import {
  getAllSeaMonstersCoordinates,
  highlightSeaMonsterInImage,
  SEA_MONSTER_HASHES_COUNT,
} from "./20/seaMonster";

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
  resetTileCache();
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
  placeTilesOnGrid(cornerIds[1], graph, tileMap, arrangement);

  // displayArrangementMapIds(arrangement);
  lineBreak();
  const image = getImage(arrangement, lines[1].length);

  const {
    result: seaMonsterCoords,
    image: correctlyOrientedImage,
  } = getAllSeaMonstersCoordinates(image);
  text(
    "Found",
    seaMonsterCoords.length,
    "sea monsters, they are probably here:"
  );
  lineBreak();
  highlightSeaMonsterInImage(correctlyOrientedImage, seaMonsterCoords);

  text("There are", countHashes(image), "hashes in the image.");
  result(
    "Water roughness is:",
    countHashes(image) - seaMonsterCoords.length * SEA_MONSTER_HASHES_COUNT
  );
  lineBreak();
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
