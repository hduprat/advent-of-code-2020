import { lineBreak, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { xor } from "./utils/logic";

const LINE_REGEX = /^(\d+)-(\d+)\s(\w):\s(.+)$/i;

const findAllValidPasswordsWithPositionConvention = (
  input: string[]
): string[] => {
  return input.filter((line) => {
    const result = LINE_REGEX.exec(line);
    const charPos1 = parseInt(result[1]);
    const charPos2 = parseInt(result[2]);
    const letterToTest = result[3];
    const password = result[4];

    const isAtCharPos1 = password[charPos1 - 1] === letterToTest;
    const isAtCharPos2 = password[charPos2 - 1] === letterToTest;

    const isValid = xor(isAtCharPos1, isAtCharPos2);
    text(
      `${colors.yellow}${letterToTest}${modifiers.reset} is${
        !isAtCharPos1 ? " not" : ""
      } at position ${colors.yellow}${charPos1}${modifiers.reset} and is${
        !isAtCharPos2 ? " not" : ""
      } at position ${colors.yellow}${charPos2}${modifiers.reset} in ${
        isValid ? colors.green : colors.red
      }${password}${modifiers.reset}.`
    );
    return isValid;
  });
};

const findAllValidPasswords = (input: string[]): string[] => {
  return input.filter((line) => {
    const result = LINE_REGEX.exec(line);
    const minChars = parseInt(result[1]);
    const maxChars = parseInt(result[2]);
    const letterToTest = result[3];
    const password = result[4];

    const numberOfOccurrences = password.split(letterToTest).length - 1;
    const isValid =
      numberOfOccurrences >= minChars && numberOfOccurrences <= maxChars;
    text(
      `There are ${colors.yellow}${numberOfOccurrences}${
        modifiers.reset
      } occurrences of the letter ${colors.yellow}${letterToTest}${
        modifiers.reset
      } in ${isValid ? colors.green : colors.red}${password}${
        modifiers.reset
      } (${minChars} to ${maxChars} occurrences allowed).`
    );
    return isValid;
  });
};

async function main() {
  const lines = await getLinesOfFile("input/2");
  title("First exercise: find the number of valid passwords.", "green");
  const validPasswords = findAllValidPasswords(lines);
  text(
    `There are ${colors.yellow}${modifiers.bold}${validPasswords.length}${colors.white} valid passwords${modifiers.reset} in the file.`
  );
  lineBreak();

  title(
    "Next exercise: find the number of valid passwords with the new convention.",
    "green"
  );
  const newValidPasswords = findAllValidPasswordsWithPositionConvention(lines);
  text(
    `There are ${colors.yellow}${modifiers.bold}${newValidPasswords.length}${colors.white} valid passwords${modifiers.reset} in the file.`
  );
  lineBreak();
}

main();
