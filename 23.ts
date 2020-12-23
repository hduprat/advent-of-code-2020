import { createCupMap, moveCups, printCupConfiguration } from "./23/cupMap";
import { lineBreak, title, result, text } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { toNumber } from "./utils/number";

const printProgress = (progress: number) => {
  let line = colors.bgWhite;
  line += " ".repeat(progress);
  line += colors.bgBlack;
  line += " ".repeat(100 - progress);
  line += modifiers.reset;
  line += " ";
  line += `${progress}%`;
  process.stdout.cursorTo(0);
  process.stdout.write(line);
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: Determine the label arrangement after 100 crab moves.`,
    "green"
  );

  const cupMap = createCupMap(lines[0]);
  // text(cupMap);
  let currentCup = parseInt(lines[0][0]);
  for (let i = 0; i < 100; i++) {
    moveCups(cupMap, currentCup, i + 1, 0, 9);
    currentCup = cupMap.get(currentCup);
  }

  result("result:", printCupConfiguration(cupMap));

  lineBreak();

  title(
    `Second exercise: Find the two cups immediately next to 1 in the crazy configuration, and multiply them.`,
    "green"
  );
  lineBreak();

  const MILLION = 1000000;
  const crazyCupMap = createCupMap(lines[0], MILLION);
  currentCup = parseInt(lines[0][0]);
  for (let k = 0; k < 10 * MILLION; k++) {
    moveCups(crazyCupMap, currentCup, k + 1, 1, MILLION, false);
    if (k % (MILLION / 10) === 0) printProgress(k / (MILLION / 10));
    currentCup = crazyCupMap.get(currentCup);
  }
  printProgress(100);
  process.stdout.write("\n");

  const firstStarCup = crazyCupMap.get(1);
  const secondStarCup = crazyCupMap.get(firstStarCup);

  text(
    `The cups with the stars inside are ${
      modifiers.bold + colors.green
    }${firstStarCup}${modifiers.reset} and ${
      modifiers.bold + colors.green
    }${secondStarCup}${modifiers.reset}`
  );

  result("result:", firstStarCup * secondStarCup);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/23.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/23");
  lineBreak();
}

main();
