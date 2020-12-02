import { text, lineBreak, result, title } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const findThreeNumbersAddingTo2020 = (input: string[]) => {
  const values = input.map((line) => parseInt(line));
  for (let i = 0; i < values.length - 2; i++) {
    for (let j = i + 1; j < values.length - 1; j++) {
      for (let k = j + 1; k < values.length; k++) {
        if (values[i] + values[j] + values[k] === 2020) {
          text(`Found 2020! It is ${values[i]} + ${values[j]} + ${values[k]}.`);
          result(
            "Multiply them and you obtain",
            values[i] * values[j] * values[k]
          );
          return;
        }
      }
    }
  }
};

const findTwoNumbersAddingTo2020 = (input: string[]) => {
  const previousValues: number[] = [];
  input.forEach((line) => {
    const n = parseInt(line);
    const complementN = 2020 - n;
    if (previousValues.find((value) => value === complementN) !== undefined) {
      text(`Found 2020! It is ${n} + ${complementN}.`);
      result("Multiply them and you obtain", n * complementN);
      return;
    }
    previousValues.push(n);
  });
};

async function main() {
  const lines = await getLinesOfFile("input/1");
  title(
    "First exercise: find two numbers adding to 2020 and multiply them.",
    "green"
  );
  findTwoNumbersAddingTo2020(lines);
  lineBreak();
  title(
    "Second exercise: find three numbers adding to 2020 and multiply them.",
    "green"
  );
  findThreeNumbersAddingTo2020(lines);
  lineBreak();
}

main();
