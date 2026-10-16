export type Category = 'motion' | 'looks';

export type BlockType = 'move' | 'turn' | 'goto' | 'say' | 'think';

export type Block = {
  id: string;
  type: BlockType;
  args: Record<string, string>;
};

export type InputPart = { key: string; kind: 'number' | 'text' };

// a block label is a mix of plain words and input slots
export type LabelPart = string | InputPart;

export type BlockDef = {
  type: BlockType;
  category: Category;
  parts: LabelPart[];
  defaults: Record<string, string>;
};
