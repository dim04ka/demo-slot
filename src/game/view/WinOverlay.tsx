import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { buildPresentation } from "../model/spin";
import { useSlotStore } from "../store/useSlotStore";

type WinOverlayProps = {
  cellWidth: number;
  cellHeight: number;
};

export const WinOverlay = ({ cellWidth, cellHeight }: WinOverlayProps) => {
  const phase = useSlotStore((state) => state.phase);
  const result = useSlotStore((state) => state.lastResult);
  const presentIndex = useSlotStore((state) => state.presentIndex);
  const step = phase === "presenting" && result ? (buildPresentation(result)[presentIndex] ?? null) : null;

  const draw = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      if (!step) {
        return;
      }

      step.cells.forEach((cell) => {
        const x = cell.reel * cellWidth + 8;
        const y = cell.row * cellHeight + 8;
        const width = Math.max(cellWidth - 16, 0);
        const height = Math.max(cellHeight - 16, 0);
        graphics.roundRect(x, y, width, height, 12);
        graphics.fill({ color: 0xf0c93a, alpha: 0.35 });
        graphics.roundRect(x, y, width, height, 12);
        graphics.stroke({ color: 0xf0c93a, width: 4 });
      });

      if (step.kind !== "line" || step.cells.length < 2) {
        return;
      }

      const [first, ...rest] = step.cells;
      if (!first) {
        return;
      }
      graphics.moveTo(first.reel * cellWidth + cellWidth / 2, first.row * cellHeight + cellHeight / 2);
      rest.forEach((cell) => {
        graphics.lineTo(cell.reel * cellWidth + cellWidth / 2, cell.row * cellHeight + cellHeight / 2);
      });
      graphics.stroke({ color: 0xf0c93a, width: 5, cap: "round", join: "round" });
    },
    [cellHeight, cellWidth, step],
  );

  return <pixiGraphics draw={draw} />;
};
