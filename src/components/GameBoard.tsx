import type { CSSProperties } from "react";
import type { Board, Cell, TileTransition } from "../game/types";
import { Tile } from "./Tile";

type GameBoardProps = Readonly<{
  board: Board;
  movingTiles?: TileTransition[];
}>;

type KeyedCell = Readonly<{
  key: string;
  value: Cell;
}>;

type KeyedRow = Readonly<{
  key: string;
  cells: KeyedCell[];
}>;

const toKeyedRows = (board: Board): KeyedRow[] => {
  const rowOccurrences = new Map<string, number>();
  const rows: KeyedRow[] = [];

  let rowNumber = 0;
  for (const row of board) {
    rowNumber += 1;
    const rowSignature = row.map((cell) => String(cell ?? "null")).join("|");
    const rowCount = (rowOccurrences.get(rowSignature) ?? 0) + 1;
    rowOccurrences.set(rowSignature, rowCount);

    const cells: KeyedCell[] = [];
    const cellOccurrences = new Map<string, number>();

    let columnNumber = 0;
    for (const cell of row) {
      columnNumber += 1;
      const cellLabel = String(cell ?? "null");
      const cellCount = (cellOccurrences.get(cellLabel) ?? 0) + 1;
      cellOccurrences.set(cellLabel, cellCount);

      cells.push({
        key: `r${rowNumber}-${rowCount}-c${columnNumber}-${cellLabel}-${cellCount}`,
        value: cell,
      });
    }

    rows.push({
      key: `r${rowNumber}-${rowSignature}-${rowCount}`,
      cells,
    });
  }

  return rows;
};

export const GameBoard = ({ board, movingTiles = [] }: GameBoardProps) => {
  const rows = toKeyedRows(board);
  const hiddenSourcePositions = new Set(
    movingTiles.map((tile) => `${tile.fromRow}-${tile.fromCol}`),
  );

  return (
    <section className="game-board" aria-label="Game board">
      {rows.map((row, rowIndex) => (
        <div className="game-board-row" key={row.key}>
          {row.cells.map((cell, colIndex) => {
            const shouldHideSource = hiddenSourcePositions.has(
              `${rowIndex}-${colIndex}`,
            );

            return (
              <Tile
                key={cell.key}
                value={shouldHideSource ? null : cell.value}
              />
            );
          })}
        </div>
      ))}
      {movingTiles.length > 0 && (
        <div className="game-board-overlay" aria-hidden="true">
          {movingTiles.map((tile) => {
            const style = {
              gridRow: tile.fromRow + 1,
              gridColumn: tile.fromCol + 1,
              "--dx": String(tile.toCol - tile.fromCol),
              "--dy": String(tile.toRow - tile.fromRow),
            } as CSSProperties;

            return (
              <Tile
                key={tile.key}
                value={tile.value}
                className="tile--moving"
                style={style}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
