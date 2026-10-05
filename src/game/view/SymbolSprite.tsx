import { Texture } from "pixi.js";
import { SYMBOL_STYLE } from "../../assets/symbols";
import type { SymbolId } from "../model/types";

type SymbolSpriteProps = {
  symbol: SymbolId;
  x: number;
  y: number;
  width: number;
  height: number;
};

const textureOf = (symbol: SymbolId): Texture => Texture.from(SYMBOL_STYLE[symbol].src);

export const SymbolSprite = ({ symbol, x, y, width, height }: SymbolSpriteProps) => {
  const inset = 4;
  const size = Math.max(Math.min(width, height) - inset * 2, 0);

  return (
    <pixiSprite
      texture={textureOf(symbol)}
      x={x + (width - size) / 2}
      y={y + (height - size) / 2}
      width={size}
      height={size}
    />
  );
};
