/// <reference types="vite/client" />

import type { useSlotStore } from "./game/store/useSlotStore";

declare global {
  interface Window {
    __slot?: typeof useSlotStore;
  }
}

export {};
