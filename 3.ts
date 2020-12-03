import { lineBreak, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const hasEncounteredTree = (x: number, line: string): boolean => {
  return line[x % line.length] === "#";
};

const countTreesInPath = (input: string[]): number => {
  let x = 0;
  const hasTreeInEachLine = input.map((line) => {
    const hasTree = hasEncounteredTree(x, line);
    x += 3;
    return hasTree;
  });
  return hasTreeInEachLine.filter((value) => value).length;
};

async function main() {
  const lines = await getLinesOfFile("input/3");
  title("First exercise: count trees in the path.", "green");
  const nTrees = countTreesInPath(lines);
  text(
    `There are ${colors.yellow}${modifiers.bold}${nTrees}${colors.white} trees${modifiers.reset} in your path.`
  );
  lineBreak();
}

main();
