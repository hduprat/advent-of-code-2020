import { text, lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type Memory = Map<number, number>;

const playMemoryGame = (input: string, finalTurn: number): number => {
  const startingNumbers = input.split(",");
  const memory = new Map<number, number>();
  startingNumbers.slice(0, startingNumbers.length - 1).forEach((n, i) => {
    text("The spoken number at turn", i + 1, "is", parseInt(n));
    memory.set(parseInt(n), i);
  });
  let spokenNumber: number = parseInt(
    startingNumbers[startingNumbers.length - 1]
  );
  for (let turn = startingNumbers.length - 1; turn < finalTurn - 1; turn++) {
    if (turn + 1 < 3000 || (turn + 1) % 1000000 === 0)
      text("The spoken number at turn", turn + 1, "is", spokenNumber);
    const newNumber = memory.has(spokenNumber)
      ? turn - memory.get(spokenNumber)
      : 0;
    memory.set(spokenNumber, turn);
    spokenNumber = newNumber;
  }

  return spokenNumber;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: say the 2020th number spoken at the memory game.`,
    "green"
  );
  const n = playMemoryGame(lines[0], 2020);
  result("The 2020th spoken number is", n);
  lineBreak();

  title(
    `Second exercise: say the 30000000th number spoken at the memory game.`,
    "green"
  );
  const p = playMemoryGame(lines[0], 30000000);
  result("The 30000000th spoken number is", p);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/15.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/15");
  lineBreak();
}

main();
