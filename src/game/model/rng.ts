import { REEL_STRIPS } from "./reels";
import type { Stops } from "./types";

const mix = (value: number): number => {
  let next = value >>> 0;
  next = Math.imul(next ^ (next >>> 16), 0x7feb352d);
  next = Math.imul(next ^ (next >>> 15), 0x846ca68b);
  return (next ^ (next >>> 16)) >>> 0;
};

export const createSeed = (): number => Math.floor(Math.random() * 0x7fffffff);

export const stopsFromSeed = (seed: number): Stops => {
  const stops = REEL_STRIPS.map((strip, reel) => {
    const hashed = mix((seed ^ Math.imul(reel + 1, 0x9e3779b1)) >>> 0);
    return hashed % strip.length;
  });

  return [stops[0] ?? 0, stops[1] ?? 0, stops[2] ?? 0, stops[3] ?? 0, stops[4] ?? 0];
};
