import type { Cell } from "../game/types";
import type { CSSProperties } from "react";

type TileProps = Readonly<{
  value: Cell;
  className?: string;
  style?: CSSProperties;
}>;

const getTileToneClass = (value: Cell): string => {
  if (value === null) {
    return "tile--empty";
  }

  return `tile--${value}`;
};

export const Tile = ({ value, className = "", style }: TileProps) => {
  const toneClass = getTileToneClass(value);

  return (
    <div className={`tile ${toneClass} ${className}`.trim()} style={style}>
      <span className="tile__value">{value ?? ""}</span>
    </div>
  );
};
