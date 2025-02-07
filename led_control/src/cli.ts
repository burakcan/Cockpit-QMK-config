#!/usr/bin/env node
import { Command } from 'commander';
import { KeyboardHID } from './hid/keyboard.js';

const program = new Command();

program
  .name('led-control')
  .description('Control keyboard LED settings')
  .option('-i, --interactive', 'Start interactive UI mode')
  .option('-s, --skadis <on|off>', 'Set Skadis mode')
  .option('-w, --white <on|off>', 'Set white mode')
  .option('-e, --effect <number>', 'Set RGB effect (0-10)')
  .option('-c, --color <h,s,v>', 'Set RGB color (0-255,0-255,0-255)')
  .option('-a, --animation-speed <number>', 'Set animation speed (0-255)')
  .parse();

const opts = program.opts();

try {
  const keyboard = new KeyboardHID();
  
  if (opts.interactive) {
    import('./ui.js').then(ui => ui.startUI());
  } else {
    if (opts.skadis) keyboard.setSkadisMode(opts.skadis === 'on');
    if (opts.white) keyboard.setWhiteMode(opts.white === 'on');
    if (opts.effect) keyboard.setRGBEffect(parseInt(opts.effect));
    if (opts.color) {
      const [h, s, v] = opts.color.split(',').map(Number);
      console.log(`Setting color to HSV(${h}, ${s}, ${v})`);
      keyboard.setRGBColor(h, s, v);
    }
    if (opts.animationSpeed) keyboard.setAnimationSpeed(parseInt(opts.animationSpeed));
    process.exit(0);
  }
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  console.error('Please ensure:');
  console.error('1. The keyboard is properly connected');
  console.error('2. You have the necessary permissions to access HID devices');
  console.error('3. The keyboard firmware supports Raw HID communication');
  process.exit(1);
} 