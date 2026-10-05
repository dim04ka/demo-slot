export type SymbolId =
  | "cherry"
  | "lemon"
  | "plum"
  | "orange"
  | "bell"
  | "bar"
  | "seven"
  | "diamond"
  | "wild"
  | "scatter";

export type Grid = readonly [
  readonly [SymbolId, SymbolId, SymbolId],
  readonly [SymbolId, SymbolId, SymbolId],
  readonly [SymbolId, SymbolId, SymbolId],
  readonly [SymbolId, SymbolId, SymbolId],
  readonly [SymbolId, SymbolId, SymbolId],
];

export type Cell = {
  reel: number;
  row: number;
};

export type LineWin = {
  lineIndex: number;
  symbol: SymbolId;
  count: 3 | 4 | 5;
  amount: number;
  cells: readonly Cell[];
};

export type Stops = readonly [number, number, number, number, number];

export type SpinResult = {
  seed: number;
  stops: Stops;
  grid: Grid;
  lineWins: readonly LineWin[];
  scatterCount: 0 | 1 | 2 | 3 | 4 | 5;
  scatterAmount: number;
  totalAmount: number;
};

export type SpinPhase =
  | "idle"
  | "spinning"
  | "stopping"
  | "presenting"
  | "auto-pause";

export type PresentationStep =
  | {
      kind: "line";
      lineIndex: number;
      amount: number;
      cells: readonly Cell[];
    }
  | {
      kind: "scatter";
      amount: number;
      cells: readonly Cell[];
    };
