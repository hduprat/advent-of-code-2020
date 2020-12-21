import { toNumber } from "../utils/number";
import { Tile } from "./tile";

export const getImage = (
  arrangementMap: Map<string, Tile>,
  gridSize: number
): string[] => {
  let [xmin, ymin, xmax, ymax] = [0, 0, 0, 0];
  arrangementMap.forEach((_, coords) => {
    const [x, y] = coords.split(",").map(toNumber);
    xmin = Math.min(xmin, x);
    xmax = Math.max(xmax, x);
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
  });
  const result = [];
  for (let y = ymin; y <= ymax; y++) {
    for (let k = 1; k < gridSize - 1; k++) {
      let line = "";
      for (let x = xmin; x <= xmax; x++) {
        if (arrangementMap.has(`${x},${y}`))
          line += arrangementMap
            .get(`${x},${y}`)
            .grid[k].slice(1, gridSize - 1);
        else line += ".".repeat(gridSize);
      }
      result.push(line);
      line = "";
    }
  }

  return result;
};

export const countHashes = (image: string[]): number =>
  image.reduce((count, line) => count + (line.match(/#/g) || []).length, 0);
