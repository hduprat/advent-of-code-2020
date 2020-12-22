import { calculatePlayerScore, initGame, playRound } from "./22/game";
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
  let winner: 1 | 2 | null = null;
  do {
    winner = playRound(game, classicCombat);
  } while (winner === null);

  text("The winner is Player", winner);

  result("Winner score:", calculatePlayerScore(game, winner));
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
