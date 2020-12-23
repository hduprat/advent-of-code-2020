import { lineBreak, text } from "../utils/console";
import { toNumber } from "../utils/number";

type CupMap = Map<number, number>;

const printCups = (cupMap: CupMap, currentCup: number): string => {
  const nSteps = cupMap.size;
  let cup = cupMap.keys().next().value;
  let line: (string | number)[] = [];
  for (let step = 0; step < nSteps; step++) {
    if (cup === currentCup) line.push("(" + cup + ")");
    else line.push(cup);
    cup = cupMap.get(cup);
  }

  return line.join(" ");
};

/**
 * Creates a Cup map.
 * key: cup label
 * value: next cup label (clockwise)
 */
export const createCupMap = (input: string, until?: number): CupMap => {
  const cupMap = new Map<number, number>();
  let cups = input.split("").map(toNumber);
  if (until !== undefined && until >= cups.length) {
    for (let n = cups.length + 1; n <= until; n++) {
      cups.push(n);
    }
  }
  cups.forEach((cup, index) => {
    cupMap.set(cup, cups[(index + 1) % cups.length]);
  });

  return cupMap;
};

export const moveCups = (
  cupMap: CupMap,
  currentCup: number,
  moveId: number,
  minCup: number,
  maxCup: number,
  verbose: boolean = true
): void => {
  if (verbose) {
    text(`-- move ${moveId} --`);
    text("cups:", printCups(cupMap, currentCup));
  }

  const pickedUpCup1 = cupMap.get(currentCup);
  const pickedUpCup2 = cupMap.get(pickedUpCup1);
  const pickedUpCup3 = cupMap.get(pickedUpCup2);
  const nextCup = cupMap.get(pickedUpCup3);
  cupMap.delete(pickedUpCup1);
  cupMap.delete(pickedUpCup2);
  cupMap.delete(pickedUpCup3);
  cupMap.set(currentCup, nextCup);

  if (verbose)
    text("pick up:", [pickedUpCup1, pickedUpCup2, pickedUpCup3].join(", "));

  let destinationCup = currentCup - 1;
  if (destinationCup < minCup) destinationCup = maxCup;
  while (!cupMap.has(destinationCup)) {
    if (destinationCup < minCup) destinationCup = maxCup;
    else destinationCup--;
  }
  if (verbose) text("destination:", destinationCup);
  if (verbose) lineBreak();

  cupMap.set(pickedUpCup3, cupMap.get(destinationCup));
  cupMap.set(pickedUpCup2, pickedUpCup3);
  cupMap.set(pickedUpCup1, pickedUpCup2);
  cupMap.set(destinationCup, pickedUpCup1);
};

export const printCupConfiguration = (cupMap: CupMap): string => {
  let line = "";
  let cup = 1;
  while ((cup = cupMap.get(cup)) !== 1) {
    line += cup;
  }
  return line;
};
