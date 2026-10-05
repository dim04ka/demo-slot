import styled, { keyframes } from "styled-components";

const landscapePhone = "@media (orientation: landscape) and (max-height: 520px)";

export const StyledPage = styled.main`
  min-height: 100dvh;
  min-width: 0;
  display: grid;
  place-items: center;
  padding: 20px 16px 28px;

  ${landscapePhone} {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    place-items: stretch;
    height: 100dvh;
    min-height: 0;
    padding:
      max(8px, env(safe-area-inset-top))
      max(10px, env(safe-area-inset-right))
      max(8px, env(safe-area-inset-bottom))
      max(10px, env(safe-area-inset-left));
    overflow: hidden;
  }
`;

export const StyledMachine = styled.section`
  width: 100%;
  max-width: 1100px;
  min-width: 0;
  display: grid;
  gap: 12px;

  ${landscapePhone} {
    position: relative;
    height: 100%;
    min-height: 0;
    max-width: none;
    grid-template-columns: minmax(0, 1fr) 176px;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas:
      "hud hud"
      "board controls";
    gap: 8px;
  }
`;

export const StyledTopBar = styled.header`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  ${landscapePhone} {
    grid-area: hud;
    gap: 8px;
  }
`;

export const StyledBadge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f0c93a;
  color: #241808;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
`;

export const StyledMeter = styled.div`
  min-width: 0;
  flex: 1;
  padding: 8px 12px;
  border-radius: 12px;
  background: #1b1028;
  border: 1px solid #3a2750;

  ${landscapePhone} {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 10px;
  }
`;

export const StyledMeterLabel = styled.div`
  color: #b9a7c9;
  font-size: 11px;
  letter-spacing: 0.08em;
`;

export const StyledMeterValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  ${landscapePhone} {
    font-size: 18px;
  }
`;

export const StyledBoard = styled.div`
  min-width: 0;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 12px;

  ${landscapePhone} {
    grid-area: board;
    position: relative;
    height: 100%;
    min-height: 0;
    align-content: center;
    gap: 0;
    container-type: size;
  }
`;

export const StyledStage = styled.div`
  position: relative;
  width: 100%;
  max-width: calc((100dvh - 250px) / 0.62);
  min-width: 0;
  aspect-ratio: 100 / 62;
  justify-self: center;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #6d4d16;
  box-shadow: 0 18px 50px rgb(0 0 0 / 35%);

  ${landscapePhone} {
    width: min(100cqi, calc(100cqb * 100 / 62));
    max-width: 100%;
    max-height: 100cqb;
    height: auto;
  }
`;

const winPop = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -42%) scale(0.86);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const StyledWinPopup = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  transform: translate(-50%, -50%);
  min-width: min(280px, 78%);
  padding: 16px 22px 18px;
  border-radius: 18px;
  text-align: center;
  pointer-events: none;
  background: #160c22;
  border: 2px solid #f0c93a;
  box-shadow: 0 18px 40px rgb(0 0 0 / 55%);
  animation: ${winPop} 220ms ease-out;
`;

export const StyledWinTitle = styled.div`
  color: #f0c93a;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.04em;
`;

export const StyledWinAmount = styled.div`
  margin-top: 4px;
  color: #f4efe4;
  font-size: 36px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;

export const StyledCaption = styled.div`
  min-height: 28px;
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #f0c93a;
  font-weight: 700;
  letter-spacing: 0.06em;

  ${landscapePhone} {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 6px;
    z-index: 2;
    min-height: 0;
    pointer-events: none;
    text-shadow:
      0 1px 2px #07060d,
      0 0 10px #07060d;
  }
`;

export const StyledControlBar = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 899px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    align-items: stretch;
  }

  ${landscapePhone} {
    grid-area: controls;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    min-height: 0;
    gap: 8px;
  }
`;

export const StyledBetGroup = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: #1b1028;

  ${landscapePhone} {
    width: 100%;

    button {
      min-width: 44px;
      min-height: 44px;
    }
  }
`;

export const StyledBetValue = styled.div`
  min-width: 0;
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

type StyledButtonProps = {
  $tone?: "gold" | "ghost";
};

export const StyledButton = styled.button<StyledButtonProps>`
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: ${({ $tone }) => ($tone === "gold" ? "#f0c93a" : "#2a1a3d")};
  color: ${({ $tone }) => ($tone === "gold" ? "#241808" : "#f4efe4")};
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const StyledSpinButton = styled(StyledButton)`
  min-width: 148px;
  min-height: 64px;
  font-size: 22px;

  @media (max-width: 899px) {
    min-width: 0;
    width: 100%;
    grid-column: 2;
    grid-row: 1 / span 2;
    height: 100%;
  }

  ${landscapePhone} {
    grid-column: auto;
    grid-row: auto;
    flex: 1;
    width: 100%;
    min-width: 0;
    min-height: 72px;
    height: auto;
  }
`;

export const StyledTools = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 899px) {
    margin-left: 0;
    grid-column: 1;
  }

  ${landscapePhone} {
    width: 100%;
    margin-left: 0;
    grid-column: auto;

    button {
      width: 100%;
    }
  }
`;

export const StyledAuto = styled.div`
  position: relative;

  ${landscapePhone} {
    width: 100%;
  }
`;

export const StyledAutoMenu = styled.div`
  position: absolute;
  left: 0;
  bottom: calc(100% + 8px);
  display: flex;
  gap: 6px;
  padding: 8px;
  border-radius: 12px;
  background: #2a1a3d;
  border: 1px solid #4a3264;
  z-index: 2;

  ${landscapePhone} {
    right: 0;
    flex-direction: column;
  }
`;

export const StyledToast = styled.div`
  min-height: 24px;
  text-align: center;
  color: #ffb4b4;

  ${landscapePhone} {
    position: absolute;
    left: 50%;
    bottom: 6px;
    z-index: 4;
    min-height: 0;
    transform: translateX(-50%);

    &:not(:empty) {
      padding: 4px 10px;
      border-radius: 999px;
      background: rgb(22 12 34 / 92%);
    }
  }
`;

export const StyledDev = styled.label`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  color: #b9a7c9;
  font-size: 13px;

  input {
    width: 120px;
    border: 1px solid #4a3264;
    border-radius: 8px;
    background: #120a1c;
    color: inherit;
    padding: 6px 8px;
  }

  ${landscapePhone} {
    display: none;
  }
`;
