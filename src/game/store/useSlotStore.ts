import { create } from "zustand";
import { playReelStop, playSpinClick, playWin } from "../audio";
import {
  AUTO_PAUSE_MS,
  BETS,
  PRESENT_MS,
  REEL_STAGGER_MS,
  REEL_STOP_MS,
  SPIN_MIN_MS,
  START_BALANCE,
  STOP_ALL_MS,
  TOAST_MS,
  type Bet,
} from "../model/paytable";
import { createSeed } from "../model/rng";
import { buildPresentation, spin } from "../model/spin";
import type { SpinPhase, SpinResult, Stops } from "../model/types";

const IDLE_STOPS: Stops = [0, 0, 0, 0, 0];

export type SlotState = {
  balance: number;
  bet: Bet;
  phase: SpinPhase;
  lastResult: SpinResult | null;
  lastWin: number;
  presentIndex: number;
  autoRemaining: number | null;
  toast: string | null;
  reelOrigin: Stops;
  spinStartedAt: number | null;
  stopStartedAt: number | null;
  debugSeed: number | null;
  spin: () => void;
  stop: () => void;
  setBet: (next: number) => void;
  startAuto: (count: number) => void;
  cancelAuto: () => void;
  setDebugSeed: (seed: number | null) => void;
};

let roundToken = 0;
let flowTimers: ReturnType<typeof setTimeout>[] = [];
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const clearFlow = (): void => {
  flowTimers.forEach((id) => clearTimeout(id));
  flowTimers = [];
};

const later = (ms: number, run: () => void): void => {
  const id = setTimeout(run, ms);
  flowTimers.push(id);
};

export const useSlotStore = create<SlotState>((set, get) => {
  const showToast = (message: string): void => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    set({ toast: message });
    toastTimer = setTimeout(() => {
      toastTimer = null;
      if (get().toast === message) {
        set({ toast: null });
      }
    }, TOAST_MS);
  };

  const finishRound = (current: number): void => {
    if (roundToken !== current) {
      return;
    }

    const { autoRemaining, balance, bet } = get();
    if (autoRemaining === null) {
      set({ phase: "idle", spinStartedAt: null, stopStartedAt: null });
      return;
    }

    const nextAuto =
      autoRemaining === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : autoRemaining - 1;
    if (nextAuto === 0 || balance < bet) {
      if (nextAuto !== 0 && balance < bet) {
        showToast("Недостаточно кредитов");
      }
      set({
        phase: "idle",
        autoRemaining: null,
        spinStartedAt: null,
        stopStartedAt: null,
      });
      return;
    }

    set({
      phase: "auto-pause",
      autoRemaining: nextAuto,
      spinStartedAt: null,
      stopStartedAt: null,
    });
    later(AUTO_PAUSE_MS, () => {
      if (roundToken !== current || get().phase !== "auto-pause" || get().autoRemaining === null) {
        if (get().phase === "auto-pause") {
          set({ phase: "idle", spinStartedAt: null, stopStartedAt: null });
        }
        return;
      }
      beginSpin();
    });
  };

  const settle = (current: number): void => {
    if (roundToken !== current || get().phase !== "stopping") {
      return;
    }

    const result = get().lastResult;
    if (!result || result.totalAmount <= 0) {
      set({ lastWin: 0 });
      finishRound(current);
      return;
    }

    const steps = Math.max(buildPresentation(result).length, 1);
    set({
      balance: get().balance + result.totalAmount,
      phase: "presenting",
      presentIndex: 0,
      lastWin: result.totalAmount,
    });
    playWin(result.totalAmount >= get().bet * 10);

    for (let index = 1; index < steps; index += 1) {
      later(index * PRESENT_MS, () => {
        if (roundToken === current && get().phase === "presenting") {
          set({ presentIndex: index });
        }
      });
    }

    later(steps * PRESENT_MS, () => finishRound(current));
  };

  const startStopping = (current: number): void => {
    if (roundToken !== current || get().phase !== "spinning") {
      return;
    }

    set({ phase: "stopping", stopStartedAt: Date.now() });
    for (let reel = 0; reel < 5; reel += 1) {
      later(reel * REEL_STAGGER_MS + REEL_STOP_MS, () => {
        if (roundToken === current) {
          playReelStop();
        }
      });
    }
    later(STOP_ALL_MS, () => settle(current));
  };

  const beginSpin = (): void => {
    const { balance, bet, lastResult, debugSeed } = get();
    if (balance < bet) {
      showToast("Недостаточно кредитов");
      set({
        phase: "idle",
        autoRemaining: null,
        spinStartedAt: null,
        stopStartedAt: null,
      });
      return;
    }

    clearFlow();
    roundToken += 1;
    const current = roundToken;
    const result = spin(debugSeed ?? createSeed(), bet);

    set({
      balance: balance - bet,
      phase: "spinning",
      lastResult: result,
      presentIndex: 0,
      reelOrigin: lastResult?.stops ?? IDLE_STOPS,
      spinStartedAt: Date.now(),
      stopStartedAt: null,
      toast: null,
    });
    playSpinClick();
    later(SPIN_MIN_MS, () => startStopping(current));
  };

  return {
    balance: START_BALANCE,
    bet: 20,
    phase: "idle",
    lastResult: null,
    lastWin: 0,
    presentIndex: 0,
    autoRemaining: null,
    toast: null,
    reelOrigin: IDLE_STOPS,
    spinStartedAt: null,
    stopStartedAt: null,
    debugSeed: null,
    spin: () => {
      if (get().phase !== "idle") {
        return;
      }
      beginSpin();
    },
    stop: () => {
      if (get().phase !== "spinning") {
        return;
      }
      clearFlow();
      startStopping(roundToken);
    },
    setBet: (next) => {
      if (get().phase !== "idle" || !BETS.includes(next as Bet)) {
        return;
      }
      set({ bet: next as Bet });
    },
    startAuto: (count) => {
      if (get().phase !== "idle") {
        return;
      }
      set({ autoRemaining: count });
      beginSpin();
    },
    cancelAuto: () => {
      set({ autoRemaining: null });
      if (get().phase === "auto-pause") {
        clearFlow();
        set({ phase: "idle", spinStartedAt: null, stopStartedAt: null });
      }
    },
    setDebugSeed: (seed) => {
      set({ debugSeed: seed });
    },
  };
});

if (import.meta.env.DEV && typeof window !== "undefined") {
  window.__slot = useSlotStore;
}
