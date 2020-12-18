import { text, lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { toNumber } from "./utils/number";

const PARENTHESIS_REGEX = /\([^()]+\)/g;
const EVAL_REGEX = /(\d+)\s+(\+|\*)\s+(\d+)/;

const evaluateAdvanced = (line: string): number => {
  const test = PARENTHESIS_REGEX.exec(line);
  if (!test) {
    // no parentheses, evaluate directly
    const additionGroups = line.split(" * ");
    const subResults = additionGroups.map((group) => {
      const operands = group.split(" + ");
      return operands.reduce((sum, op) => sum + toNumber(op), 0);
    });
    return subResults.reduce((product, subResult) => subResult * product, 1);
  }

  //else, evaluate parentheses first
  const subResult = evaluateAdvanced(test[0].slice(1, test[0].length - 1));
  return evaluateAdvanced(line.replace(test[0], "" + subResult));
};

const evaluate = (line: string): number => {
  const test = PARENTHESIS_REGEX.exec(line);
  if (!test) {
    // no parentheses, evaluate directly
    const regexResult = EVAL_REGEX.exec(line);
    if (!regexResult) return toNumber(line);
    const [replacement, leftN, operand, rightN] = regexResult;
    const result =
      operand === "+"
        ? toNumber(leftN) + toNumber(rightN)
        : toNumber(leftN) * toNumber(rightN);
    return evaluate(line.replace(replacement, "" + result));
  }

  //else, evaluate parentheses first
  const subResult = evaluate(test[0].slice(1, test[0].length - 1));
  return evaluate(line.replace(test[0], "" + subResult));
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(`First exercise: sum the results of each operation.`, "green");
  const N = lines.reduce((sum, line) => {
    const result = evaluate(line);
    text(line, "=", result);
    return result + sum;
  }, 0);
  result("result:", N);
  lineBreak();

  title(
    `Second exercise: sum the results of each operation IN ADVANCED MODE.`,
    "green"
  );
  const P = lines.reduce((sum, line) => {
    const result = evaluateAdvanced(line);
    text(line, "=", result);
    return result + sum;
  }, 0);
  result("result:", P);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/18.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/18");
  lineBreak();
}

main();
