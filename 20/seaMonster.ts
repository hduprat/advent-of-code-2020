import { text } from "../utils/console";
import { colors, modifiers } from "../utils/consoleColors";
import { flipGrid, rotateGridOnce } from "./grid";

const SEA_MONSTER_UPPER_REGEX = /..................#./;
const SEA_MONSTER_MIDDLE_REGEX = /#....##....##....###/g;
const SEA_MONSTER_LOWER_REGEX = /.#..#..#..#..#..#.../;

const SEA_MONSTER_LENGTH = 20;
export const SEA_MONSTER_HASHES_COUNT = 15;

const HIGHLIGHT = modifiers.bold + colors.red + colors.bgRed;
const RESET = modifiers.reset;

interface Point {
  x: number;
  y: number;
}

export const getPotentialSeaMonstersCoordinates = (image: string[]): Point[] =>
  image.slice(1, image.length).reduce((foundCoordinates, line, y) => {
    const coords = [];
    let result: RegExpExecArray;
    while ((result = SEA_MONSTER_MIDDLE_REGEX.exec(line)) !== null) {
      const x = result.index;
      if (
        !image[y]
          .slice(x, x + SEA_MONSTER_LENGTH)
          .match(SEA_MONSTER_UPPER_REGEX)
      )
        continue;
      if (
        !image[y + 2]
          .slice(x, x + SEA_MONSTER_LENGTH)
          .match(SEA_MONSTER_LOWER_REGEX)
      )
        continue;

      coords.push({
        x: result.index,
        y: y + 1,
      });
    }
    return [...foundCoordinates, ...coords];
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

const isUpperBodyPoint = (x: number, monsterX: number): boolean => {
  return x === monsterX + 18;
};

const isMonsterBodyPoint = (x: number, monsterX: number): boolean => {
  return [0, 5, 6, 11, 12, 17, 18, 19].includes(x - monsterX);
};

const isLowerBodyPoint = (x: number, monsterX: number): boolean => {
  return [1, 4, 7, 10, 13, 16].includes(x - monsterX);
};

export const highlightSeaMonsterInImage = (
  image: string[],
  seaMonsters: Point[]
): void => {
  image.forEach((line, y) => {
    const foundUpper = seaMonsters.filter(
      (seaMonster) => seaMonster.y - 1 === y
    );
    const foundMonster = seaMonsters.filter((seaMonster) => seaMonster.y === y);
    const foundLower = seaMonsters.filter(
      (seaMonster) => seaMonster.y + 1 === y
    );
    let highlightedLine = "";
    for (let i = 0; i < line.length; i++) {
      const isUpper =
        foundUpper.length &&
        foundUpper.some((coord) => isUpperBodyPoint(i, coord.x));
      const isMonster =
        foundMonster.length &&
        foundMonster.some((coord) => isMonsterBodyPoint(i, coord.x));
      const isLower =
        foundLower.length &&
        foundLower.some((coord) => isLowerBodyPoint(i, coord.x));
      if (isUpper) highlightedLine += HIGHLIGHT + line[i] + RESET;

      if (isMonster) highlightedLine += HIGHLIGHT + line[i] + RESET;

      if (isLower) highlightedLine += HIGHLIGHT + line[i] + RESET;

      if (!isUpper && !isMonster && !isLower) highlightedLine += line[i];
    }
    text(highlightedLine);
  });
};
