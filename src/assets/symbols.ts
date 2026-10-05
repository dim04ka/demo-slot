import type { SymbolId } from "../game/model/types";

export type SymbolStyle = {
  title: string;
  src: string;
};

export const SYMBOL_STYLE: Record<SymbolId, SymbolStyle> = {
  cherry: { title: "Cherry", src: "/symbols/cherry.jpg" },
  lemon: { title: "Lemon", src: "/symbols/lemon.jpg" },
  plum: { title: "Plum", src: "/symbols/plum.jpg" },
  orange: { title: "Orange", src: "/symbols/orange.jpg" },
  bell: { title: "Bell", src: "/symbols/bell.jpg" },
  bar: { title: "Bar", src: "/symbols/bar.jpg" },
  seven: { title: "Seven", src: "/symbols/seven.jpg" },
  diamond: { title: "Diamond", src: "/symbols/diamond.jpg" },
  wild: { title: "Wild", src: "/symbols/wild.jpg" },
  scatter: { title: "Scatter", src: "/symbols/scatter.jpg" },
};

export const SYMBOL_ORDER: SymbolId[] = [
  "cherry",
  "lemon",
  "plum",
  "orange",
  "bell",
  "bar",
  "seven",
  "diamond",
  "wild",
  "scatter",
];

export const SYMBOL_SRC = SYMBOL_ORDER.map((symbol) => SYMBOL_STYLE[symbol].src);
