import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { toNumber } from "./utils/number";

interface ReferToRule {
  kind: "referTo";
  rules: number[];
}

interface MessageRule {
  kind: "message";
  message: string;
}

interface RecursiveRule {
  kind: "recursive";
  rules: number[];
}

type Rule = ReferToRule | MessageRule | RecursiveRule;

type RuleMap = Map<number, Rule[]>;

const RULE_REGEX = /^(\d+):\s(.+)$/;
const MESSAGE_REGEX = /"(\w)"/;

const convertRuleToRegexString = (rule: Rule, ruleMap: RuleMap): string => {
  if (rule.kind === "message") {
    return rule.message;
  }
  if (rule.kind === "recursive") {
    return (
      "(?:" +
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        .map((i) =>
          rule.rules
            .map((index): string => {
              const subRules = ruleMap.get(index);
              return (
                "(?:" +
                subRules
                  .map((subRule) => convertRuleToRegexString(subRule, ruleMap))
                  .join("|") +
                "){" +
                i +
                "}"
              );
            })
            .join("")
        )
        .join("|") +
      ")"
    );
  }
  return rule.rules
    .map((index): string => {
      const subRules = ruleMap.get(index);
      if (subRules.length === 1)
        return convertRuleToRegexString(subRules[0], ruleMap);
      return (
        "(?:" +
        subRules
          .map((subRule) => convertRuleToRegexString(subRule, ruleMap))
          .join("|") +
        ")"
      );
    })
    .join("");
};

const collectRulesAndMessages = (
  input: string[]
): { ruleMap: RuleMap; messages: string[] } => {
  const ruleMap = new Map<number, Rule[]>();
  let separatorIndex = input.indexOf("");

  input.slice(0, separatorIndex).forEach((line) => {
    const [, index, rule] = RULE_REGEX.exec(line);
    if (rule.includes('"')) {
      ruleMap.set(parseInt(index), [
        {
          kind: "message",
          message: MESSAGE_REGEX.exec(rule)[1],
        },
      ]);
      return;
    }
    const subRules = rule.split(" | ");
    ruleMap.set(
      parseInt(index),
      subRules.map((subRule) => ({
        kind: "referTo",
        rules: subRule.split(" ").map(toNumber),
      }))
    );
  });

  return {
    ruleMap,
    messages: input.slice(separatorIndex + 1),
  };
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const { messages, ruleMap } = collectRulesAndMessages(lines);

  title(
    `First exercise: Find all messages that match rule ${lines[0]}.`,
    "green"
  );
  const regex = new RegExp(
    "^" + convertRuleToRegexString(ruleMap.get(0)[0], ruleMap) + "$"
  );
  text("regex:", regex);
  const compliantMessages = messages.reduce((sum, message) => {
    const isMessageOk = regex.test(message);
    text(message, ":", isMessageOk);

    return isMessageOk ? sum + 1 : sum;
  }, 0);

  result("result:", compliantMessages);
  lineBreak();

  title(
    `Second exercise: change rules 8 and 11 and see what happens.`,
    "green"
  );
  const newLines = path.includes("example")
    ? await getLinesOfFile(path + ".2")
    : lines;
  const {
    messages: newMessages,
    ruleMap: modifiedRuleMap,
  } = collectRulesAndMessages(newLines);
  modifiedRuleMap.set(8, [{ kind: "recursive", rules: [42] }]);
  modifiedRuleMap.set(11, [{ kind: "recursive", rules: [42, 31] }]);
  const modifiedRegex = new RegExp(
    "^" +
      convertRuleToRegexString(modifiedRuleMap.get(0)[0], modifiedRuleMap) +
      "$"
  );
  const newCompliantMessages = newMessages.filter((message) =>
    modifiedRegex.test(message)
  );

  result("result:", newCompliantMessages.length);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/19.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/19");
  lineBreak();
}

main();
