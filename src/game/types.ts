export type Cell = number | null;
export type Board = Cell[][];

export type Direction = "left" | "right" | "up" | "down";
export type SuggestionMode = "basic" | "ai";

export type GameStatus = "playing" | "won" | "lost";

export type MoveResult = {
  board: Board;
  changed: boolean;
};

export type TileTransition = {
  key: string;
  value: number;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
};
