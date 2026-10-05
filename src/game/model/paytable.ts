import type { SymbolId } from "./types";

export const PAY_COUNTS = [3, 4, 5] as const;

export type PayCount = (typeof PAY_COUNTS)[number];

export const PAYTABLE: Record<SymbolId, Record<PayCount, number>> = {
  cherry: { 3: 5, 4: 15, 5: 40 },
  lemon: { 3: 5, 4: 15, 5: 40 },
  plum: { 3: 8, 4: 20, 5: 60 },
  orange: { 3: 8, 4: 20, 5: 60 },
  bell: { 3: 10, 4: 30, 5: 80 },
  bar: { 3: 15, 4: 40, 5: 100 },
  seven: { 3: 20, 4: 60, 5: 200 },
  diamond: { 3: 30, 4: 100, 5: 500 },
  wild: { 3: 50, 4: 200, 5: 1000 },
  scatter: { 3: 5, 4: 20, 5: 100 },
};

export const BETS = [20, 40, 60, 80, 100, 200, 500] as const;

export type Bet = (typeof BETS)[number];

export const START_BALANCE = 1000;
export const LINE_COUNT = 20;

export const SPIN_MIN_MS = 600;
export const REEL_STAGGER_MS = 180;
export const REEL_STOP_MS = 700;
export const REEL_OVERSHOOT_MS = 120;
export const REEL_SPEED = 18;
export const OVERSHOOT_CELLS = 0.15;
export const PRESENT_MS = 900;
export const AUTO_PAUSE_MS = 400;
export const TOAST_MS = 2000;

export const STOP_ALL_MS = (5 - 1) * REEL_STAGGER_MS + REEL_STOP_MS;
