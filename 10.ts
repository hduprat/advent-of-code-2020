import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

interface JoltageDifferences {
  1: number;
  2: number;
  3: number;
}

interface AdapterCombinationCache {
  [adapterRating: number]: number;
}

const countAdapterCombinations = (
  adapters: Set<number>,
  targetJoltage: number,
  startingJoltage: number,
  combinationCache: AdapterCombinationCache
): number => {
  text("Compute the number of adapter combinations from", startingJoltage);
  if (startingJoltage === targetJoltage) return 1;
  if (typeof combinationCache[startingJoltage] === "number") {
    text(
      `Number of combinations starting from ${colors.magenta}${startingJoltage}${modifiers.reset} already calculated:`,
      combinationCache[startingJoltage]
    );
    return combinationCache[startingJoltage];
  }
  let combinations = 0;
  if (adapters.has(startingJoltage + 1)) {
    combinations += countAdapterCombinations(
      adapters,
      targetJoltage,
      startingJoltage + 1,
      combinationCache
    );
  }
  if (adapters.has(startingJoltage + 2)) {
    combinations += countAdapterCombinations(
      adapters,
      targetJoltage,
      startingJoltage + 2,
      combinationCache
    );
  }
  if (adapters.has(startingJoltage + 3)) {
    combinations += countAdapterCombinations(
      adapters,
      targetJoltage,
      startingJoltage + 3,
      combinationCache
    );
  }
  text(
    `Number of adapter combinations from ${startingJoltage} calculated`,
    combinations
  );
  combinationCache[startingJoltage] = combinations;
  return combinations;
};

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
  const adapterArray = lines.map((n) => parseInt(n));
  const maxJoltage = Math.max(...adapterArray);
  const adapters = new Set(adapterArray);

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

  title(
    `Second exercise: count all combinations that lead to the device rating`,
    "green"
  );
  const combinationCache: AdapterCombinationCache = {};
  const combinations = countAdapterCombinations(
    adapters,
    maxJoltage,
    0,
    combinationCache
  );
  text(combinations);
  result(`The number of combinations is`, combinations);
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
