import { useSlotStore } from "../store/useSlotStore";
import { StyledDev } from "./StyledSlotLayout";

export const DevSeed = () => {
  const debugSeed = useSlotStore((state) => state.debugSeed);
  const setDebugSeed = useSlotStore((state) => state.setDebugSeed);

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <StyledDev>
      Seed
      <input
        inputMode="numeric"
        value={debugSeed ?? ""}
        onChange={(event) => {
          const raw = event.target.value.trim();
          if (raw === "") {
            setDebugSeed(null);
            return;
          }
          const next = Number(raw);
          if (Number.isFinite(next)) {
            setDebugSeed(Math.trunc(next));
          }
        }}
      />
    </StyledDev>
  );
};
