export type Category = 'motion' | 'looks' | 'control';

export type BlockType = 'move' | 'turn' | 'goto' | 'say' | 'think' | 'repeat';

export type Block = {
  id: string;
  type: BlockType;
  args: Record<string, string>;
  children?: Block[];
};

export type InputPart = { key: string; kind: 'number' | 'text' };

// a block label is a mix of plain words and input slots
export type LabelPart = string | InputPart;

export type BlockDef = {
  type: BlockType;
  category: Category;
  parts: LabelPart[];
  defaults: Record<string, string>;
  container?: boolean;
};
