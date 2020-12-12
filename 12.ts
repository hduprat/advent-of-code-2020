import { error } from "console";
import { text, lineBreak, title, result } from "./utils/console";
import { colors } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const modulo = (a: number, n: number) => ((a % n) + n) % n;

type Direction = "N" | "E" | "S" | "W";
const DIRECTIONS: Direction[] = ["N", "E", "S", "W"];

class Ferry {
  private x: number;
  private y: number;
  private directionIndex: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.directionIndex = 1;
  }

  move(instruction: string) {
    const course = instruction[0];
    const value = parseInt(instruction.slice(1));
    switch (course) {
      case "N":
        text(
          `Moving ${colors.magenta}${value}${colors.white} units ${colors.cyan}north${colors.white}.`
        );
        this.y += value;
        return;
      case "S":
        text(
          `Moving ${colors.magenta}${value}${colors.white} units ${colors.cyan}south${colors.white}.`
        );
        this.y -= value;
        return;
      case "E":
        text(
          `Moving ${colors.magenta}${value}${colors.white} units ${colors.cyan}east${colors.white}.`
        );
        this.x += value;
        return;
      case "W":
        text(
          `Moving ${colors.magenta}${value}${colors.white} units ${colors.cyan}west${colors.white}.`
        );
        this.x -= value;
        return;
      case "F":
        text(`Sailing forward!`);
        this.move(`${DIRECTIONS[this.directionIndex]}${value}`);
        return;
      case "L":
        text(
          `Turning ${colors.magenta}${value}${colors.white} degrees ${colors.cyan}left${colors.white}.`
        );
        this.directionIndex = modulo(
          this.directionIndex - value / 90,
          DIRECTIONS.length
        );
        return;
      case "R":
        text(
          `Turning ${colors.magenta}${value}${colors.white} degrees ${colors.cyan}right${colors.white}.`
        );
        this.directionIndex = modulo(
          this.directionIndex + value / 90,
          DIRECTIONS.length
        );
        return;
      default:
        error("Instruction error:", instruction);
        return;
    }
  }

  get manhattanDistance(): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  get coordinates() {
    return { x: this.x, y: this.y };
  }
}

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const ferry = new Ferry();
  title(
    `First exercise: move the ferry all the way and calculate the Manhattan distance`,
    "green"
  );
  lines.forEach((line) => ferry.move(line));
  text("Final coordinates:", ferry.coordinates);
  result(
    "The ferry's Manhattan distance from its starting point is",
    ferry.manhattanDistance
  );
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/12.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/12");
  lineBreak();
}

main();
