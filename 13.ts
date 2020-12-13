import { text, lineBreak, title, result } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const getBusLines = (input: string): number[] =>
  input
    .split(",")
    .filter((id) => id !== "x")
    .map((id) => parseInt(id));

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

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const arrivalTimestamp = parseInt(lines[0]);
  const busLines = getBusLines(lines[1]);

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
