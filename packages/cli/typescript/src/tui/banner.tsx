import { Box, Text } from "ink";

const BRAND = "#E84D38";

const ASCII_ART = [
  " ___                              ___ _           _    ",
  "| _ )_ _ _____ __ _____ _ _ ___ / __| |_ __ _ __| |__",
  "| _ \\ '_/ _ \\ V  V (_-< '_(_-<  \\__ \\  _/ _` / _| / /",
  "|___/_| \\___/\\_/\\_//__/_| /__/  |___/\\__\\__,_\\__|_\\_\\",
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
