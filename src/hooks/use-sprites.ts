import { useState } from 'react';
import { makeMutable, SharedValue } from 'react-native-reanimated';

import { Block } from '@/blocks/types';

export type Sprite = {
  id: string;
  name: string;
  costume: string;
  start: { x: number; y: number };
  x: SharedValue<number>;
  y: SharedValue<number>;
  direction: SharedValue<number>;
  blocks: Block[];
};

const COSTUMES = ['🐱', '🐶', '🐭', '🐰', '🦊', '🐸'];
const SPAWN = [
  [-100, 0],
  [100, 0],
  [0, 100],
  [0, -100],
];

let nextId = 0;

function createSprite(index: number): Sprite {
  const [x, y] = SPAWN[index % SPAWN.length];
  return {
    id: `s${++nextId}`,
    name: `Sprite${index + 1}`,
    costume: COSTUMES[index % COSTUMES.length],
    start: { x, y },
    x: makeMutable(x),
    y: makeMutable(y),
    direction: makeMutable(90),
    blocks: [],
  };
}

export function useSprites() {
  const [sprites, setSprites] = useState<Sprite[]>(() => [createSprite(0)]);
  const [selectedId, setSelectedId] = useState(sprites[0].id);

  const selected = sprites.find((s) => s.id === selectedId) ?? sprites[0];

  const addSprite = () => {
    // reuse the lowest free number so names don't repeat after a delete
    let n = 0;
    while (sprites.some((s) => s.name === `Sprite${n + 1}`)) n++;

    const sprite = createSprite(n);
    setSprites((prev) => [...prev, sprite]);
    setSelectedId(sprite.id);
  };

  const removeSprite = () => {
    if (sprites.length === 1) return;
    const rest = sprites.filter((s) => s.id !== selected.id);
    setSprites(rest);
    setSelectedId(rest[0].id);
  };

  // update the script of the selected sprite
  const updateBlocks = (fn: (blocks: Block[]) => Block[]) => {
    setSprites((prev) =>
      prev.map((s) => (s.id === selected.id ? { ...s, blocks: fn(s.blocks) } : s)),
    );
  };

  const swapScripts = (aId: string, bId: string) => {
    setSprites((prev) => {
      const a = prev.find((s) => s.id === aId);
      const b = prev.find((s) => s.id === bId);
      if (!a || !b) return prev;
      return prev.map((s) => {
        if (s.id === aId) return { ...s, blocks: b.blocks };
        if (s.id === bId) return { ...s, blocks: a.blocks };
        return s;
      });
    });
  };

  const reset = () => {
    sprites.forEach((s) => {
      s.x.set(s.start.x);
      s.y.set(s.start.y);
      s.direction.set(90);
    });
  };

  return {
    sprites,
    selected,
    select: setSelectedId,
    addSprite,
    removeSprite,
    updateBlocks,
    swapScripts,
    reset,
  };
}
