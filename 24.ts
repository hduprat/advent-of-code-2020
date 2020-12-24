import {
  countBlackTiles,
  fillHexTiling,
  flipGreatLivingHexTiling,
} from "./24/hexTiles";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(`First exercise: Fill the tiling and count the black tiles.`, "green");

  const tiling = fillHexTiling(lines, false);

  result("Number of black tiles:", countBlackTiles(tiling));
  lineBreak();

  title(
    `Second exercise: determine the number of black tile in the Great Living Hex Tiling after 100 days.`,
    "green"
  );

  for (let day = 1; day <= 100; day++) {
    flipGreatLivingHexTiling(tiling, false);
    if (day < 10 || day % 10 === 0)
      text(`Day ${day}:`, countBlackTiles(tiling));
  }
  lineBreak();

  result("Number of black tiles on the 100th day:", countBlackTiles(tiling));
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
