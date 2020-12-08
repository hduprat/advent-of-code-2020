import { lineBreak, result, text, title, error } from "./utils/console";
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
): Generator<ProgramState, ProgramState, unknown> {
  let idx = 0;
  let acc = 0;
  yield {
    acc,
    idx,
  };
  const linesPassed = new Set<number>();

  while (true) {
    const instruction = instructionList[idx];
    if (linesPassed.has(idx)) {
      throw new InfiniteLoopError(idx, acc);
    }
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
    if (idx >= instructionList.length) return { idx, acc };
    yield {
      acc,
      idx,
    };
  }
}

const runProgram = (
  instructionList: Instruction[],
  onStateChange?: (state: ProgramState) => void
): ProgramState => {
  const program = generateProgram(instructionList);
  let state = program.next();
  while (!state.done) {
    if (onStateChange) onStateChange(state.value as ProgramState);
    state = program.next();
  }
  return state.value;
};

const autofixProgram = (baseInstructionList: Instruction[]): number => {
  const jmpNopIndexes: number[] = [];
  try {
    const finalState = runProgram(baseInstructionList, (state) => {
      if (["jmp", "nop"].includes(baseInstructionList[state.idx].type))
        jmpNopIndexes.push(state.idx);
    });
  } catch (error) {}
  text(jmpNopIndexes);

  for (let i = 0; i < jmpNopIndexes.length; i++) {
    const index = jmpNopIndexes[i];
    const instructionList = [...baseInstructionList];
    if (instructionList[index].type === "jmp") {
      instructionList[index] = { ...instructionList[index], type: "nop" };
    } else if (instructionList[index].type === "nop") {
      instructionList[index] = { ...instructionList[index], type: "jmp" };
    }
    try {
      const finalState = runProgram(instructionList);
      return finalState.acc;
    } catch (infiniteLoopError) {
      error(
        `Switching jmp with nop at line ${index}, infinite loop started at line ${infiniteLoopError.atLine}`
      );
    }
  }
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
  lineBreak();

  title(
    `Second exercise: what is the final value of the accumulator if we fix one jmp or nop?`,
    "green"
  );
  const finalAcc = autofixProgram(instructionList);
  result("Value of accumulator when infinite loop fixed:", finalAcc);
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/8.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/8");
  lineBreak();
}

main();
