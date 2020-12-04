import { error, lineBreak, result, text, title } from "./utils/console";
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

const PID_REGEX = /^\d{9}$/;
const BYR_REGEX = /^(19[2-9][0-9])|(200[0-2])$/;
const IYR_REGEX = /^20(1[0-9]|20)$/;
const EYR_REGEX = /^20(2[0-9]|30)$/;
const HGT_REGEX = /^(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in)$/;
const HCL_REGEX = /^#[0-9a-f]{6}$/i;
const VALID_ECL_VALUES = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

type ValidationSchemaFunction = (field: string, form: PassportForm) => boolean;

const validateRequiredFieldsArePresent: ValidationSchemaFunction = (
  field,
  form
) => {
  const value = form[field];

  switch (field) {
    case "cid":
      return true;
    case "pid":
      return value !== "";
    case "byr":
      return value !== "";
    case "eyr":
      return value !== "";
    case "iyr":
      return value !== "";
    case "hgt":
      return value !== "";
    case "hcl":
      return value !== "";
    case "ecl":
      return value !== "";
    default:
      return false;
  }
};

const validateFieldsHaveCorrectValues: ValidationSchemaFunction = (
  field,
  form
) => {
  const value = form[field];

  switch (field) {
    case "cid":
      return true;
    case "pid":
      return PID_REGEX.test(value);
    case "byr":
      return BYR_REGEX.test(value);
    case "eyr":
      return EYR_REGEX.test(value);
    case "iyr":
      return IYR_REGEX.test(value);
    case "hgt":
      return HGT_REGEX.test(value);
    case "hcl":
      return HCL_REGEX.test(value);
    case "ecl":
      return VALID_ECL_VALUES.includes(value);
    default:
      return false;
  }
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
  validationSchema: ValidationSchemaFunction
): number => {
  let form: PassportForm = { ...DEFAULT_PASSPORT_FORM };
  let validPassportCount = 0;

  input.map((line, index) => {
    addFieldsToForm(line, form);

    if (line === "" || index === input.length - 1) {
      result("Passport read:", JSON.stringify(form));
      let isPassportValid = true;
      for (const field in form) {
        const isFieldValid = validationSchema(field, form);
        if (!isFieldValid) {
          error(
            `field ${colors.magenta}${field}${colors.red} has invalid value ${colors.white}"${form[field]}"`
          );
        }
        isPassportValid &&= isFieldValid;
      }
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
  const validPasswordsCount = countValidPasswords(
    lines,
    validateRequiredFieldsArePresent
  );
  text(
    `There are ${colors.yellow}${modifiers.bold}${validPasswordsCount}${colors.white} valid passwords${modifiers.reset} in the file.`
  );

  title(
    "Second exercise: count valid passwords (North Pole included) with correct value format.",
    "green"
  );
  const validPasswordsCountWithValueFormat = countValidPasswords(
    lines,
    validateFieldsHaveCorrectValues
  );
  text(
    `There are ${colors.yellow}${modifiers.bold}${validPasswordsCountWithValueFormat}${colors.white} valid passwords${modifiers.reset} in the file.`
  );
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/4.example");
  lineBreak();

  title("Example scenario (all invalid in part two)", "cyan");
  await playScenario("input/4.example.2.invalid");
  lineBreak();

  title("Example scenario (all valid in part two)", "cyan");
  await playScenario("input/4.example.2.valid");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/4");
  lineBreak();
}

main();
