import { error, lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const HIGH_BINARY_REGEX = /[BR]/g;
const LOW_BINARY_REGEX = /[FL]/g;

const decodeBoardingPass = (boardingPass: string): number => {
  // The whole row + column separation and seat ID calculation is actually useless! you just have to convert everything to binary :P
  const code = boardingPass
    .replace(LOW_BINARY_REGEX, "0")
    .replace(HIGH_BINARY_REGEX, "1");

  return parseInt(code, 2);
};

const getSortedSeatIDs = (input: string[]): number[] => {
  const decodedBoardingPasses = input.map((line) => {
    const decodedLine = decodeBoardingPass(line);
    text(
      `Boarding pass ${colors.magenta}${line}${colors.white} corresponds to ${
        colors.cyan
      }${JSON.stringify(decodedLine)}${modifiers.reset}`
    );
    return decodedLine;
  });
  decodedBoardingPasses.sort((a, b) => b - a);
  result("All sorted seatIDs are:", decodedBoardingPasses);
  return decodedBoardingPasses;
};

const getHighestSeatID = (input: string[]): number => {
  return getSortedSeatIDs(input)[0];
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    "First exercise: get highest seat ID from a list of boarding passes.",
    "green"
  );
  const seatID = getHighestSeatID(lines);
  result("The highest seat ID is", seatID);

  // title(
  //   "Second exercise: count valid passwords (North Pole included) with correct value format.",
  //   "green"
  // );
  // const validPasswordsCountWithValueFormat = countValidPasswords(
  //   lines,
  //   validateFieldsHaveCorrectValues
  // );
  // text(
  //   `There are ${colors.yellow}${modifiers.bold}${validPasswordsCountWithValueFormat}${colors.white} valid passwords${modifiers.reset} in the file.`
  // );
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/5.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/5");
  lineBreak();
}

main();
