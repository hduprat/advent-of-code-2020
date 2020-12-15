import { text, lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

interface Memory {
  [n: number]: number;
}

const playMemoryGame = (input: string): number => {
  const startingNumbers = input.split(",");
  const memory = startingNumbers
    .slice(0, startingNumbers.length - 1)
    .reduce((mem, n, i) => {
      text("The spoken number at turn", i + 1, "is", parseInt(n));
      return { ...mem, [n]: i };
    }, {} as Memory);
  let spokenNumber: number = parseInt(
    startingNumbers[startingNumbers.length - 1]
  );
  for (let turn = startingNumbers.length - 1; turn < 2019; turn++) {
    text("The spoken number at turn", turn + 1, "is", spokenNumber);
    const newNumber =
      memory[spokenNumber] === undefined ? 0 : turn - memory[spokenNumber];
    memory[spokenNumber] = turn;
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
  const n = playMemoryGame(lines[0]);
  result("The 2020th spoken number is", n);
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
