const VOLUME = 1.5;

let context: AudioContext | null = null;

const audioContext = (): AudioContext | null => {
  if (typeof AudioContext === "undefined") {
    return null;
  }
  if (!context) {
    context = new AudioContext();
  }
  if (context.state === "suspended") {
    void context.resume();
  }
  return context;
};

const tone = (
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  delay = 0,
): void => {
  const audio = audioContext();
  if (!audio) {
    return;
  }
  const start = audio.currentTime + delay;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(volume * VOLUME, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
};

export const playSpinClick = (): void => {
  tone(540, 0.07, "square", 0.04);
};

export const playReelStop = (): void => {
  tone(170, 0.06, "triangle", 0.05);
};

export const playWin = (big: boolean): void => {
  if (big) {
    tone(440, 0.18, "sawtooth", 0.04);
    tone(660, 0.22, "sawtooth", 0.04, 0.12);
    tone(880, 0.28, "sawtooth", 0.04, 0.24);
    return;
  }

  tone(680, 0.14, "sine", 0.05);
};
