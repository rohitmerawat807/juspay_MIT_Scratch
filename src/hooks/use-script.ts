import { useState } from 'react';

import { createBlock } from '@/blocks/catalog';
import { Block, BlockType } from '@/blocks/types';

export function useScript() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const add = (type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
  };

  const remove = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const setArg = (id: string, key: string, value: string) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== id) return block;
        return { ...block, args: { ...block.args, [key]: value } };
      }),
    );
  };

  return { blocks, add, remove, setArg };
}
