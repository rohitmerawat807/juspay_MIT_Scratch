import { Block, BlockDef, BlockType, Category } from './types';

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  motion: { label: 'Motion', color: '#4c97ff' },
  looks: { label: 'Looks', color: '#9966ff' },
  control: { label: 'Control', color: '#ffab19' },
};

export const BLOCKS: Record<BlockType, BlockDef> = {
  move: {
    type: 'move',
    category: 'motion',
    parts: ['move', { key: 'steps', kind: 'number' }, 'steps'],
    defaults: { steps: '10' },
  },
  turn: {
    type: 'turn',
    category: 'motion',
    parts: ['turn', { key: 'degrees', kind: 'number' }, 'degrees'],
    defaults: { degrees: '15' },
  },
  goto: {
    type: 'goto',
    category: 'motion',
    parts: ['go to x:', { key: 'x', kind: 'number' }, 'y:', { key: 'y', kind: 'number' }],
    defaults: { x: '0', y: '0' },
  },
  say: {
    type: 'say',
    category: 'looks',
    parts: ['say', { key: 'message', kind: 'text' }, 'for', { key: 'secs', kind: 'number' }, 'seconds'],
    defaults: { message: 'Hello!', secs: '2' },
  },
  think: {
    type: 'think',
    category: 'looks',
    parts: ['think', { key: 'message', kind: 'text' }, 'for', { key: 'secs', kind: 'number' }, 'seconds'],
    defaults: { message: 'Hmm...', secs: '2' },
  },
  repeat: {
    type: 'repeat',
    category: 'control',
    parts: ['repeat', { key: 'times', kind: 'number' }],
    defaults: { times: '10' },
    container: true,
  },
};

export const blocksIn = (category: Category) =>
  Object.values(BLOCKS).filter((def) => def.category === category);

let counter = 0;

export function createBlock(type: BlockType): Block {
  const def = BLOCKS[type];
  return {
    id: `b${++counter}`,
    type,
    args: { ...def.defaults },
    children: def.container ? [] : undefined,
  };
}
