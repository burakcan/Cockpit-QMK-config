#!/usr/bin/env node
import { Command } from 'commander';
import { KeyboardHID } from './hid/keyboard.js';

const program = new Command();
const kb = new KeyboardHID();

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

if (opts.interactive) {
  import('./ui.js').then(ui => ui.startUI());
} else {
  if (opts.skadis) kb.setSkadisMode(opts.skadis === 'on');
  if (opts.white) kb.setWhiteMode(opts.white === 'on');
  if (opts.effect) kb.setRGBEffect(parseInt(opts.effect));
  if (opts.color) {
    const [h,s,v] = opts.color.split(',').map(Number);
    kb.setRGBColor(h,s,v);
  }
  if (opts.animationSpeed) kb.setAnimationSpeed(parseInt(opts.animationSpeed));
  process.exit(0);
} 