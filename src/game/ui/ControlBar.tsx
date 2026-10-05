import { useState } from "react";
import { BETS } from "../model/paytable";
import { useSlotStore } from "../store/useSlotStore";
import { formatAutoCount, formatCredits } from "./formatCredits";
import {
  StyledAuto,
  StyledAutoMenu,
  StyledBetGroup,
  StyledBetValue,
  StyledButton,
  StyledControlBar,
  StyledSpinButton,
  StyledTools,
} from "./StyledSlotLayout";

const AUTO_COUNTS = [10, 25, 50, Number.POSITIVE_INFINITY] as const;

export const ControlBar = () => {
  const phase = useSlotStore((state) => state.phase);
  const bet = useSlotStore((state) => state.bet);
  const autoRemaining = useSlotStore((state) => state.autoRemaining);
  const spin = useSlotStore((state) => state.spin);
  const stop = useSlotStore((state) => state.stop);
  const setBet = useSlotStore((state) => state.setBet);
  const startAuto = useSlotStore((state) => state.startAuto);
  const cancelAuto = useSlotStore((state) => state.cancelAuto);
  const [menuOpen, setMenuOpen] = useState(false);

  const betIndex = BETS.indexOf(bet);
  const locked = phase !== "idle";
  const spinDisabled = phase === "stopping" || phase === "presenting" || phase === "auto-pause";
  const autoDisabled = locked && autoRemaining === null;

  const onSpin = () => {
    if (phase === "spinning") {
      if (autoRemaining !== null) {
        cancelAuto();
      }
      stop();
      return;
    }
    spin();
  };

  const onAuto = () => {
    if (autoRemaining !== null) {
      cancelAuto();
      setMenuOpen(false);
      return;
    }
    setMenuOpen((open) => !open);
  };

  return (
    <StyledControlBar>
      <StyledBetGroup>
        <StyledButton
          type="button"
          disabled={locked || betIndex <= 0}
          onClick={() => setBet(BETS[betIndex - 1] ?? bet)}
        >
          −
        </StyledButton>
        <StyledBetValue>{formatCredits(bet)}</StyledBetValue>
        <StyledButton
          type="button"
          disabled={locked || betIndex >= BETS.length - 1}
          onClick={() => setBet(BETS[betIndex + 1] ?? bet)}
        >
          +
        </StyledButton>
      </StyledBetGroup>
      <StyledSpinButton $tone="gold" type="button" disabled={spinDisabled} onClick={onSpin}>
        {phase === "spinning" ? "STOP" : "SPIN"}
      </StyledSpinButton>
      <StyledTools>
        <StyledAuto>
          <StyledButton type="button" disabled={autoDisabled} onClick={onAuto}>
            {autoRemaining === null ? "AUTO" : `AUTO ${formatAutoCount(autoRemaining)}`}
          </StyledButton>
          {menuOpen && phase === "idle" ? (
            <StyledAutoMenu>
              {AUTO_COUNTS.map((count) => (
                <StyledButton
                  key={formatAutoCount(count)}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    startAuto(count);
                  }}
                >
                  {formatAutoCount(count)}
                </StyledButton>
              ))}
            </StyledAutoMenu>
          ) : null}
        </StyledAuto>
      </StyledTools>
    </StyledControlBar>
  );
};
