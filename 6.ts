import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { readFileAsLineGroups } from "./utils/readFileAsLineGroups";

const getDistinctQuestionCountFromGroup = (groupLine: string): number => {
  const distinctQuestions = new Set<string>();
  for (const char of groupLine) {
    distinctQuestions.add(char);
  }
  text(
    `A group has answered "yes" to ${modifiers.bold}${colors.yellow}${distinctQuestions.size}${modifiers.reset} questions.`
  );
  return distinctQuestions.size;
};

const sumDistinctQuestionsFromAllGroups = (input: string[]): number => {
  return input.reduce(
    (sum, line) => sum + getDistinctQuestionCountFromGroup(line),
    0
  );
};

const playScenario = async (path: string) => {
  const lines = await readFileAsLineGroups(path);

  title(
    "First exercise: count distinct questions for each groups, then sum them.",
    "green"
  );
  const sum = sumDistinctQuestionsFromAllGroups(lines);
  result("The sum of distinct questions from all groups is", sum);
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/6.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/6");
  lineBreak();
}

main();
