import { text, lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type Range = [number, number];
type RangeRule = { name: string; ranges: Range[] };

declare global {
  interface Number {
    in: (range: Range) => boolean;
  }
}

const toNumber = (n: string): number => parseInt(n, 10);

Number.prototype.in = function (range: Range): boolean {
  return this >= range[0] && this <= range[1];
};

const RULE_REGEX = /^([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)$/;

const processInput = (
  input: string[]
): {
  rules: RangeRule[];
  myTicket: number[];
  nearbyTickets: number[][];
} => {
  let i = 0;
  const rules: RangeRule[] = [];
  // Rules part
  while (input[i] !== "") {
    const result = RULE_REGEX.exec(input[i]);
    rules.push({
      name: result[1],
      ranges: [
        [parseInt(result[2]), parseInt(result[3])],
        [parseInt(result[4]), parseInt(result[5])],
      ],
    });
    i++;
  }

  // Your ticket part
  i += 2;
  const myTicket: number[] = input[i].split(",").map(toNumber);

  // Nearby tickets part
  i += 3;
  const nearbyTickets = input
    .slice(i)
    .map((line) => line.split(",").map(toNumber));

  return {
    rules,
    myTicket,
    nearbyTickets,
  };
};

const getTicketInvalidValues = (
  ticket: number[],
  rules: RangeRule[]
): number[] =>
  ticket.reduce((invalidValues, value) => {
    let invalid = true;
    rules.forEach((rule) => {
      rule.ranges.forEach((range) => {
        if (value.in(range)) invalid = false;
      });
    });
    return invalid ? [...invalidValues, value] : invalidValues;
  }, []);

const sortValidAndInvalidTickets = (
  tickets: number[][],
  rules: RangeRule[]
): { validTickets: number[][]; invalidValues: number[] } =>
  tickets.reduce(
    (state, ticket) => {
      const invalidValues = getTicketInvalidValues(ticket, rules);
      if (invalidValues.length)
        return {
          ...state,
          invalidValues: [...state.invalidValues, ...invalidValues],
        };
      return { ...state, validTickets: [...state.validTickets, ticket] };
    },
    { validTickets: [], invalidValues: [] }
  );

const areAllTicketsInFieldCompliantToRule = (
  tickets: number[][],
  fieldIndex: number,
  rule: RangeRule
) =>
  tickets.reduce(
    (areAllTicketsInField, ticket) =>
      areAllTicketsInField &&
      rule.ranges.reduce(
        (compliesToRule, range) =>
          compliesToRule || ticket[fieldIndex].in(range),
        false
      ),
    true
  );

const getPotentialRuleNames = (
  tickets: number[][],
  fieldIndex: number,
  rules: RangeRule[]
) =>
  rules.reduce(
    (ruleNames, rule) =>
      areAllTicketsInFieldCompliantToRule(tickets, fieldIndex, rule)
        ? [...ruleNames, rule.name]
        : ruleNames,
    [] as string[]
  );

const generateColumnToIndexMap = (tickets: number[][], rules: RangeRule[]) => {
  let columnsPotentialRuleNames = rules.map((_, index) =>
    getPotentialRuleNames(tickets, index, rules)
  );
  const columnToIndex = new Map<string, number>();
  let colIndex: number = -1;

  while (
    (colIndex = columnsPotentialRuleNames.findIndex(
      (column) => column.length === 1
    )) >= 0
  ) {
    columnToIndex.set(columnsPotentialRuleNames[colIndex][0], colIndex);
    columnsPotentialRuleNames = columnsPotentialRuleNames.map((column) =>
      column.filter(
        (fieldName) => fieldName !== columnsPotentialRuleNames[colIndex][0]
      )
    );
  }

  text(columnToIndex);
  return columnToIndex;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const { rules, myTicket, nearbyTickets } = processInput(lines);
  const { invalidValues, validTickets } = sortValidAndInvalidTickets(
    nearbyTickets,
    rules
  );

  title(`First exercise: get the ticket scanning error rate.`, "green");
  const n = invalidValues.reduce((sum, value) => sum + value, 0);
  result("The ticket scanning error rate is", n);
  lineBreak();

  title(
    `Second exercise: multiply the departure values of my ticket.`,
    "green"
  );
  const columnToIndex = generateColumnToIndexMap(validTickets, rules);
  let res = 1;
  columnToIndex.forEach((val, key) => {
    if (key.startsWith("departure")) res *= myTicket[val];
  });

  text(res);
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/16.example.2");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/16");
  lineBreak();
}

main();
