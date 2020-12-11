import { text, lineBreak, title } from "./utils/console";
import { modifiers, colors } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const OCCUPIED_SEAT_REGEX = /#/g;

interface Point {
  x: number;
  y: number;
}

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

type SeatCheckRuleFunction = (
  seatingArea: string[],
  point: Point,
  delta: Point,
  ifCheckCallback: (point: Point) => void
) => void;

const checkAdjacentSeat: SeatCheckRuleFunction = (
  seatingArea,
  point,
  delta,
  ifCheckCallback
) => {
  const newPoint: Point = { x: point.x + delta.x, y: point.y + delta.y };
  if (newPoint.x < 0) return;
  if (newPoint.y < 0) return;
  if (newPoint.x >= seatingArea.length) return;
  if (newPoint.y >= seatingArea.length) return;
  ifCheckCallback(newPoint);
};

const createOccupationMap = (
  seatingArea: string[],
  visibilityRule: SeatCheckRuleFunction
): number[][] => {
  const resultMap = seatingArea.map((line) =>
    new Array<number>(line.length).fill(0)
  );

  const incrementMapPoint = (p: Point) => {
    resultMap[p.y][p.x]++;
  };

  seatingArea.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "#") {
        visibilityRule(
          seatingArea,
          { x, y },
          { x: 0, y: 1 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: 1, y: 1 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: 1, y: 0 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: 1, y: -1 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: 0, y: -1 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: -1, y: -1 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: -1, y: 0 },
          incrementMapPoint
        );
        visibilityRule(
          seatingArea,
          { x, y },
          { x: -1, y: 1 },
          incrementMapPoint
        );
      }
    }
  });
  return resultMap;
};

const changeSeatOccupation = (
  seatingArea: string[],
  occupationMap: number[][],
  abandonSeatThreshold: number = 4
): string[] => {
  const newSeatingArea = seatingArea.map((line, y) => {
    let newLine = "";
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "L" && occupationMap[y][x] === 0) newLine += "#";
      else if (line[x] === "#" && occupationMap[y][x] >= abandonSeatThreshold)
        newLine += "L";
      else newLine += line[x];
    }
    return newLine;
  });

  return newSeatingArea;
};

function* gameOfSeating(
  initialSeatingArea: string[],
  visibilityRule: SeatCheckRuleFunction,
  abandonSeatThreshold: number = 4
): Generator<string[], string[]> {
  let seatingArea = [...initialSeatingArea];
  while (true) {
    const occupationMap = createOccupationMap(seatingArea, visibilityRule);
    const newSeats = changeSeatOccupation(
      seatingArea,
      occupationMap,
      abandonSeatThreshold
    );
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
  const seatingArea = gameOfSeating(lines, checkAdjacentSeat, 4);
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
