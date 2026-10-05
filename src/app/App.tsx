import { DevSeed } from "../game/ui/DevSeed";
import { ControlBar } from "../game/ui/ControlBar";
import { TopBar } from "../game/ui/TopBar";
import { WinCaption } from "../game/ui/WinCaption";
import { StyledBoard, StyledMachine, StyledPage, StyledToast } from "../game/ui/StyledSlotLayout";
import { useSlotStore } from "../game/store/useSlotStore";
import { SlotStage } from "../game/view/SlotStage";
import { GlobalStyle } from "./styles/GlobalStyle";

export const App = () => {
  const toast = useSlotStore((state) => state.toast);

  return (
    <>
      <GlobalStyle />
      <StyledPage>
        <StyledMachine>
          <TopBar />
          <StyledBoard>
            <SlotStage />
            <WinCaption />
          </StyledBoard>
          <ControlBar />
          <StyledToast>{toast}</StyledToast>
          <DevSeed />
        </StyledMachine>
      </StyledPage>
    </>
  );
};
