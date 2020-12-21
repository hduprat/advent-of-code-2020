import { text } from "../utils/console";
import { colors, modifiers } from "../utils/consoleColors";
import { flipGrid, rotateGridOnce } from "./grid";

const SEA_MONSTER_UPPER_REGEX = /..................#./;
const SEA_MONSTER_MIDDLE_REGEX = /#....##....##....###/;
const SEA_MONSTER_LOWER_REGEX = /.#..#..#..#..#..#.../;

const SEA_MONSTER_LENGTH = 20;

const HIGHLIGHT = modifiers.bold + colors.red + colors.bgRed;
const RESET = modifiers.reset;

interface Point {
  x: number;
  y: number;
}

export const getPotentialSeaMonstersCoordinates = (image: string[]): Point[] =>
  image.slice(1, image.length).reduce((foundCoordinates, line, y) => {
    const result = line.match(SEA_MONSTER_MIDDLE_REGEX);
    if (!result) return foundCoordinates;
    const x = result.index;
    if (
      !image[y].slice(x, x + SEA_MONSTER_LENGTH).match(SEA_MONSTER_UPPER_REGEX)
    )
      return foundCoordinates;
    if (
      !image[y + 2]
        .slice(x, x + SEA_MONSTER_LENGTH)
        .match(SEA_MONSTER_LOWER_REGEX)
    )
      return foundCoordinates;
    return [
      ...foundCoordinates,
      {
        x: result.index,
        y: y + 1,
      },
    ];
  }, []);

export const getAllSeaMonstersCoordinates = (
  image: string[]
): { result: Point[]; image: string[] } | null => {
  let result: Point[] = [];
  let snapshot = image;

  for (let i = 0; i < 4; i++) {
    result = getPotentialSeaMonstersCoordinates(snapshot);
    if (result.length > 0) return { result, image: snapshot };
    result = getPotentialSeaMonstersCoordinates(flipGrid(snapshot, "vertical"));
    if (result.length > 0)
      return { result, image: flipGrid(snapshot, "vertical") };
    snapshot = rotateGridOnce(snapshot);
  }

  return null;
};

const highlightUpperBody = (line: string, x: number) => {
  let highlightedLine = line.slice(0, x + 18);
  highlightedLine += HIGHLIGHT + line[x + 18] + RESET;
  highlightedLine += line.slice(x + 19);
  text(highlightedLine);
};

const highlightMiddleBody = (line: string, x: number) => {
  let highlightedLine = line.slice(0, x);
  highlightedLine += HIGHLIGHT + line[x] + RESET;
  highlightedLine += line.slice(x + 1, x + 5);
  highlightedLine += HIGHLIGHT + line.slice(x + 5, x + 7) + RESET;
  highlightedLine += line.slice(x + 7, x + 11);
  highlightedLine += HIGHLIGHT + line.slice(x + 11, x + 13) + RESET;
  highlightedLine += line.slice(x + 13, x + 17);
  highlightedLine += HIGHLIGHT + line.slice(x + 17, x + 20) + RESET;
  highlightedLine += line.slice(x + 20);
  text(highlightedLine);
};

const highlightLowerBody = (line: string, x: number) => {
  let highlightedLine = line.slice(0, x + 1);
  highlightedLine += HIGHLIGHT + line[x + 1] + RESET;
  highlightedLine += line.slice(x + 2, x + 4);
  highlightedLine += HIGHLIGHT + line[x + 4] + RESET;
  highlightedLine += line.slice(x + 5, x + 7);
  highlightedLine += HIGHLIGHT + line[x + 7] + RESET;
  highlightedLine += line.slice(x + 8, x + 10);
  highlightedLine += HIGHLIGHT + line[x + 10] + RESET;
  highlightedLine += line.slice(x + 11, x + 13);
  highlightedLine += HIGHLIGHT + line[x + 13] + RESET;
  highlightedLine += line.slice(x + 14, x + 16);
  highlightedLine += HIGHLIGHT + line[x + 16] + RESET;
  highlightedLine += line.slice(x + 17);

  text(highlightedLine);
};

export const highlightSeaMonsterInImage = (
  image: string[],
  seaMonsters: Point[]
): void => {
  image.forEach((line, y) => {
    const foundUpper = seaMonsters.find((seaMonster) => seaMonster.y - 1 === y);
    if (foundUpper) {
      highlightUpperBody(line, foundUpper.x);
      return;
    }
    const foundMonster = seaMonsters.find((seaMonster) => seaMonster.y === y);
    if (foundMonster) {
      highlightMiddleBody(line, foundMonster.x);
      return;
    }
    const foundLower = seaMonsters.find((seaMonster) => seaMonster.y + 1 === y);
    if (foundLower) {
      highlightLowerBody(line, foundLower.x);
      return;
    }
    text(line);
  });
};
