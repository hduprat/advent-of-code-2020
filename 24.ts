import {
  countBlackTiles,
  fillHexTiling,
} from "./24/hexTiles";
import { lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(`First exercise: Fill the tiling and count the black tiles.`, "green");

  const tiling = fillHexTiling(lines, false);

  result("Number of black tiles:", countBlackTiles(tiling));
  lineBreak();

};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/24.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/24");
  lineBreak();
}

main();
