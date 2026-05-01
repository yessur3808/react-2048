import type { Board, Cell } from "../game/types";
import { Tile } from "./Tile";

type GameBoardProps = Readonly<{
  board: Board;
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

export const GameBoard = ({ board }: GameBoardProps) => {
  const rows = toKeyedRows(board);

  return (
    <section className="game-board" aria-label="Game board">
      {rows.map((row) => (
        <div className="game-board__row" key={row.key}>
          {row.cells.map((cell) => (
            <Tile key={cell.key} value={cell.value} />
          ))}
        </div>
      ))}
    </section>
  );
};
