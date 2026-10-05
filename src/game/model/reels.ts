import type { Grid, Stops, SymbolId } from "./types";

export const REEL_STRIPS = [
  ["cherry", "lemon", "wild", "plum", "orange", "bell", "bar", "cherry", "seven", "lemon", "scatter", "plum", "diamond", "orange", "bell", "cherry", "bar", "lemon", "seven", "plum"],
  ["lemon", "cherry", "orange", "plum", "bell", "wild", "bar", "lemon", "seven", "orange", "cherry", "scatter", "diamond", "plum", "bell", "orange", "bar", "cherry", "seven", "lemon"],
  ["plum", "orange", "cherry", "bell", "lemon", "bar", "seven", "wild", "orange", "cherry", "diamond", "plum", "scatter", "lemon", "bell", "bar", "orange", "seven", "cherry", "plum"],
  ["orange", "plum", "lemon", "cherry", "bar", "bell", "seven", "orange", "wild", "lemon", "diamond", "cherry", "scatter", "plum", "bar", "bell", "seven", "orange", "lemon", "cherry"],
  ["cherry", "orange", "plum", "lemon", "bell", "bar", "seven", "cherry", "diamond", "orange", "wild", "lemon", "scatter", "plum", "bell", "bar", "seven", "cherry", "orange", "lemon"],
] as const satisfies readonly (readonly SymbolId[])[];

export const gridFromStops = (stops: Stops): Grid => {
  const columns = REEL_STRIPS.map((strip, reel) => {
    const length = strip.length;
    const stop = stops[reel] ?? 0;
    const top = strip[(stop - 1 + length) % length] ?? "cherry";
    const middle = strip[stop] ?? "cherry";
    const bottom = strip[(stop + 1) % length] ?? "cherry";
    return [top, middle, bottom] as const;
  });

  return columns as unknown as Grid;
};
