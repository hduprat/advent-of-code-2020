import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

class InfiniteLoopError extends Error {
  atLine: number;
  accValue: number;

  constructor(atLine: number, accValue: number) {
    super("Infinite loop error");
    this.atLine = atLine;
    this.accValue = accValue;
  }
}

interface Instruction {
  type: string;
  value: number;
}

interface ProgramState {
  idx: number;
  acc: number;
}

const generateInstruction = (line: string): Instruction => {
  const [instruction, valueStr] = line.split(" ");
  return {
    type: instruction,
    value: parseInt(valueStr),
  };
};

function* generateProgram(
  instructionList: Instruction[]
): Generator<ProgramState, number, unknown> {
  let idx = 0;
  let acc = 0;
  const linesPassed = new Set<number>();

  while (true) {
    const instruction = instructionList[idx];
    if (linesPassed.has(idx)) {
      text(
        `Instruction: ${colors.red}${instruction.type} ${instruction.value}${modifiers.reset} (line ${idx}) - Accumulator value: ${colors.magenta}${acc}${modifiers.reset}`
      );
      throw new InfiniteLoopError(idx, acc);
    }
    text(
      `Instruction: ${colors.green}${instruction.type} ${instruction.value}${modifiers.reset} (line ${idx}) - Accumulator value: ${colors.magenta}${acc}${modifiers.reset}`
    );
    linesPassed.add(idx);
    switch (instruction.type) {
      case "acc":
        acc += instruction.value;
        idx++;
        break;
      case "jmp":
        idx += instruction.value;
        break;
      default:
        idx++;
        break;
    }
    if (idx >= instructionList.length) return acc;
    yield {
      acc,
      idx,
    };
  }
}

const runProgram = (instructionList: Instruction[]): number => {
  const program = generateProgram(instructionList);
  let state = program.next();
  while (!state.done) {
    state = program.next();
  }
  return state.value;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const instructionList = lines.map(generateInstruction);

  title(
    `First exercise: what is the number in the accumulator right before the start of the infinite loop?`,
    "green"
  );
  try {
    runProgram(instructionList);
  } catch (error) {
    result("Value of accumulator when infinite loop begins:", error.accValue);
  }
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/8.example");
  lineBreak();

  // title("----------------------------------");
  // lineBreak();

  // title("Real scenario", "cyan");
  // await playScenario("input/8");
  // lineBreak();
}

main();
