import { calculatePlayerScore, initGame, playGame, playRound } from "./22/game";
import { classicCombat } from "./22/ruleVariants";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const game = initGame(lines);

  title(
    `First exercise: play the card game and calculate the winner's score.`,
    "green"
  );
  playGame(game, classicCombat);
  lineBreak();

  // title(`Second exercise: ZZZZ.`, "green");

  // // code here

  // result("result:", 0);
  // lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/22.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/22");
  lineBreak();
}

main();
