import { Application } from "@pixi/react";
import { Assets } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { SYMBOL_SRC } from "../../assets/symbols";
import { StyledStage } from "../ui/StyledSlotLayout";
import { WinPopup } from "../ui/WinPopup";
import { ReelColumn } from "./ReelColumn";
import { WinOverlay } from "./WinOverlay";

const REELS = [0, 1, 2, 3, 4] as const;

export const SlotStage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [symbolsReady, setSymbolsReady] = useState(false);

  useEffect(() => {
    let active = true;
    void Assets.load(SYMBOL_SRC).then(() => {
      if (active) {
        setSymbolsReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const update = () => {
      setSize({ width: host.clientWidth, height: host.clientHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const cellWidth = size.width / 5;
  const cellHeight = size.height / 3;

  return (
    <StyledStage ref={hostRef}>
      {symbolsReady && size.width > 0 && size.height > 0 ? (
        <Application
          width={size.width}
          height={size.height}
          resizeTo={hostRef}
          background={0x14081f}
          antialias
          autoDensity
          resolution={Math.min(window.devicePixelRatio || 1, 2)}
        >
          {REELS.map((reel) => (
            <ReelColumn key={reel} reel={reel} cellWidth={cellWidth} cellHeight={cellHeight} />
          ))}
          <WinOverlay cellWidth={cellWidth} cellHeight={cellHeight} />
        </Application>
      ) : null}
      <WinPopup />
    </StyledStage>
  );
};
