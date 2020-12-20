export interface Tile {
  id: string;
  grid: string[];
}

export type Direction = "top" | "right" | "bottom" | "left";

export type TileAdjacence = {
  [dir in Direction]?: string;
};
