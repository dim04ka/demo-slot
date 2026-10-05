import { describe, expect, it } from "vitest";
import { REEL_STOP_MS } from "../model/paytable";
import { landingPos, stoppingPos } from "./reelMotion";

describe("reelMotion", () => {
  it("доезжает до символа stop в направлении вращения", () => {
    const length = 20;
    const end = landingPos(3.4, 12, length);

    expect(end).toBeLessThanOrEqual(3.4);
    expect(((end % length) + length) % length).toBeCloseTo(12);
    expect(stoppingPos(3.4, end, REEL_STOP_MS)).toBe(end);
  });
});
