import { Block } from './types';

// where a dropped block should go: into `parentId` (null = top level),
// before `beforeId`, or at the end when beforeId is missing
export type DropTarget = { parentId: string | null; beforeId?: string };

export function findBlock(blocks: Block[], id: string): Block | undefined {
  for (const block of blocks) {
    if (block.id === id) return block;
    const found = block.children && findBlock(block.children, id);
    if (found) return found;
  }
  return undefined;
}

export function updateBlock(blocks: Block[], id: string, fn: (block: Block) => Block): Block[] {
  return blocks.map((block) => {
    if (block.id === id) return fn(block);
    if (block.children) return { ...block, children: updateBlock(block.children, id, fn) };
    return block;
  });
}

export function removeBlock(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => (block.children ? { ...block, children: removeBlock(block.children, id) } : block));
}

export function insertBlock(blocks: Block[], block: Block, target: DropTarget): Block[] {
  const insertInto = (list: Block[]) => {
    const i = target.beforeId ? list.findIndex((b) => b.id === target.beforeId) : -1;
    return i === -1 ? [...list, block] : [...list.slice(0, i), block, ...list.slice(i)];
  };

  if (!target.parentId) return insertInto(blocks);

  return updateBlock(blocks, target.parentId, (parent) => ({
    ...parent,
    children: insertInto(parent.children ?? []),
  }));
}

export function moveBlock(blocks: Block[], block: Block, target: DropTarget): Block[] {
  if (target.beforeId === block.id) return blocks;

  // can't drop a repeat into itself
  const { parentId } = target;
  if (parentId && (parentId === block.id || findBlock(block.children ?? [], parentId))) {
    return blocks;
  }

  return insertBlock(removeBlock(blocks, block.id), block, target);
}
