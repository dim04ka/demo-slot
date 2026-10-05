import { buildPresentation } from "../model/spin";
import { useSlotStore } from "../store/useSlotStore";
import { formatCredits } from "./formatCredits";
import { StyledCaption } from "./StyledSlotLayout";

export const WinCaption = () => {
  const phase = useSlotStore((state) => state.phase);
  const result = useSlotStore((state) => state.lastResult);
  const presentIndex = useSlotStore((state) => state.presentIndex);
  const step = phase === "presenting" && result ? buildPresentation(result)[presentIndex] : null;

  return (
    <StyledCaption>
      {step ? (
        <>
          <span>{step.kind === "line" ? `LINE ${step.lineIndex + 1}` : "SCATTER"}</span>
          <strong>{formatCredits(step.amount)}</strong>
        </>
      ) : null}
    </StyledCaption>
  );
};
