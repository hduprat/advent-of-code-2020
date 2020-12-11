import { text, lineBreak, title } from "./utils/console";
import { modifiers, colors } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const OCCUPIED_SEAT_REGEX = /#/g;

const displaySeatingArea = (input: string[]): void => {
  input.forEach((line) => text(line));
};

const countOccupiedSeats = (seatingArea: string[]): number =>
  seatingArea.reduce((occupiedSeats, seatLine) => {
    const occupiedSeatsInLine = seatLine.match(OCCUPIED_SEAT_REGEX);
    return (
      occupiedSeats + (occupiedSeatsInLine ? occupiedSeatsInLine.length : 0)
    );
  }, 0);

const createOccupationMap = (seatingArea: string[]): number[][] => {
  const resultMap = seatingArea.map((line) =>
    new Array<number>(line.length).fill(0)
  );

  seatingArea.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "#") {
        if (x > 0) resultMap[y][x - 1]++;
        if (x > 0 && y > 0) resultMap[y - 1][x - 1]++;
        if (y > 0) resultMap[y - 1][x]++;
        if (x < line.length - 1 && y > 0) resultMap[y - 1][x + 1]++;
        if (x < line.length - 1) resultMap[y][x + 1]++;
        if (x < line.length - 1 && y < seatingArea.length - 1)
          resultMap[y + 1][x + 1]++;
        if (y < seatingArea.length - 1) resultMap[y + 1][x]++;
        if (x > 0 && y < seatingArea.length - 1) resultMap[y + 1][x - 1]++;
      }
    }
  });
  return resultMap;
};

const changeSeatOccupation = (
  seatingArea: string[],
  occupationMap: number[][]
): string[] => {
  const newSeatingArea = seatingArea.map((line, y) => {
    let newLine = "";
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "L" && occupationMap[y][x] === 0) newLine += "#";
      else if (line[x] === "#" && occupationMap[y][x] >= 4) newLine += "L";
      else newLine += line[x];
    }
    return newLine;
  });

  return newSeatingArea;
};

function* gameOfSeating(
  initialSeatingArea: string[]
): Generator<string[], string[]> {
  let seatingArea = [...initialSeatingArea];
  while (true) {
    const occupationMap = createOccupationMap(seatingArea);
    const newSeats = changeSeatOccupation(seatingArea, occupationMap);
    lineBreak();
    displaySeatingArea(newSeats);
    if (
      newSeats.reduce(
        (currentState, line, index) =>
          currentState && line === seatingArea[index],
        true
      )
    ) {
      text("OK");
      return newSeats;
    }
    yield newSeats;
    seatingArea = [...newSeats];
  }
}

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: count occupied seats when seating becomes stable`,
    "green"
  );
  lineBreak();
  const seatingArea = gameOfSeating(lines);
  let seats;
  do {
    seats = seatingArea.next();
  } while (!seats.done);
  const newSeats = seats.value;
  const count = countOccupiedSeats(newSeats);
  text(
    `There are ${modifiers.bold}${colors.yellow}${count}${modifiers.reset} occupied seats.`
  );
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/11.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/11");
  lineBreak();
}

main();
