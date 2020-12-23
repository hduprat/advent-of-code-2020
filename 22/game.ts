import { lineBreak, result, text, title } from "../utils/console";
import { colors, modifiers } from "../utils/consoleColors";

export type Game = {
  id: number;
  round: number;
  p1: number[];
  p2: number[];
  roundHistory: { p1: number[]; p2: number[] }[];
};
export type RuleVariant = (
  game: Game
) => { winner: 1 | 2; hasWonGame: boolean };

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

export const playRound = (
  game: Game,
  rule: RuleVariant,
  verbose: boolean = true
): 1 | 2 | null => {
  if (verbose) {
    text(
      `${colors.cyan}-- Round ${game.round} of game ${game.id} --${modifiers.reset}`
    );

    text(
      `Player 1's deck:${colors.yellow}`,
      game.p1.join(","),
      modifiers.reset
    );
    text(
      `Player 2's deck:${colors.yellow}`,
      game.p2.join(","),
      modifiers.reset
    );

    text(`Player 1 plays:${colors.magenta}`, game.p1[0], modifiers.reset);
    text(`Player 2 plays:${colors.magenta}`, game.p2[0], modifiers.reset);
  }

  const { winner: winningPlayer, hasWonGame } = rule(game);
  if (verbose)
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
  if (verbose) lineBreak();

  if (hasWonGame) return winningPlayer;
  if (newP1.length === 0) return 2;
  if (newP2.length === 0) return 1;

  return null;
};

export const playGame = (game: Game, rule: RuleVariant): 1 | 2 => {
  title(`=== Game ${game.id} ===`, "magenta");
  let winner: 1 | 2 | null = null;
  do {
    winner = playRound(game, rule);
  } while (winner === null);

  return winner;
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

const arraysEqual = <T>(a1: T[], a2: T[]): boolean =>
  a1.every((elt, index) => elt === a2[index]);

export const hasRoundBeenDoneBefore = (game: Game): boolean =>
  game.roundHistory.some(
    (round) => arraysEqual(round.p1, game.p1) && arraysEqual(round.p2, game.p2)
  );
