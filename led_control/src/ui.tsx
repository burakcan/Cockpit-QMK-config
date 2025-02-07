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
  const [activeControl, setActiveControl] = useState<
    "hue" | "saturation" | "brightness"
  >("hue");

  useInput((input, key) => {
    if (key.tab) {
      setActiveControl((current) => {
        if (current === "hue") return "saturation";
        if (current === "saturation") return "brightness";
        return "hue";
      });
    }

    // Handle quick color shortcuts
    switch (input.toLowerCase()) {
      case "r":
        onUpdate(0, 255, value);
        break;
      case "g":
        onUpdate(85, 255, value);
        break;
      case "b":
        onUpdate(170, 255, value);
        break;
      case "w":
        onUpdate(0, 0, value);
        break;
      case "y":
        onUpdate(43, 255, value);
        break;
      case "p":
        onUpdate(213, 255, value);
        break;
      case "c":
        onUpdate(128, 255, value);
        break;
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold>Color Controls (Tab to switch, Up/Down to adjust)</Text>
      <Box>
        <Box marginRight={2}>
          <Text>Hue {activeControl === "hue" ? "▶" : " "}</Text>
          <ValueSlider
            label="H"
            value={hue}
            onChange={(newH) => onUpdate(newH, saturation, value)}
            vertical={true}
            showPreview
            previewChar="■"
            active={activeControl === "hue"}
          />
        </Box>

        <Box marginRight={2}>
          <Text>Saturation {activeControl === "saturation" ? "▶" : " "}</Text>
          <ValueSlider
            label="S"
            value={saturation}
            onChange={(newS) => onUpdate(hue, newS, value)}
            vertical={true}
            showPreview
            active={activeControl === "saturation"}
          />
        </Box>

        <Box>
          <Text>Brightness {activeControl === "brightness" ? "▶" : " "}</Text>
          <ValueSlider
            label="V"
            value={value}
            onChange={(newV) => onUpdate(hue, saturation, newV)}
            vertical={true}
            showPreview
            active={activeControl === "brightness"}
          />
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text>
          Quick Colors: [R]ed [G]reen [B]lue [W]hite [Y]ellow [P]urple [C]yan
        </Text>
      </Box>
    </Box>
  );
};

// Update ValueSlider to use only vertical controls with up/down arrows
const ValueSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 255,
  vertical = true,
  showPreview = false,
  previewChar = "●",
  active = false,
  useLeftRight = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  vertical?: boolean;
  showPreview?: boolean;
  previewChar?: string;
  active?: boolean;
  useLeftRight?: boolean;
}) => {
  const width = 20;
  const boundedValue = Math.max(min, Math.min(max, value));
  const position = Math.floor((boundedValue / max) * width);
  const safePosition = Math.max(0, Math.min(width - 1, position));

  useInput((input, key) => {
    if (!active) return;

    const step = key.shift ? 16 : 1;

    if (useLeftRight) {
      if (key.leftArrow) {
        onChange(Math.max(min, value - step));
      } else if (key.rightArrow) {
        onChange(Math.min(max, value + step));
      }
    } else {
      if (key.upArrow) {
        onChange(Math.min(max, value + step));
      } else if (key.downArrow) {
        onChange(Math.max(min, value - step));
      }
    }
  });

  // Create horizontal or vertical slider based on useLeftRight
  const slider = useLeftRight
    ? "─".repeat(safePosition) + "●" + "─".repeat(width - safePosition - 1)
    : Array.from({ length: width })
        .fill("─")
        .map((char, i) => (i === safePosition ? "●" : char))
        .reverse()
        .join("\n");

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
  "2": "Breathing - Slow color fade in/out",
  "3": "Breathing - Medium color fade in/out",
  "4": "Breathing - Fast color fade in/out",
  "5": "Breathing - Very fast color fade in/out",
  "6": "Rainbow Wave - Slow horizontal wave",
  "7": "Rainbow Wave - Medium horizontal wave",
  "8": "Rainbow Wave - Fast horizontal wave",
  "9": "Rainbow Wave - Slow vertical wave",
  "10": "Rainbow Wave - Medium vertical wave",
  "11": "Rainbow Wave - Fast vertical wave",
  "12": "Rainbow Wave - Slow diagonal wave",
  "13": "Rainbow Wave - Medium diagonal wave",
  "14": "Rainbow Wave - Fast diagonal wave",
  "15": "Rainbow - Slow color cycle per key",
  "16": "Rainbow - Medium color cycle per key",
  "17": "Rainbow - Fast color cycle per key",
  "18": "Rainbow - Slow ripple effect",
  "19": "Rainbow - Medium ripple effect",
  "20": "Rainbow - Fast ripple effect",
  "21": "Spectrum - Slow color cycle all keys",
  "22": "Spectrum - Medium color cycle all keys",
  "23": "Spectrum - Fast color cycle all keys",
  "24": "Christmas - Red and green pattern",
  "25": "Static Gradient 1 - Purple to Blue",
  "26": "Static Gradient 2 - Red to Purple",
  "27": "Static Gradient 3 - Blue to Green",
  "28": "Static Gradient 4 - Full Rainbow",
  "29": "Static Gradient 5 - Red to Orange",
  "30": "Static Gradient 6 - Green to Cyan",
  "31": "Static Gradient 7 - Blue to Purple",
  "32": "Static Gradient 8 - Yellow to Red",
  "33": "Static Gradient 9 - Purple to Pink",
  "34": "Static Gradient 10 - Rainbow Reversed",
  "35": "RGB Test - Red, Green, Blue sequence",
  "36": "Wave - Alternating light pattern",
  "37": "Stars - Slow random twinkling",
  "38": "Stars - Medium random twinkling",
  "39": "Stars - Fast random twinkling",
  "40": "Stars - Very fast random twinkling",
  "41": "Stars - Rapid strobe effect",
  "42": "Stars - Random strobe pattern",
} as const;

const HelpScreen = () => (
  <Box flexDirection="column">
    <Text bold>Keyboard Controls</Text>
    <Text>Tab/Shift+Tab: Navigate items</Text>
    <Text>Enter: Select item</Text>
    <Text>Esc: Return to main menu</Text>
    <Text>Up/Down Arrow: Adjust color values</Text>
    <Text>Left/Right Arrow: Adjust animation speed</Text>
    <Text>Hold Shift: Adjust values faster</Text>
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
  const [selectedEffect, setSelectedEffect] = useState(0);
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
  const [previewEffect, setPreviewEffect] = useState<number | null>(null);
  const [previousEffect, setPreviousEffect] = useState<number | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const [state, ver] = await Promise.all([
          kb.getCurrentState(),
          kb.getVersion(),
        ]);

        setSelectedEffect(
          effects.findIndex((e) => parseInt(e.value) === state.mode)
        );
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
    try {
      const effectNumber = parseInt(item.value);
      await kb.setRGBEffect(effectNumber);
      setSelectedEffect(effects.findIndex((e) => e.value === item.value));
      setStatus(`Effect set to: ${item.label}`);
      setPreviousEffect(null); // Clear preview state
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
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

  // Add effect preview handling
  useEffect(() => {
    if (mode === "effects" && previewEffect !== null) {
      const applyPreview = async () => {
        try {
          if (previousEffect === null) {
            // Store current effect before preview
            const state = await kb.getCurrentState();
            setPreviousEffect(state.mode);
          }
          await kb.setRGBEffect(previewEffect);
        } catch (error) {
          console.error("Preview error:", error);
        }
      };
      applyPreview();
    }
  }, [previewEffect]);

  // Handle ESC in effects mode
  useInput((input, key) => {
    if (key.escape) {
      if (mode === "effects" && previousEffect !== null) {
        // Restore previous effect
        kb.setRGBEffect(previousEffect);
        setPreviewEffect(null);
        setPreviousEffect(null);
      }
      if (mode !== "main") {
        setMode("main");
      }
    }
  });

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
            <Text>Animation Speed - Left/Right arrows to adjust</Text>
            <ValueSlider
              label="Animation Speed"
              value={speed}
              onChange={async (newSpeed: number) => {
                try {
                  await kb.setAnimationSpeed(newSpeed);
                  setSpeed(newSpeed);
                  setStatus("Animation speed updated");
                } catch (error) {
                  setStatus(
                    `Error: ${
                      error instanceof Error ? error.message : "Unknown error"
                    }`
                  );
                }
              }}
              active={true}
              useLeftRight={true}
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
          <SelectInput
            items={effects}
            onSelect={handleEffectSelect}
            onHighlight={(item) => {
              const effectNumber = parseInt(item.value);
              setPreviewEffect(effectNumber);
            }}
          />
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
