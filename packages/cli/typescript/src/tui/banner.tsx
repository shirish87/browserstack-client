import { Box, Text } from "ink";

const BRAND = "#00BFFF";

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
