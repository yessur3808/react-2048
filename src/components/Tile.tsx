import type { Cell } from "../game/types";

type TileProps = Readonly<{
  value: Cell;
}>;

const getTileToneClass = (value: Cell): string => {
  if (value === null) {
    return "tile--empty";
  }

  return `tile--${value}`;
};

export const Tile = ({ value }: TileProps) => {
  const toneClass = getTileToneClass(value);

  return (
    <div className={`tile ${toneClass}`}>
      <span className="tile__value">{value ?? ""}</span>
    </div>
  );
};
