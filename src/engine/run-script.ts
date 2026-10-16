import { Easing, SharedValue, withTiming } from 'react-native-reanimated';

import { Block } from '@/blocks/types';
import { STAGE_HEIGHT, STAGE_WIDTH } from '@/components/stage';
import { Sprite } from '@/hooks/use-sprite';

export type Bubble = { kind: 'say' | 'think'; text: string };

type Context = {
  sprite: Sprite;
  setBubble: (bubble: Bubble | null) => void;
};

const STEP_MS = 300;

// keep the sprite from walking off the stage
const MAX_X = STAGE_WIDTH / 2 - 30;
const MAX_Y = STAGE_HEIGHT / 2 - 30;

const clamp = (value: number, max: number) => Math.min(max, Math.max(-max, value));

const toNumber = (value: string) => Number(value) || 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function animate(value: SharedValue<number>, to: number) {
  value.value = withTiming(to, { duration: STEP_MS, easing: Easing.linear });
  return wait(STEP_MS);
}

async function runBlock(block: Block, ctx: Context) {
  const { sprite, setBubble } = ctx;
  const { args } = block;

  switch (block.type) {
    case 'move': {
      // direction 90 is right, 0 is up
      const steps = toNumber(args.steps);
      const rad = (sprite.direction.value * Math.PI) / 180;
      await Promise.all([
        animate(sprite.x, clamp(sprite.x.value + steps * Math.sin(rad), MAX_X)),
        animate(sprite.y, clamp(sprite.y.value + steps * Math.cos(rad), MAX_Y)),
      ]);
      break;
    }

    case 'turn':
      await animate(sprite.direction, sprite.direction.value + toNumber(args.degrees));
      break;

    case 'goto':
      await Promise.all([
        animate(sprite.x, clamp(toNumber(args.x), MAX_X)),
        animate(sprite.y, clamp(toNumber(args.y), MAX_Y)),
      ]);
      break;

    case 'say':
    case 'think':
      setBubble({ kind: block.type, text: args.message });
      await wait(toNumber(args.secs) * 1000);
      setBubble(null);
      break;
  }
}

export async function runScript(blocks: Block[], ctx: Context) {
  for (const block of blocks) {
    await runBlock(block, ctx);
  }
}
