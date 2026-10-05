import { LINE_COUNT, PAYTABLE } from "./paytable";
import type { Grid, LineWin, SymbolId } from "./types";

export const PAYLINES = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 0, 1, 2, 1],
  [1, 2, 1, 0, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [0, 2, 1, 2, 0],
] as const;

const isPayCount = (count: number): count is 3 | 4 | 5 =>
  count === 3 || count === 4 || count === 5;

export const lineSymbols = (grid: Grid, lineIndex: number): SymbolId[] => {
  const line = PAYLINES[lineIndex];
  if (!line) {
    return [];
  }

  return line.map((row, reel) => grid[reel][row]);
};

export const evaluateLine = (
  symbols: readonly SymbolId[],
  lineIndex: number,
  lineBet: number,
): LineWin | null => {
  const line = PAYLINES[lineIndex];
  if (!line || symbols[0] === "scatter") {
    return null;
  }

  let target: SymbolId | null = null;
  for (const symbol of symbols) {
    if (symbol === "scatter") {
      break;
    }
    if (symbol !== "wild") {
      target = symbol;
      break;
    }
  }

  const paySymbol: SymbolId = target ?? "wild";
  let count = 0;
  for (const symbol of symbols) {
    const matches = symbol === paySymbol || symbol === "wild";
    if (!matches) {
      break;
    }
    count += 1;
  }

  if (!isPayCount(count)) {
    return null;
  }

  return {
    lineIndex,
    symbol: paySymbol,
    count,
    amount: PAYTABLE[paySymbol][count] * lineBet,
    cells: Array.from({ length: count }, (_, reel) => ({
      reel,
      row: line[reel],
    })),
  };
};

export const evaluateLines = (grid: Grid, bet: number): LineWin[] => {
  const lineBet = bet / LINE_COUNT;
  const wins: LineWin[] = [];

  for (let lineIndex = 0; lineIndex < PAYLINES.length; lineIndex += 1) {
    const win = evaluateLine(lineSymbols(grid, lineIndex), lineIndex, lineBet);
    if (win) {
      wins.push(win);
    }
  }

  return wins;
};
