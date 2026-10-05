import { useCallback, useLayoutEffect, useRef } from "react";
import { useTick } from "@pixi/react";
import type { Container, Graphics } from "pixi.js";
import { REEL_STRIPS } from "../model/reels";
import { useSlotStore } from "../store/useSlotStore";
import { reelOffsetY, reelPos } from "./reelMotion";
import { SymbolSprite } from "./SymbolSprite";

type ReelColumnProps = {
  reel: number;
  cellWidth: number;
  cellHeight: number;
};

export const ReelColumn = ({ reel, cellWidth, cellHeight }: ReelColumnProps) => {
  const strip = REEL_STRIPS[reel];
  const length = strip.length;
  const maskRef = useRef<Graphics | null>(null);
  const columnRef = useRef<Container | null>(null);
  const stripRef = useRef<Container | null>(null);

  const drawWell = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.roundRect(4, 4, Math.max(cellWidth - 8, 0), Math.max(cellHeight * 3 - 8, 0), 16);
      graphics.fill({ color: 0x0c0616 });
    },
    [cellHeight, cellWidth],
  );

  const drawMask = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.rect(0, 0, cellWidth, cellHeight * 3);
      graphics.fill(0xffffff);
    },
    [cellHeight, cellWidth],
  );

  useLayoutEffect(() => {
    const column = columnRef.current;
    const mask = maskRef.current;
    if (!column || !mask) {
      return;
    }
    column.mask = mask;
  }, [cellHeight, cellWidth]);

  useTick(() => {
    const stripContainer = stripRef.current;
    if (!stripContainer) {
      return;
    }

    const column = columnRef.current;
    const mask = maskRef.current;
    if (column && mask && column.mask !== mask) {
      column.mask = mask;
    }

    const state = useSlotStore.getState();
    const pos = reelPos(
      {
        phase: state.phase,
        reelOrigin: state.reelOrigin,
        stops: state.lastResult?.stops ?? null,
        spinStartedAt: state.spinStartedAt,
        stopStartedAt: state.stopStartedAt,
        now: Date.now(),
      },
      reel,
      length,
    );
    stripContainer.y = reelOffsetY(pos, cellHeight, length);
  });

  return (
    <pixiContainer x={reel * cellWidth}>
      <pixiGraphics draw={drawWell} />
      <pixiGraphics ref={maskRef} draw={drawMask} />
      <pixiContainer ref={columnRef}>
        <pixiContainer ref={stripRef}>
          {Array.from({ length: length * 2 }, (_, index) => (
            <SymbolSprite
              key={index}
              symbol={strip[index % length] ?? "cherry"}
              x={0}
              y={index * cellHeight}
              width={cellWidth}
              height={cellHeight}
            />
          ))}
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};
