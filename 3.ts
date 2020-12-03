import { lineBreak, result, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const hasEncounteredTree = (x: number, line: string): boolean => {
  return line[x % line.length] === "#";
};

const countTreesInPath = (
  input: string[],
  xSlope: number = 3,
  ySlope: number = 1
): number => {
  let x = 0;
  const hasTreeInEachLine = input.map((line, y) => {
    if (y % ySlope !== 0) return;
    const hasTree = hasEncounteredTree(x, line);
    x += xSlope;
    return hasTree;
  });
  return hasTreeInEachLine.filter((value) => value).length;
};

const multiplyTreeCountsInPathWithSlopes = (input: string[]): number => {
  const treeCountSlope11 = countTreesInPath(input, 1, 1);
  result("Trees encountered with slope 1/1:", treeCountSlope11);

  const treeCountSlope31 = countTreesInPath(input, 3, 1);
  result("Trees encountered with slope 3/1:", treeCountSlope31);

  const treeCountSlope51 = countTreesInPath(input, 5, 1);
  result("Trees encountered with slope 5/1:", treeCountSlope51);

  const treeCountSlope71 = countTreesInPath(input, 7, 1);
  result("Trees encountered with slope 7/1:", treeCountSlope71);

  const treeCountSlope12 = countTreesInPath(input, 1, 2);
  result("Trees encountered with slope 1/2:", treeCountSlope12);

  return (
    treeCountSlope11 *
    treeCountSlope31 *
    treeCountSlope51 *
    treeCountSlope71 *
    treeCountSlope12
  );
};

async function main() {
  const lines = await getLinesOfFile("input/3");
  title("First exercise: count trees in the path.", "green");
  const nTrees = countTreesInPath(lines);
  text(
    `There are ${colors.yellow}${modifiers.bold}${nTrees}${colors.white} trees${modifiers.reset} in your path.`
  );
  lineBreak();

  title(
    "Second exercise: multiply the tree counts in paths with different slopes.",
    "green"
  );
  const multipliedResult = multiplyTreeCountsInPathWithSlopes(lines);
  result("The multiplied result is", multipliedResult);
  lineBreak();
}

main();
