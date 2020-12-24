import { toNumber } from "../utils/number";

export const coords2str = (coords: number[]): string => coords.join(",");

export const str2coords = (str: string): number[] =>
  str.split(",").map(toNumber);
