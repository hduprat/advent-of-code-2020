import { lineBreak, result, text } from "../utils/console";
import { colors, modifiers } from "../utils/consoleColors";

export type Game = {
  id: number;
  round: number;
  p1: number[];
  p2: number[];
  roundHistory: { p1: number[]; p2: number[] }[];
};
export type RuleVariant = (game: Game) => 1 | 2;

export const initGame = (input: string[]): Game => {
  const game: Game = {
    id: 1,
    round: 1,
    p1: [],
    p2: [],
    roundHistory: [],
  };

  let i = 1;
  while (input[i] !== "") {
    game.p1.push(parseInt(input[i]));
    i++;
  }

  i += 2;

  while (input[i] !== "" && i < input.length) {
    game.p2.push(parseInt(input[i]));
    i++;
  }

  return game;
};

export const playRound = (game: Game, rule: RuleVariant): 1 | 2 | null => {
  text(`${colors.cyan}-- Round ${game.round} --${modifiers.reset}`);

  text(`Player 1's deck:${colors.yellow}`, game.p1.join(","), modifiers.reset);
  text(`Player 2's deck:${colors.yellow}`, game.p2.join(","), modifiers.reset);

  text(`Player 1 plays:${colors.magenta}`, game.p1[0], modifiers.reset);
  text(`Player 2 plays:${colors.magenta}`, game.p2[0], modifiers.reset);

  const winningPlayer = rule(game);
  text(
    modifiers.bold + "Player" + colors.green,
    winningPlayer,
    "wins the round!",
    modifiers.reset
  );

  const newP1 =
    winningPlayer === 1
      ? [...game.p1.slice(1), game.p1[0], game.p2[0]]
      : game.p1.slice(1);
  const newP2 =
    winningPlayer === 2
      ? [...game.p2.slice(1), game.p2[0], game.p1[0]]
      : game.p2.slice(1);
  game.roundHistory.push({ p1: game.p1, p2: game.p2 });
  game.p1 = newP1;
  game.p2 = newP2;
  game.round++;
  lineBreak();

  if (newP1.length === 0) return 2;
  if (newP2.length === 0) return 1;

  return null;
};

export const playGame = (game: Game, rule: RuleVariant) => {
  let winner: 1 | 2 | null = null;
  do {
    winner = playRound(game, rule);
  } while (winner === null);

  text("The winner is Player", winner);

  result("Winner score:", calculatePlayerScore(game, winner));
};

export const calculatePlayerScore = (game: Game, playerId: 1 | 2): number => {
  const deck = game[playerId === 1 ? "p1" : "p2"];
  return deck
    .reverse()
    .reduce(
      (score, card, rankFromBottom) => (score += (rankFromBottom + 1) * card),
      0
    );
};
