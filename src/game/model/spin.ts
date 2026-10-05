import { evaluateLines } from "./lines";
import { PAYTABLE } from "./paytable";
import { stopsFromSeed } from "./rng";
import { gridFromStops } from "./reels";
import type { Cell, Grid, PresentationStep, SpinResult, Stops } from "./types";

const scatterCountOf = (grid: Grid): SpinResult["scatterCount"] => {
  let count = 0;
  for (const column of grid) {
    for (const symbol of column) {
      if (symbol === "scatter") {
        count += 1;
      }
    }
  }

  if (count > 5) {
    return 5;
  }

  return count as SpinResult["scatterCount"];
};

const scatterCells = (grid: Grid): Cell[] => {
  const cells: Cell[] = [];
  grid.forEach((column, reel) => {
    column.forEach((symbol, row) => {
      if (symbol === "scatter") {
        cells.push({ reel, row });
      }
    });
  });
  return cells;
};

export const evaluateGrid = (
  grid: Grid,
  bet: number,
  stops: Stops,
  seed: number,
): SpinResult => {
  const lineWins = evaluateLines(grid, bet);
  const scatterCount = scatterCountOf(grid);
  const scatterPay = PAYTABLE.scatter[scatterCount as 3 | 4 | 5];
  const scatterAmount = scatterPay ? scatterPay * bet : 0;
  const lineAmount = lineWins.reduce((sum, win) => sum + win.amount, 0);

  return {
    seed,
    stops,
    grid,
    lineWins,
    scatterCount,
    scatterAmount,
    totalAmount: lineAmount + scatterAmount,
  };
};

export const spinFromStops = (stops: Stops, bet: number, seed = 0): SpinResult =>
  evaluateGrid(gridFromStops(stops), bet, stops, seed);

export const spin = (seed: number, bet: number): SpinResult =>
  spinFromStops(stopsFromSeed(seed), bet, seed);

export const buildPresentation = (result: SpinResult): PresentationStep[] => {
  const lines = [...result.lineWins].sort(
    (left, right) => right.amount - left.amount || left.lineIndex - right.lineIndex,
  );

  const steps: PresentationStep[] = lines.map((win) => ({
    kind: "line",
    lineIndex: win.lineIndex,
    amount: win.amount,
    cells: win.cells,
  }));

  if (result.scatterAmount > 0) {
    steps.push({
      kind: "scatter",
      amount: result.scatterAmount,
      cells: scatterCells(result.grid),
    });
  }

  return steps;
};
