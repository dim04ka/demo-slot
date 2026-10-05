import { describe, expect, it } from "vitest";
import { PAYTABLE } from "./paytable";
import { REEL_STRIPS, gridFromStops } from "./reels";
import { evaluateGrid, spin, spinFromStops } from "./spin";
import type { Grid, Stops } from "./types";

const stops = (values: number[]): Stops =>
  [values[0] ?? 0, values[1] ?? 0, values[2] ?? 0, values[3] ?? 0, values[4] ?? 0];

describe("spin", () => {
  it("ставит stop в средний ряд каждого барабана", () => {
    REEL_STRIPS.forEach((strip, reel) => {
      strip.forEach((_, stop) => {
        const current = stops([0, 0, 0, 0, 0]);
        const next = stops(current.map((value, index) => (index === reel ? stop : value)));
        expect(gridFromStops(next)[reel][1]).toBe(strip[stop]);
      });
    });
  });

  it("даёт 500 за пять diamond на линии 0 при ставке 20", () => {
    const result = spinFromStops(stops([12, 12, 10, 10, 8]), 20, 1);
    const line = result.lineWins.find((win) => win.lineIndex === 0);

    expect(line).toMatchObject({
      symbol: "diamond",
      count: 5,
      amount: 500,
    });
    expect(result.grid.map((column) => column[1])).toEqual([
      "diamond",
      "diamond",
      "diamond",
      "diamond",
      "diamond",
    ]);
  });

  it("дополняет seven вайлдами на барабанах 2 и 3", () => {
    const grid = [
      ["cherry", "seven", "bar"],
      ["lemon", "wild", "seven"],
      ["plum", "wild", "diamond"],
      ["orange", "lemon", "cherry"],
      ["bell", "orange", "plum"],
    ] as const satisfies Grid;

    const result = evaluateGrid(grid, 20, stops([0, 0, 0, 0, 0]), 2);
    const line = result.lineWins.find((win) => win.lineIndex === 0);

    expect(line).toMatchObject({
      symbol: "seven",
      count: 3,
      amount: PAYTABLE.seven[3],
    });
  });

  it("платит пять wild по таблице wild", () => {
    const grid = [
      ["cherry", "wild", "bar"],
      ["lemon", "wild", "seven"],
      ["plum", "wild", "diamond"],
      ["orange", "wild", "cherry"],
      ["bell", "wild", "plum"],
    ] as const satisfies Grid;

    const result = evaluateGrid(grid, 20, stops([0, 0, 0, 0, 0]), 3);
    const line = result.lineWins.find((win) => win.lineIndex === 0);

    expect(line).toMatchObject({
      symbol: "wild",
      count: 5,
      amount: 1000,
    });
  });

  it("платит scatter от полной ставки и не создаёт линию", () => {
    const grid = [
      ["lemon", "orange", "plum"],
      ["cherry", "bell", "bar"],
      ["scatter", "scatter", "scatter"],
      ["seven", "diamond", "wild"],
      ["bar", "lemon", "orange"],
    ] as const satisfies Grid;

    const result = evaluateGrid(grid, 100, stops([0, 0, 0, 0, 0]), 4);

    expect(result.scatterCount).toBe(3);
    expect(result.scatterAmount).toBe(500);
    expect(result.lineWins).toEqual([]);
    expect(result.totalAmount).toBe(500);
  });

  it("возвращает один и тот же результат для одного seed", () => {
    expect(spin(42, 40)).toEqual(spin(42, 40));
  });
});
