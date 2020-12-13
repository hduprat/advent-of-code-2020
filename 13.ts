import { text, lineBreak, title, result } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const getBusLines = (
  input: string
): { busLines: number[]; indexes: number[] } => {
  const busLineArray = input.split(",");
  const busLines: number[] = [];
  const indexes: number[] = [];
  busLineArray.forEach((line, index) => {
    if (line !== "x") {
      busLines.push(parseInt(line));
      indexes.push(index);
    }
  });

  return { busLines, indexes };
};

const findEarliestDepartureTimeAndLine = (
  busLines: number[],
  baseTimestamp: number
): { line: number; timestamp: number } => {
  let timestamp = baseTimestamp - 1;
  let line: number | undefined = undefined;
  while (!line) {
    timestamp++;
    line = busLines.find((line) => timestamp % line === 0);
  }

  return { line, timestamp };
};

let loopCount = 0;

const playContest = (busLines: number[], indexes: number[]): number => {
  let n = 1;
  let time = 0;
  let step = busLines[indexes[0]];
  while (true) {
    loopCount++;
    time += step;
    text(time, "step=", step);
    if ((time + indexes[n]) % busLines[n] !== 0) {
      text(
        time + indexes[n],
        "is",
        colors.red,
        "NOT divisible by",
        busLines[n],
        modifiers.reset
      );
      continue;
    }
    text(
      time + indexes[n],
      "is",
      colors.green,
      "divisible by",
      busLines[n],
      modifiers.reset
    );
    step *= busLines[n];
    n++;
    if (n === busLines.length) return time;
  }
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const arrivalTimestamp = parseInt(lines[0]);
  const { busLines, indexes } = getBusLines(lines[1]);

  text("Available bus lines", busLines);

  title(
    `First exercise: find the earliest bus I can take and multiply it by my waiting time.`,
    "green"
  );
  const {
    line: departureLine,
    timestamp: departureTimestamp,
  } = findEarliestDepartureTimeAndLine(busLines, arrivalTimestamp);
  text(
    `I can take the line ${colors.magenta}${departureLine}${
      modifiers.reset
    } after waiting ${colors.magenta}${departureTimestamp - arrivalTimestamp}${
      modifiers.reset
    } minutes.`
  );
  result(
    "Multiplication result:",
    (departureTimestamp - arrivalTimestamp) * departureLine
  );
  lineBreak();

  title(`Second exercise: win the contest!`, "green");
  const winningTime = playContest(busLines, indexes);
  result(
    `The winning time for  ${colors.magenta}${lines[1]}${modifiers.reset} is`,
    winningTime
  );
  text("Total loop count", loopCount);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/13.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/13");
  lineBreak();
}

main();
