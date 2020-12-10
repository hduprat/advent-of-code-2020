import { lineBreak, result, text, title } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

interface JoltageDifferences {
  1: number;
  2: number;
  3: number;
}

const chainAllAdapters = (adapters: Set<number>): JoltageDifferences => {
  const remainingAdapters = new Set(adapters);
  const joltageDifferences: JoltageDifferences = { 1: 0, 2: 0, 3: 1 };
  let currentJoltageRating = 0;
  text(remainingAdapters);
  while (remainingAdapters.size > 0) {
    if (remainingAdapters.has(currentJoltageRating + 1)) {
      currentJoltageRating += 1;
      joltageDifferences[1]++;
    } else if (remainingAdapters.has(currentJoltageRating + 2)) {
      currentJoltageRating += 2;
      joltageDifferences[2]++;
    } else if (remainingAdapters.has(currentJoltageRating + 3)) {
      currentJoltageRating += 3;
      joltageDifferences[3]++;
    } else throw new Error("cannot chain all adapters");
    remainingAdapters.delete(currentJoltageRating);
  }

  return joltageDifferences;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const adapters = new Set(lines.map((n) => parseInt(n)));

  title(
    `First exercise: find a chain of all adapters and multiply the 1 and 3 joltage differences`,
    "green"
  );
  const joltageDifferences = chainAllAdapters(adapters);
  text(joltageDifferences);
  result(
    `Multiply the number of 1 and 3 joltage differences and you obtain`,
    joltageDifferences[1] * joltageDifferences[3]
  );
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/10.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Example scenario #2", "cyan");
  await playScenario("input/10.example.2");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/10");
  lineBreak();
}

main();
