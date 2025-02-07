import React, { useState } from "react";
import { render, Box, Text } from "ink";
import { KeyboardHID } from "./hid/keyboard.js";

const effects = [
  "Static",
  "Breathing",
  "Rainbow Mood",
  "Rainbow Swirl",
  "Snake",
  "Knight",
  "Christmas",
  "Static Gradient",
  "RGB Test",
  "Alternating",
  "Twinkle",
];

const App = () => {
  const [kb] = useState(() => new KeyboardHID());
  const [selectedEffect, setEffect] = useState(0);
  const [h, setH] = useState(0);
  const [s, setS] = useState(255);
  const [v, setV] = useState(255);
  const [speed, setSpeed] = useState(128);

  const handleInput = (input: string) => {
    switch (input.toLowerCase()) {
      case "q":
        process.exit(0);
      case "s":
        kb.setSkadisMode(true);
        break;
      case "w":
        kb.setWhiteMode(true);
        break;
      case "e":
        setEffect((e) => (e + 1) % effects.length);
        kb.setRGBEffect(selectedEffect);
        break;
      case "h":
        setH((h) => (h + 16) % 256);
        kb.setRGBColor(h, s, v);
        break;
      case "v":
        setV((v) => (v + 16) % 256);
        kb.setRGBColor(h, s, v);
        break;
      case "a":
        setSpeed((s) => (s + 16) % 256);
        kb.setAnimationSpeed(speed);
        break;
    }
  };

  React.useEffect(() => {
    process.stdin.on("data", (data) => handleInput(data.toString()));
    return () => {
      process.stdin.removeAllListeners("data");
    };
  }, []);

  return (
    <Box flexDirection="column">
      <Text>Keyboard LED Control</Text>
      <Text>Effect: {effects[selectedEffect]}</Text>
      <Text>
        HSV: {h},{s},{v}
      </Text>
      <Text>Speed: {speed}</Text>
      <Box marginTop={1}>
        <Text>
          Commands: [Q]uit [S]kadis [W]hite [E]ffect [H]ue [V]alue [A]nimation
        </Text>
      </Box>
    </Box>
  );
};

export const startUI = () => {
  render(<App />);
};
