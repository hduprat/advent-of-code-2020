import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { readFileAsLineGroups } from "./utils/readFileAsLineGroups";

type CountFunction = (input: string) => number;

const getDistinctQuestionCountEveryoneAnswered: CountFunction = (groupLine) => {
  const groupSize = groupLine.split("\n").length;
  const questionMap = new Map<string, number>();

  for (const char of groupLine) {
    if (questionMap.has(char)) {
      questionMap.set(char, questionMap.get(char) + 1);
    } else {
      questionMap.set(char, 1);
    }
  }
  questionMap.delete("\n");
  questionMap.forEach((numberOfOccurrences, char) => {
    if (numberOfOccurrences < groupSize) questionMap.delete(char);
  });

  text(
    `Everyone in a group has answered "yes" to ${modifiers.bold}${colors.yellow}${questionMap.size}${modifiers.reset} questions.`
  );
  return questionMap.size;
};

const getDistinctQuestionCountAnyoneAnswered: CountFunction = (groupLine) => {
  const distinctQuestions = new Set<string>();
  for (const char of groupLine) {
    distinctQuestions.add(char);
  }
  distinctQuestions.delete("\n");
  text(
    `A group has answered "yes" to ${modifiers.bold}${colors.yellow}${distinctQuestions.size}${modifiers.reset} questions.`
  );
  return distinctQuestions.size;
};

const sum = (input: string[], countFunction: CountFunction): number => {
  return input.reduce((sum, line) => sum + countFunction(line), 0);
};

const playScenario = async (path: string) => {
  const lines = await readFileAsLineGroups(path);
  text("groups are", lines);

  title(
    "First exercise: count distinct questions that anyone answered in each group, then sum them.",
    "green"
  );
  const sumAnyone = sum(lines, getDistinctQuestionCountAnyoneAnswered);
  result("The sum of distinct questions from all groups is", sumAnyone);

  title(
    "Second exercise: count distinct questions that EVERYONE answered in each group, then sum them.",
    "green"
  );
  const sumEveryone = sum(lines, getDistinctQuestionCountEveryoneAnswered);
  result("The sum of distinct questions from all groups is", sumEveryone);
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
