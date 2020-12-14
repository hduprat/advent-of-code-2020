import { text, lineBreak, title, result } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type Memory = {
  [x: number]: number;
};

type Executor = (instruction: string, memory: Memory, mask: string) => Memory;

const MASK_REGEX = /mask = (\w+)/;
const INSTRUCTION_REGEX = /mem\[(\d+)] = (\d+)/;

const decStr2binStr = (n: string): string =>
  (parseInt(n) >>> 0).toString(2).padStart(36, "0");

const applyMask = (n: string, mask: string): string => {
  const binaryN = decStr2binStr(n);
  const masked: string[] = [];
  for (let i = 0; i < mask.length; i++) {
    masked.push(mask[i] === "X" ? binaryN[i] : mask[i]);
  }
  return masked.join("");
};

const applyV2MaskBit = (
  maskedInput: string[],
  inputBit: string,
  maskBit: string
): string[] => {
  if (maskBit === "0") return maskedInput.map((line) => line + inputBit);
  if (maskBit === "1") return maskedInput.map((line) => line + "1");
  if (maskBit === "X")
    return [
      ...maskedInput.map((line) => line + "0"),
      ...maskedInput.map((line) => line + "1"),
    ];
};

const applyV2Mask = (n: string, mask: string): string[] => {
  const binaryN = decStr2binStr(n);
  let masked: string[] = [""];
  for (let i = 0; i < mask.length; i++) {
    masked = applyV2MaskBit(masked, binaryN[i], mask[i]);
  }
  return masked;
};

const executeInstruction: Executor = (instruction, memory, mask) => {
  const [_, index, n] = INSTRUCTION_REGEX.exec(instruction);
  const maskedN = applyMask(n, mask);
  return { ...memory, [index]: parseInt(maskedN, 2) };
};

const executeV2Instruction: Executor = (instruction, memory, mask) => {
  const newMemory = { ...memory };
  const [_, index, n] = INSTRUCTION_REGEX.exec(instruction);
  const maskedIndexes = applyV2Mask(index, mask);
  maskedIndexes.forEach((index) => {
    newMemory[index] = parseInt(n, 10);
  });
  return newMemory;
};

const executeAllInstructions = (
  instructions: string[],
  executor: Executor
): Memory => {
  const initMemory: Memory = {};
  let mask: string = "";

  return instructions.reduce((currentMemory, instruction) => {
    if (instruction.startsWith("mask")) {
      mask = MASK_REGEX.exec(instruction)[1];
      result("new mask", mask);
      return currentMemory;
    } else {
      return executor(instruction, currentMemory, mask);
    }
  }, initMemory);
};

const sumMemory = (mem: Memory): number => {
  let sum = 0;
  for (const key in mem) {
    sum += mem[key];
  }

  return sum;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: sum all the values in memory after executing all instructions.`,
    "green"
  );

  const memory = executeAllInstructions(lines, executeInstruction);
  text(memory);
  result("The sum is", sumMemory(memory));
  lineBreak();

  title(
    `Second exercise: sum all the values in memory after executing all instructions with v2 algorithm.`,
    "green"
  );
  const otherLines = path.includes("example")
    ? await getLinesOfFile(path + ".2")
    : lines;
  const v2Memory = executeAllInstructions(otherLines, executeV2Instruction);
  text(v2Memory);
  result("The sum is", sumMemory(v2Memory));
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/14.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/14");
  lineBreak();
}

main();
