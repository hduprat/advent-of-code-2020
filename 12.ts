import { error } from "console";
import { text, lineBreak, title, result } from "./utils/console";
import { colors, modifiers } from "./utils/consoleColors";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const modulo = (a: number, n: number) => ((a % n) + n) % n;

type Direction = "N" | "E" | "S" | "W";
const DIRECTIONS: Direction[] = ["N", "E", "S", "W"];

class Ferry {
  private x: number;
  private y: number;
  private directionIndex: number;

  private wx: number;
  private wy: number;

  constructor() {
    this.reset();
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

  waypointMove(instruction: string) {
    const course = instruction[0];
    const value = parseInt(instruction.slice(1));

    switch (course) {
      case "N":
        text(
          `Moving waypoint ${colors.magenta}${value}${colors.white} units ${colors.cyan}north${colors.white}.`
        );
        this.wy += value;
        return;
      case "S":
        text(
          `Moving waypoint ${colors.magenta}${value}${colors.white} units ${colors.cyan}south${colors.white}.`
        );
        this.wy -= value;
        return;
      case "E":
        text(
          `Moving waypoint ${colors.magenta}${value}${colors.white} units ${colors.cyan}east${colors.white}.`
        );
        this.wx += value;
        return;
      case "W":
        text(
          `Moving waypoint ${colors.magenta}${value}${colors.white} units ${colors.cyan}west${colors.white}.`
        );
        this.wx -= value;
        return;
      case "F":
        text(`Sailing to the waypoint!`);
        this.x += value * this.wx;
        this.y += value * this.wy;
        text(this.coordinates);
        return;
      case "L":
        text(
          `Turning waypoint ${colors.magenta}${value}${colors.white} degrees ${colors.cyan}left${colors.white}.`
        );
        for (let i = 0; i < value / 90; i++) {
          const tmp = this.wx;
          this.wx = -this.wy;
          this.wy = tmp;
        }
        return;
      case "R":
        text(
          `Turning waypoint ${colors.magenta}${value}${colors.white} degrees ${colors.cyan}right${colors.white}.`
        );
        for (let i = 0; i < value / 90; i++) {
          const tmp = this.wx;
          this.wx = this.wy;
          this.wy = -tmp;
        }
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

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.wx = 10;
    this.wy = 1;
    this.directionIndex = 1;
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

  ferry.reset();

  title(
    `Second exercise: move the ferry all the way ${modifiers.bold}using the waypoint${modifiers.reset} and calculate the Manhattan distance`,
    "green"
  );
  lines.forEach((line) => ferry.waypointMove(line));
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
