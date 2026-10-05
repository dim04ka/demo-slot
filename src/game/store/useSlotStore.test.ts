import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTO_PAUSE_MS, SPIN_MIN_MS, STOP_ALL_MS } from "../model/paytable";
import { spin } from "../model/spin";
import { useSlotStore } from "./useSlotStore";

const reset = (): void => {
  useSlotStore.setState({
    balance: 1000,
    bet: 20,
    phase: "idle",
    lastResult: null,
    lastWin: 0,
    presentIndex: 0,
    autoRemaining: null,
    toast: null,
    reelOrigin: [0, 0, 0, 0, 0],
    spinStartedAt: null,
    stopStartedAt: null,
    debugSeed: null,
  });
};

const zeroSeed = (): number => {
  for (let seed = 1; seed < 5000; seed += 1) {
    if (spin(seed, 20).totalAmount === 0) {
      return seed;
    }
  }
  return 1;
};

describe("useSlotStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reset();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("не списывает ставку при нехватке кредитов", () => {
    useSlotStore.setState({ balance: 10, bet: 20 });
    useSlotStore.getState().spin();

    expect(useSlotStore.getState().balance).toBe(10);
    expect(useSlotStore.getState().phase).toBe("idle");
    expect(useSlotStore.getState().lastResult).toBeNull();
    expect(useSlotStore.getState().toast).toBe("Недостаточно кредитов");
  });

  it("не меняет результат по STOP и начисляет выплату один раз", () => {
    useSlotStore.setState({ debugSeed: 42, balance: 1000, bet: 20 });
    useSlotStore.getState().spin();
    const result = useSlotStore.getState().lastResult;

    expect(useSlotStore.getState().balance).toBe(980);
    useSlotStore.getState().stop();
    expect(useSlotStore.getState().lastResult).toBe(result);
    expect(useSlotStore.getState().phase).toBe("stopping");

    vi.advanceTimersByTime(STOP_ALL_MS + 20);
    const settled = useSlotStore.getState();
    expect(settled.balance).toBe(980 + (result?.totalAmount ?? 0));
    vi.advanceTimersByTime(20000);
    expect(useSlotStore.getState().balance).toBe(980 + (result?.totalAmount ?? 0));
  });

  it("делает 10 автоспинов и останавливается, когда кредитов не хватает", () => {
    const seed = zeroSeed();
    useSlotStore.setState({ debugSeed: seed, balance: 1000, bet: 20 });
    useSlotStore.getState().startAuto(10);
    vi.advanceTimersByTime(10 * (SPIN_MIN_MS + STOP_ALL_MS + AUTO_PAUSE_MS) + 1000);

    expect(useSlotStore.getState().phase).toBe("idle");
    expect(useSlotStore.getState().autoRemaining).toBeNull();
    expect(useSlotStore.getState().balance).toBe(800);

    reset();
    useSlotStore.setState({ debugSeed: seed, balance: 50, bet: 20 });
    useSlotStore.getState().startAuto(10);
    vi.advanceTimersByTime(2 * (SPIN_MIN_MS + STOP_ALL_MS) + AUTO_PAUSE_MS + 20);

    expect(useSlotStore.getState().balance).toBe(10);
    expect(useSlotStore.getState().phase).toBe("idle");
    expect(useSlotStore.getState().autoRemaining).toBeNull();
    expect(useSlotStore.getState().toast).toBe("Недостаточно кредитов");
  });
});
