export type Cell = number | null;
export type Board = Cell[][];
export type Direction = "left" | "right" | "up" | "down";

export type GameStatus = "playing" | "won" | "lost";

export type MoveResult = {
  board: Board;
  changed: boolean;
};
