import React, { useState, useEffect } from "react";
import { render, Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import TextInput from "ink-text-input";
import { KeyboardHID, Version } from "./hid/keyboard.js";

// Add these to package.json dependencies:
// "ink-select-input": "^5.0.0",
// "ink-spinner": "^5.0.0",
// "ink-text-input": "^5.0.0"

interface MenuItem {
  label: string;
  value: string;
}

const effects = [
  { label: "Static Light", value: "1" },
  { label: "Breathing 1", value: "2" },
  { label: "Breathing 2", value: "3" },
  { label: "Breathing 3", value: "4" },
  { label: "Breathing 4", value: "5" },
  { label: "Rainbow Mood 1", value: "6" },
  { label: "Rainbow Mood 2", value: "7" },
  { label: "Rainbow Mood 3", value: "8" },
  { label: "Rainbow Swirl 1", value: "9" },
  { label: "Rainbow Swirl 2", value: "10" },
  { label: "Rainbow Swirl 3", value: "11" },
  { label: "Rainbow Swirl 4", value: "12" },
  { label: "Rainbow Swirl 5", value: "13" },
  { label: "Rainbow Swirl 6", value: "14" },
  { label: "Snake 1", value: "15" },
  { label: "Snake 2", value: "16" },
  { label: "Snake 3", value: "17" },
  { label: "Snake 4", value: "18" },
  { label: "Snake 5", value: "19" },
  { label: "Snake 6", value: "20" },
  { label: "Knight 1", value: "21" },
  { label: "Knight 2", value: "22" },
  { label: "Knight 3", value: "23" },
  { label: "Christmas", value: "24" },
  { label: "Static Gradient 1", value: "25" },
  { label: "Static Gradient 2", value: "26" },
  { label: "Static Gradient 3", value: "27" },
  { label: "Static Gradient 4", value: "28" },
  { label: "Static Gradient 5", value: "29" },
  { label: "Static Gradient 6", value: "30" },
  { label: "Static Gradient 7", value: "31" },
  { label: "Static Gradient 8", value: "32" },
  { label: "Static Gradient 9", value: "33" },
  { label: "Static Gradient 10", value: "34" },
  { label: "RGB Test", value: "35" },
  { label: "Alternating", value: "36" },
  { label: "Twinkle 1", value: "37" },
  { label: "Twinkle 2", value: "38" },
  { label: "Twinkle 3", value: "39" },
  { label: "Twinkle 4", value: "40" },
  { label: "Twinkle 5", value: "41" },
  { label: "Twinkle 6", value: "42" },
];

const presetColors = [
  { label: "Red", value: "0,255,255" },
  { label: "Green", value: "85,255,255" },
  { label: "Blue", value: "170,255,255" },
  { label: "Yellow", value: "43,255,255" },
  { label: "Purple", value: "213,255,255" },
  { label: "Cyan", value: "128,255,255" },
  { label: "White", value: "0,0,255" },
];

const ColorControl = ({
  hue,
  saturation,
  value,
  onUpdate,
}: {
  hue: number;
  saturation: number;
  value: number;
  onUpdate: (h: number, s: number, v: number) => void;
}) => {
  useInput((input, key) => {
    if (input.toLowerCase() === "b") {
      onUpdate(hue, saturation, Math.min(255, value + 16));
    }
    if (input.toLowerCase() === "d") {
      onUpdate(hue, saturation, Math.max(0, value - 16));
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold>Color Controls</Text>

      <Box marginY={1}>
        <Text>Hue (Color) - Left/Right arrows to adjust</Text>
        <ValueSlider
          label="Hue"
          value={hue}
          onChange={(newH) => onUpdate(newH, saturation, value)}
          showPreview
          previewChar="■"
        />
      </Box>

      <Box marginY={1}>
        <Text>Saturation (Intensity) - Up/Down arrows to adjust</Text>
        <ValueSlider
          label="Saturation"
          value={saturation}
          onChange={(newS) => onUpdate(hue, newS, value)}
          vertical
          showPreview
        />
      </Box>

      <Box marginY={1}>
        <Text>Brightness - B/D keys to adjust</Text>
        <ValueSlider
          label="Brightness"
          value={value}
          onChange={(newV) => onUpdate(hue, saturation, newV)}
          showPreview
        />
      </Box>

      <Box marginTop={1}>
        <Text>
          Quick Colors: [R]ed [G]reen [B]lue [W]hite [Y]ellow [P]urple [C]yan
        </Text>
      </Box>
    </Box>
  );
};

// Enhanced ValueSlider with preview
const ValueSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 255,
  vertical = false,
  showPreview = false,
  previewChar = "●",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  vertical?: boolean;
  showPreview?: boolean;
  previewChar?: string;
}) => {
  const width = 20;
  const boundedValue = Math.max(min, Math.min(max, value));
  const position = Math.floor((boundedValue / max) * width);
  const safePosition = Math.max(0, Math.min(width - 1, position));

  useInput((input, key) => {
    if (vertical) {
      if (key.upArrow) onChange(Math.min(max, value + 16));
      if (key.downArrow) onChange(Math.max(min, value - 16));
    } else {
      if (key.leftArrow) onChange(Math.max(min, value - 16));
      if (key.rightArrow) onChange(Math.min(max, value + 16));
    }
  });

  const slider = vertical
    ? Array.from({ length: width })
        .fill("─")
        .map((char, i) => (i === safePosition ? "●" : char))
        .reverse()
        .join("\n")
    : "─".repeat(safePosition) + "●" + "─".repeat(width - safePosition - 1);

  return (
    <Box flexDirection="column">
      <Text>
        {label}: {value} {showPreview && previewChar}
      </Text>
      <Text>{slider}</Text>
    </Box>
  );
};

const effectDescriptions: Record<string, string> = {
  "1": "Static single color - Basic solid color mode",
  "2": "Breathing 1 - Slow fade in/out",
  "3": "Breathing 2 - Medium fade in/out",
  "4": "Breathing 3 - Fast fade in/out",
  "5": "Breathing 4 - Rapid fade in/out",
  "6": "Rainbow Mood 1 - Slow color cycling",
  "7": "Rainbow Mood 2 - Medium color cycling",
  "8": "Rainbow Mood 3 - Fast color cycling",
  "9": "Rainbow Swirl 1 - Slow clockwise rotation",
  "10": "Rainbow Swirl 2 - Medium clockwise rotation",
  "11": "Rainbow Swirl 3 - Fast clockwise rotation",
  "12": "Rainbow Swirl 4 - Slow counter-clockwise",
  "13": "Rainbow Swirl 5 - Medium counter-clockwise",
  "14": "Rainbow Swirl 6 - Fast counter-clockwise",
  "15": "Snake 1 - Slow moving dot",
  "16": "Snake 2 - Medium moving dot",
  "17": "Snake 3 - Fast moving dot",
  "18": "Snake 4 - Slow moving line",
  "19": "Snake 5 - Medium moving line",
  "20": "Snake 6 - Fast moving line",
  "21": "Knight 1 - Slow back and forth",
  "22": "Knight 2 - Medium back and forth",
  "23": "Knight 3 - Fast back and forth",
  "24": "Christmas - Red and green alternating",
  "25": "Static Gradient 1 - Red to Blue",
  "26": "Static Gradient 2 - Red to Purple",
  "27": "Static Gradient 3 - Blue to Green",
  "28": "Static Gradient 4 - Rainbow",
  "29": "Static Gradient 5 - Red to Orange",
  "30": "Static Gradient 6 - Green to Cyan",
  "31": "Static Gradient 7 - Blue to Purple",
  "32": "Static Gradient 8 - Yellow to Red",
  "33": "Static Gradient 9 - Purple to Pink",
  "34": "Static Gradient 10 - Rainbow Reversed",
  "35": "RGB Test - Cycles through R,G,B",
  "36": "Alternating - On/Off pattern",
  "37": "Twinkle 1 - Slow random flashing",
  "38": "Twinkle 2 - Medium random flashing",
  "39": "Twinkle 3 - Fast random flashing",
  "40": "Twinkle 4 - Very fast random",
  "41": "Twinkle 5 - Strobe effect",
  "42": "Twinkle 6 - Random strobe",
} as const;

const HelpScreen = () => (
  <Box flexDirection="column">
    <Text bold>Keyboard Controls</Text>
    <Text>Tab/Shift+Tab: Navigate items</Text>
    <Text>Enter: Select item</Text>
    <Text>Esc: Return to main menu</Text>
    <Text>Left/Right Arrow: Adjust values</Text>
    <Text>H: Show/hide this help</Text>
    <Text>Q: Quit application</Text>
  </Box>
);

const ColorWheel = ({
  hue,
  saturation,
  value,
  onSelect,
}: {
  hue: number;
  saturation: number;
  value: number;
  onSelect: (h: number, s: number, v: number) => void;
}) => {
  const [selectedHue, setSelectedHue] = useState(hue);
  const [selectedSat, setSelectedSat] = useState(saturation);

  const wheelSize = 16;
  const wheel: string[] = [];

  // Generate color wheel
  for (let i = 0; i < wheelSize; i++) {
    const h = Math.floor((i / wheelSize) * 255);
    const isSelected = Math.abs(h - selectedHue) < 255 / wheelSize / 2;
    wheel.push(isSelected ? "●" : "○");
  }

  useInput((input, key) => {
    if (key.leftArrow) {
      const newHue = (selectedHue - 255 / wheelSize + 255) % 255;
      setSelectedHue(newHue);
      onSelect(newHue, selectedSat, value);
    }
    if (key.rightArrow) {
      const newHue = (selectedHue + 255 / wheelSize) % 255;
      setSelectedHue(newHue);
      onSelect(newHue, selectedSat, value);
    }
    if (key.upArrow) {
      const newSat = Math.min(255, selectedSat + 16);
      setSelectedSat(newSat);
      onSelect(selectedHue, newSat, value);
    }
    if (key.downArrow) {
      const newSat = Math.max(0, selectedSat - 16);
      setSelectedSat(newSat);
      onSelect(selectedHue, newSat, value);
    }
  });

  return (
    <Box flexDirection="column">
      <Text>Color Wheel (← → to change hue, ↑ ↓ to change saturation)</Text>
      <Text>[{wheel.join("")}]</Text>
      <Text>
        Current HSV: {selectedHue}, {selectedSat}, {value}
      </Text>
    </Box>
  );
};

const App = () => {
  const [kb] = useState(() => new KeyboardHID());
  const [selectedEffect, setEffect] = useState(0);
  const [h, setH] = useState(0);
  const [s, setS] = useState(255);
  const [v, setV] = useState(255);
  const [speed, setSpeed] = useState(128);
  const [mode, setMode] = useState<"main" | "effects" | "colors" | "custom">(
    "main"
  );
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [skadisEnabled, setSkadisEnabled] = useState(false);
  const [whiteEnabled, setWhiteEnabled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [version, setVersion] = useState<Version | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const [state, ver] = await Promise.all([
          kb.getCurrentState(),
          kb.getVersion(),
        ]);

        setEffect(effects.findIndex((e) => parseInt(e.value) === state.mode));
        setH(state.hue);
        setS(state.saturation);
        setV(state.value);
        setSpeed(state.speed);
        setSkadisEnabled(state.skadisMode);
        setWhiteEnabled(state.whiteMode);
        setVersion(ver);

        setStatus("Connected and initialized");
      } catch (error) {
        setStatus(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleEffectSelect = async (item: MenuItem) => {
    setLoading(true);
    try {
      await kb.setRGBEffect(parseInt(item.value));
      setEffect(parseInt(item.value));
      setStatus("Effect applied successfully");
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
    setLoading(false);
    setMode("main");
  };

  const handleColorSelect = async (item: MenuItem) => {
    setLoading(true);
    try {
      const [newH, newS, newV] = item.value.split(",").map(Number);
      await kb.setRGBColor(newH, newS, newV);
      setH(newH);
      setS(newS);
      setV(newV);
      setStatus("Color applied successfully");
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
    setLoading(false);
    setMode("main");
  };

  const mainMenu = [
    { label: "Select Effect", value: "effects" },
    { label: "Color Control", value: "custom" },
    { label: "Quick Colors", value: "colors" },
    { label: `Skadis Mode (${skadisEnabled ? "On" : "Off"})`, value: "skadis" },
    { label: `White Mode (${whiteEnabled ? "On" : "Off"})`, value: "white" },
    { label: "Quit", value: "quit" },
  ];

  const handleMainSelect = async (item: MenuItem) => {
    switch (item.value) {
      case "effects":
        setMode("effects");
        break;
      case "colors":
        setMode("colors");
        break;
      case "custom":
        setMode("custom");
        break;
      case "skadis":
        try {
          const newState = !skadisEnabled;
          await kb.setSkadisMode(newState);
          setSkadisEnabled(newState);
          setStatus(`Skadis mode ${newState ? "enabled" : "disabled"}`);
        } catch (error) {
          setStatus(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
        break;
      case "white":
        try {
          const newState = !whiteEnabled;
          await kb.setWhiteMode(newState);
          setWhiteEnabled(newState);
          setStatus(`White mode ${newState ? "enabled" : "disabled"}`);
        } catch (error) {
          setStatus(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
        break;
      case "quit":
        process.exit(0);
    }
  };

  useInput((input, key) => {
    if (input.toLowerCase() === "h") {
      setShowHelp(!showHelp);
    }
    if (key.escape) {
      if (showHelp) {
        setShowHelp(false);
      } else if (mode !== "main") {
        setMode("main");
      }
    }
    if (mode === "custom") {
      switch (input.toLowerCase()) {
        case "r":
          handleColorUpdate(0, 255, 255);
          break;
        case "g":
          handleColorUpdate(85, 255, 255);
          break;
        case "b":
          handleColorUpdate(170, 255, 255);
          break;
        case "w":
          handleColorUpdate(0, 0, 255);
          break;
        case "y":
          handleColorUpdate(43, 255, 255);
          break;
        case "p":
          handleColorUpdate(213, 255, 255);
          break;
        case "c":
          handleColorUpdate(128, 255, 255);
          break;
      }
    }
  });

  const handleColorUpdate = async (
    newH: number,
    newS: number,
    newV: number
  ) => {
    try {
      await kb.setRGBColor(newH, newS, newV);
      setH(newH);
      setS(newS);
      setV(newV);
      setStatus("Color updated");
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  // Fix the effect description lookup
  const currentEffectDescription =
    selectedEffect >= 0 && effects[selectedEffect]
      ? effectDescriptions[effects[selectedEffect].value] || ""
      : "";

  // Add safe getter for current effect
  const getCurrentEffect = () => {
    if (selectedEffect >= 0 && selectedEffect < effects.length) {
      return effects[selectedEffect];
    }
    return null;
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold>Keyboard LED Control</Text>
        {version && (
          <Text>
            {" "}
            v{version.major}.{version.minor}.{version.patch}
          </Text>
        )}
      </Box>

      {loading && (
        <Box>
          <Text>
            <Spinner type="dots" /> Loading...
          </Text>
        </Box>
      )}

      {status && (
        <Box marginBottom={1}>
          <Text color={status.includes("Error") ? "red" : "green"}>
            {status}
          </Text>
        </Box>
      )}

      {mode === "main" && (
        <>
          <Box marginBottom={1}>
            <SelectInput items={mainMenu} onSelect={handleMainSelect} />
          </Box>

          <Box flexDirection="column" marginBottom={1}>
            <ValueSlider
              label="Animation Speed"
              value={speed}
              onChange={(newSpeed: number) => {
                setSpeed(newSpeed);
                kb.setAnimationSpeed(newSpeed);
              }}
            />
          </Box>

          <Box>
            <Text>
              Current Effect:{" "}
              {getCurrentEffect() ? getCurrentEffect()!.label : "None"}
            </Text>
          </Box>
          <Box>
            <Text>
              HSV: {h}, {s}, {v}
            </Text>
          </Box>
        </>
      )}

      {mode === "effects" && (
        <Box flexDirection="column">
          <SelectInput items={effects} onSelect={handleEffectSelect} />
          {currentEffectDescription && (
            <Box marginTop={1}>
              <Text>{currentEffectDescription}</Text>
            </Box>
          )}
        </Box>
      )}

      {mode === "colors" && (
        <SelectInput items={presetColors} onSelect={handleColorSelect} />
      )}

      {mode === "custom" && (
        <ColorControl
          hue={h}
          saturation={s}
          value={v}
          onUpdate={handleColorUpdate}
        />
      )}

      {showHelp && <HelpScreen />}

      <Box marginTop={1}>
        <Text dimColor>Press Tab/Shift+Tab to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};

export const startUI = () => {
  render(<App />);
};
