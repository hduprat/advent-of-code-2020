import { lineBreak, text, title } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type RuleSet = {
  [color: string]: {
    color: string;
    count: number;
  }[];
};

const BAG_REGEX = /(\d+) (\w+ \w+) bags?/;

const generateRuleSet = (input: string[]): RuleSet => {
  return input.reduce((currentRuleSet, line) => {
    const [containerColor, restOfLine] = line.split(" bags contain ");
    const containedBags = restOfLine.split(", ");
    if (containedBags[0] === "no other bags.")
      return { ...currentRuleSet, [containerColor]: [] };
    const rule = containedBags.map((bag) => {
      const result = BAG_REGEX.exec(bag);
      return {
        color: result[2],
        count: parseInt(result[1]),
      };
    });
    return { ...currentRuleSet, [containerColor]: rule };
  }, {} as RuleSet);
};

const canContainShinyGoldBags = (color: string, ruleSet: RuleSet): boolean => {
  const colorRule = ruleSet[color];
  if (colorRule.length === 0) return false;
  if (colorRule.find((rule) => rule.color === "shiny gold")) return true;
  for (let i = 0; i < colorRule.length; i++) {
    if (canContainShinyGoldBags(colorRule[i].color, ruleSet)) return true;
  }
  return false;
};

const countCompatibleBagColors = (ruleSet: RuleSet): number => {
  const bagColors = Object.keys(ruleSet);
  return bagColors.reduce((compatibleBagCountSoFar, bagColor) => {
    const isBagCompatible = canContainShinyGoldBags(bagColor, ruleSet);
    text(
      `${modifiers.bold}${
        colors[isBagCompatible ? "green" : "red"]
      }${bagColor} bags${colors.white} can${isBagCompatible ? "" : "'t"}${
        modifiers.reset
      } contain ${colors.yellow}shiny gold bags${modifiers.reset}.`
    );
    return compatibleBagCountSoFar + (isBagCompatible ? 1 : 0);
  }, 0);
};

const countBagsInside = (color: string, ruleSet: RuleSet): number => {
  const colorRule = ruleSet[color];
  if (colorRule.length === 0) return 0;
  return colorRule.reduce(
    (sum, bag) => sum + bag.count * (1 + countBagsInside(bag.color, ruleSet)),
    0
  );
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const ruleSet = generateRuleSet(lines);

  title(
    `First exercise: how many bag types can contain ${colors.yellow}shiny gold bags${colors.green}?`,
    "green"
  );
  const compatibleCount = countCompatibleBagColors(ruleSet);
  text(
    `${modifiers.bold}${colors.yellow}${compatibleCount}${modifiers.reset} bags can contain shiny gold bags.`
  );

  title(
    `Second exercise: how many bag do I have in my ${colors.yellow}shiny gold bag${colors.green}?`,
    "green"
  );
  const totalBagCount = countBagsInside("shiny gold", ruleSet);
  text(
    `My shiny gold bag contains ${modifiers.bold}${colors.yellow}${totalBagCount}${modifiers.reset} bags 😱`
  );
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/7.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/7");
  lineBreak();
}

main();
