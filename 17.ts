import { text, lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type ConwayMap = Map<string, boolean>;
type NeighborMap = Map<string, number>;

const iterateConway = (
  conway: ConwayMap,
  neighborMap: NeighborMap
): ConwayMap => {
  const nextConway = new Map<string, boolean>();
  neighborMap.forEach((value, coords) => {
    if (conway.has(coords) && conway.get(coords)) {
      // Active
      nextConway.set(coords, value === 2 || value === 3);
      return;
    }

    nextConway.set(coords, value === 3);
  });

  return nextConway;
};

const get3DNeighborMap = (conway: ConwayMap): NeighborMap => {
  const neighborMap = new Map<string, number>();

  conway.forEach((isActive, coords) => {
    const [x, y, z] = coords.split(",").map((str) => parseInt(str));
    if (isActive) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          for (let k = z - 1; k <= z + 1; k++) {
            if (i === x && j === y && k === z) continue;
            const coord = [i, j, k].join(",");
            if (neighborMap.has(coord)) {
              neighborMap.set(coord, neighborMap.get(coord) + 1);
            } else neighborMap.set(coord, 1);
          }
        }
      }
    }
  });

  return neighborMap;
};

const get4DNeighborMap = (conway: ConwayMap): NeighborMap => {
  const neighborMap = new Map<string, number>();

  conway.forEach((isActive, coords) => {
    const [x, y, z, w] = coords.split(",").map((str) => parseInt(str));
    if (isActive) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          for (let k = z - 1; k <= z + 1; k++) {
            for (let l = w - 1; l <= w + 1; l++) {
              if (i === x && j === y && k === z && l == w) continue;
              const coord = [i, j, k, l].join(",");
              if (neighborMap.has(coord)) {
                neighborMap.set(coord, neighborMap.get(coord) + 1);
              } else neighborMap.set(coord, 1);
            }
          }
        }
      }
    }
  });

  return neighborMap;
};

const create3DConway = (input: string[]): ConwayMap => {
  const conway = new Map<string, boolean>();
  input.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      conway.set([x, y, 0].join(","), line[x] === "#");
    }
  });
  return conway;
};

const create4DConway = (input: string[]): ConwayMap => {
  const conway = new Map<string, boolean>();
  input.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      conway.set([x, y, 0, 0].join(","), line[x] === "#");
    }
  });
  return conway;
};

const countActive = (conway: ConwayMap): number => {
  let n = 0;
  conway.forEach((isActive) => {
    n += isActive ? 1 : 0;
  });

  return n;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: how many cubes are active after the 6th Conway iteration?`,
    "green"
  );
  const conway = create3DConway(lines);
  let neighborMap: NeighborMap;
  let nextConway: ConwayMap = conway;
  for (let i = 0; i < 6; i++) {
    neighborMap = get3DNeighborMap(nextConway);
    nextConway = iterateConway(nextConway, neighborMap);
  }
  result("Number of active cubes after 6 iterations:", countActive(nextConway));
  lineBreak();

  title(`Second exercise: same as before but IN 4D!`, "green");
  const conway4d = create4DConway(lines);
  let neighborMap4d: NeighborMap;
  let nextConway4d: ConwayMap = conway4d;
  for (let i = 0; i < 6; i++) {
    neighborMap4d = get4DNeighborMap(nextConway4d);
    nextConway4d = iterateConway(nextConway4d, neighborMap4d);
  }
  result(
    "Number of active hypercubes after 6 iterations:",
    countActive(nextConway4d)
  );
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/17.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/17");
  lineBreak();
}

main();
