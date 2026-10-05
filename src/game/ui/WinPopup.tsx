import { useSlotStore } from "../store/useSlotStore";
import { formatCredits } from "./formatCredits";
import { StyledWinAmount, StyledWinPopup, StyledWinTitle } from "./StyledSlotLayout";

export const WinPopup = () => {
  const phase = useSlotStore((state) => state.phase);
  const lastWin = useSlotStore((state) => state.lastWin);

  if (phase !== "presenting" || lastWin <= 0) {
    return null;
  }

  return (
    <StyledWinPopup role="status" aria-live="polite">
      <StyledWinTitle>Поздравляем!</StyledWinTitle>
      <StyledWinAmount>{formatCredits(lastWin)}</StyledWinAmount>
    </StyledWinPopup>
  );
};
