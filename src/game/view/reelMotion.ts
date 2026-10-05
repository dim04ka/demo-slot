import {
  OVERSHOOT_CELLS,
  REEL_OVERSHOOT_MS,
  REEL_SPEED,
  REEL_STAGGER_MS,
  REEL_STOP_MS,
} from "../model/paytable";
import type { SpinPhase, Stops } from "../model/types";

export type ReelClock = {
  phase: SpinPhase;
  reelOrigin: Stops;
  stops: Stops | null;
  spinStartedAt: number | null;
  stopStartedAt: number | null;
  now: number;
};

const wrap = (value: number, length: number): number => {
  const mod = value % length;
  return mod < 0 ? mod + length : mod;
};

export const landingPos = (current: number, stop: number, length: number): number => {
  const deltaBase = (wrap(current, length) - stop + length) % length;
  const delta = deltaBase < 0.35 ? deltaBase + length : deltaBase;
  return current - delta;
};

const easeOut = (progress: number): number => 1 - (1 - progress) ** 3;

export const stoppingPos = (start: number, end: number, elapsedMs: number): number => {
  if (elapsedMs >= REEL_STOP_MS) {
    return end;
  }

  const cruise = REEL_STOP_MS - REEL_OVERSHOOT_MS;
  if (elapsedMs <= cruise) {
    return start + (end - start) * easeOut(elapsedMs / cruise);
  }

  const bump =
    Math.sin(((elapsedMs - cruise) / REEL_OVERSHOOT_MS) * Math.PI) * OVERSHOOT_CELLS;
  return end - bump;
};

export const reelPos = (clock: ReelClock, reel: number, length: number): number => {
  const origin = clock.reelOrigin[reel] ?? 0;
  const stop = clock.stops?.[reel] ?? origin;
  const resting = clock.phase === "idle" || clock.phase === "presenting" || clock.phase === "auto-pause";

  if (resting || clock.spinStartedAt === null) {
    return clock.stops ? stop : origin;
  }

  const spun = origin - ((clock.now - clock.spinStartedAt) / 1000) * REEL_SPEED;
  if (clock.phase === "spinning" || clock.stopStartedAt === null) {
    return spun;
  }

  const delay = reel * REEL_STAGGER_MS;
  const sinceStop = clock.now - clock.stopStartedAt;
  if (sinceStop < delay) {
    return spun;
  }

  const start = origin - ((clock.stopStartedAt + delay - clock.spinStartedAt) / 1000) * REEL_SPEED;
  return stoppingPos(start, landingPos(start, stop, length), sinceStop - delay);
};

export const reelOffsetY = (pos: number, cellHeight: number, length: number): number => {
  const loop = length * cellHeight;
  const raw = (1 - pos) * cellHeight;
  const wrapped = ((raw % loop) + loop) % loop;
  return wrapped - loop;
};
