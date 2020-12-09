import { lineBreak, result, text, title } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const findRangeAddingUpTo = (
  n: number,
  allNumbers: number[]
): { minIndex: number; maxIndex: number } => {
  for (let i = 0; i < allNumbers.length - 1; i++) {
    let sum = allNumbers[i];
    if (sum === n) continue;
    let j = i + 1;
    while (sum < n) {
      sum += allNumbers[j];
      j++;
    }
    if (sum === n) return { minIndex: i, maxIndex: j };
  }

  return { minIndex: -1, maxIndex: -1 };
};

const isSumOfTwoNumbersIn = (n: number, allNumbers: number[]): boolean => {
  for (let a of allNumbers) {
    if (allNumbers.includes(n - a)) return true;
  }
  return false;
};

const firstNumberNotXmas = (
  input: number[],
  preambleLength: number
): number => {
  for (let i = preambleLength; i < input.length; i++) {
    if (!isSumOfTwoNumbersIn(input[i], input.slice(i - preambleLength, i)))
      return input[i];
  }
  return -99;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const numbers = lines.map((n) => parseInt(n));
  const preambleLength = path.includes("example") ? 5 : 25;

  title(
    `First exercise: what is the number that doesn't respect the XMAS encoding?`,
    "green"
  );
  const result1 = firstNumberNotXmas(numbers, preambleLength);
  result(
    `The first number that is not the sum of two of the ${preambleLength} previous ones is`,
    result1
  );
  lineBreak();

  title(
    `Second exercise: find a contiguous set of numbers that add up to ${result1}, then sum the smallest and the largest`,
    "green"
  );
  const { minIndex, maxIndex } = findRangeAddingUpTo(result1, numbers);
  const range = numbers.slice(minIndex, maxIndex);
  text(`The range of numbers that add up to ${result1} is`, range);
  result(`The result is`, Math.min(...range) + Math.max(...range));
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/9.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/9");
  lineBreak();
}

main();
