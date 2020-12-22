import { RuleVariant } from "./game";

export const classicCombat: RuleVariant = (game) => {
  return game.p1[0] > game.p2[0] ? 1 : 2;
};

export const recursiveCombat: RuleVariant = (game) => {
  return 1;
};
