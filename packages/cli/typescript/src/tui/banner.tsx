import { Box, Text } from "ink";

// Use a darker shade on light-background terminals so the banner remains legible.
// COLORFGBG is widely supported (iTerm2, Konsole, xterm, Windows Terminal).
// Format is "fg;bg" where bg=15 means white/light background.
function brandColor(): string {
  const colorfgbg = process.env.COLORFGBG ?? "";
  const bg = parseInt(colorfgbg.split(";").pop() ?? "", 10);
  const isLightBg = !isNaN(bg) && bg >= 8;
  return isLightBg ? "#0066CC" : "#00BFFF";
}

const BRAND = brandColor();

const ASCII_ART = [
  "  ____                                  ____  _             _    ",
  " | __ ) _ __ _____      _____  ___ _ __/ ___|| |_ __ _  ___| | __",
  " |  _ \\| '__/ _ \\ \\ /\\ / / __|/ _ \\ '__\\___ \\| __/ _` |/ __| |/ /",
  " | |_) | | | (_) \\ V  V /\\__ \\  __/ |   ___) | || (_| | (__|   < ",
  " |____/|_|  \\___/ \\_/\\_/ |___/\\___|_|  |____/ \\__\\__,_|\\___|_|\\_\\",
];

export function Banner() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {ASCII_ART.map((line, i) => (
        <Text key={i} color={BRAND}>{line}</Text>
      ))}
    </Box>
  );
}
