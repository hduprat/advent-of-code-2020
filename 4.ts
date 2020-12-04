import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type PassportForm = {
  cid: string;
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
};

type PassportField = keyof PassportForm;

const DEFAULT_PASSPORT_FORM: PassportForm = {
  pid: "",
  cid: "",
  byr: "",
  iyr: "",
  eyr: "",
  hgt: "",
  hcl: "",
  ecl: "",
};

const FIELD_REGEX = /(\w{3}):(\S+)/g;

const addFieldsToForm = (line: string, form: PassportForm): void => {
  let result: string[];
  while ((result = FIELD_REGEX.exec(line)) !== null) {
    form[result[1]] = result[2];
  }
};

const countValidPasswords = (
  input: string[],
  requiredFields: PassportField[]
): number => {
  let form: PassportForm = { ...DEFAULT_PASSPORT_FORM };
  let validPassportCount = 0;

  input.map((line, index) => {
    addFieldsToForm(line, form);

    if (line === "" || index === input.length - 1) {
      result("Passport read:", JSON.stringify(form));
      const isPassportValid = requiredFields.reduce(
        (currentValidity, field) => currentValidity && form[field] !== "",
        true
      );
      text(
        `Passport is ${
          isPassportValid ? `${colors.green}valid` : `${colors.red}invalid`
        }${modifiers.reset}`
      );
      validPassportCount += isPassportValid ? 1 : 0;
      form = { ...DEFAULT_PASSPORT_FORM };
    }
  });
  return validPassportCount;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    "First exercise: count valid passwords (North Pole included).",
    "green"
  );
  const validPasswordsCount = countValidPasswords(lines, [
    "byr",
    "iyr",
    "ecl",
    "eyr",
    "pid",
    "hcl",
    "hgt",
  ]);
  text(
    `There are ${colors.yellow}${modifiers.bold}${validPasswordsCount}${colors.white} valid passwords${modifiers.reset} in the file.`
  );
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/4.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/4");
  lineBreak();
}

main();
