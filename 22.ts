import { calculatePlayerScore, initGame, playGame, playRound } from "./22/game";
import { classicCombat, recursiveCombat } from "./22/ruleVariants";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const game = initGame(lines);

  title(
    `First exercise: play the card game and calculate the winner's score.`,
    "green"
  );
  const winner = playGame(game, classicCombat);
  text("The winner is Player", winner);
  result("Winner score:", calculatePlayerScore(game, winner));
  lineBreak();

  title(
    `Second exercise: play the RECURSIVE card game and calculate the winner's score.`,
    "green"
  );

  const recursiveGame = initGame(lines);
  const recursiveWinner = playGame(recursiveGame, recursiveCombat);
  text("The winner is Player", recursiveWinner);
  result("Winner score:", calculatePlayerScore(recursiveGame, recursiveWinner));

  result("result:", 0);
  lineBreak();
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
