import { Block } from '@/blocks/types';
import { Sprite } from '@/hooks/use-sprites';
import { Bubble, runScript, Token } from './run-script';

// distance between two sprite centres (stage units) that counts as a hit
const HIT_DISTANCE = 40;

type Runner = { blocks: Block[]; token: Token; done: Promise<void> };

type Options = {
  setBubble: (spriteId: string, bubble: Bubble | null) => void;
  onSwap: (aId: string, bId: string) => void;
};

const touching = (a: Sprite, b: Sprite) =>
  Math.hypot(a.x.value - b.x.value, a.y.value - b.y.value) < HIT_DISTANCE;

// runs every sprite's script at the same time. when two sprites collide
// their scripts are swapped and both start again from the top.
export async function playAll(sprites: Sprite[], { setBubble, onSwap }: Options) {
  const runners = new Map<string, Runner>();

  const start = (sprite: Sprite, blocks: Block[]) => {
    const old = runners.get(sprite.id);
    if (old) old.token.cancelled = true;
    setBubble(sprite.id, null);

    const token = { cancelled: false };
    const done = runScript(blocks, {
      sprite,
      token,
      setBubble: (bubble) => setBubble(sprite.id, bubble),
    });
    runners.set(sprite.id, { blocks, token, done });
  };

  const pairs: [Sprite, Sprite][] = [];
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      pairs.push([sprites[i], sprites[j]]);
    }
  }

  // only swap when two sprites start touching, not on every tick while they overlap
  const hits = new Set<string>();
  const key = (a: Sprite, b: Sprite) => `${a.id}-${b.id}`;

  pairs.forEach(([a, b]) => {
    if (touching(a, b)) hits.add(key(a, b));
  });

  const checkCollisions = () => {
    for (const [a, b] of pairs) {
      if (!touching(a, b)) {
        hits.delete(key(a, b));
        continue;
      }
      if (hits.has(key(a, b))) continue;

      hits.add(key(a, b));
      const aBlocks = runners.get(a.id)!.blocks;
      const bBlocks = runners.get(b.id)!.blocks;
      start(a, bBlocks);
      start(b, aBlocks);
      onSwap(a.id, b.id);
    }
  };

  sprites.forEach((sprite) => start(sprite, sprite.blocks));
  const timer = setInterval(checkCollisions, 16);

  try {
    // a swap replaces runners, so wait again until nothing new was started
    let current: Runner[];
    do {
      current = [...runners.values()];
      await Promise.all(current.map((r) => r.done));
    } while ([...runners.values()].some((r, i) => r !== current[i]));
  } finally {
    clearInterval(timer);
  }
}
