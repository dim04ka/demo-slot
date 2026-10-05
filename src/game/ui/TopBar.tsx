import { formatCredits } from "./formatCredits";
import {
  StyledMeter,
  StyledMeterLabel,
  StyledMeterValue,
  StyledTopBar,
} from "./StyledSlotLayout";
import { useSlotStore } from "../store/useSlotStore";

export const TopBar = () => {
  const balance = useSlotStore((state) => state.balance);
  const lastWin = useSlotStore((state) => state.lastWin);

  return (
    <StyledTopBar>
      <StyledMeter>
        <StyledMeterLabel>BALANCE</StyledMeterLabel>
        <StyledMeterValue>{formatCredits(balance)}</StyledMeterValue>
      </StyledMeter>
      <StyledMeter>
        <StyledMeterLabel>WIN</StyledMeterLabel>
        <StyledMeterValue>{formatCredits(lastWin)}</StyledMeterValue>
      </StyledMeter>
    </StyledTopBar>
  );
};
