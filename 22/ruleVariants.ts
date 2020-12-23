import { lineBreak, text, title } from "../utils/console";
import {
  Game,
  hasRoundBeenDoneBefore,
  playGame,
  playRound,
  RuleVariant,
} from "./game";

let GAME_ID = 1;

export const classicCombat: RuleVariant = (game) => {
  const winner = game.p1[0] > game.p2[0] ? 1 : 2;
  return { winner, hasWonGame: false };
};

export const recursiveCombat: RuleVariant = (game) => {
  if (hasRoundBeenDoneBefore(game)) {
    text("We already saw this configuration!");
    return { winner: 1, hasWonGame: true };
  }
  if (game.p1.length > game.p1[0] && game.p2.length > game.p2[0]) {
    GAME_ID++;
    const subGame: Game = {
      id: GAME_ID,
      round: 1,
      p1: game.p1.slice(1, 1 + game.p1[0]),
      p2: game.p2.slice(1, 1 + game.p2[0]),
      roundHistory: [],
    };
    text("Playing a sub-game to determine the winner...");
    lineBreak();
    title(`=== Game ${subGame.id} ===`, "magenta");
    let winner: 1 | 2 | null = null;
    do {
      winner = playRound(subGame, recursiveCombat, false);
    } while (winner === null);

    text(`...anyway, back to game ${game.id}.`);
    return { winner, hasWonGame: false };
  }
  return classicCombat(game);
};
