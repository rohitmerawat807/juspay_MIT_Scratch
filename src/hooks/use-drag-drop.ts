import { createContext, useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { DropTarget } from '@/blocks/tree';
import { Block, BlockType } from '@/blocks/types';

// `block` is set when an existing block is moved inside the script
export type DragItem = { type: BlockType; block?: Block };

type Rect = { x: number; y: number; width: number; height: number };

const contains = (r: Rect, x: number, y: number) =>
  x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;

const measure = (view: View) =>
  new Promise<Rect>((resolve) => {
    view.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });

export function useDragDrop(onDrop: (item: DragItem, target: DropTarget | null) => void) {
  const [item, setItem] = useState<DragItem | null>(null);
  const itemRef = useRef<DragItem | null>(null);
  const targets = useRef(new Map<string, { view: View; target: DropTarget }>());

  // finger position and where the block was grabbed
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // ref callback for views that blocks can be dropped on
  const dropRef = (key: string, target: DropTarget) => (view: View | null) => {
    if (!view) return;
    targets.current.set(key, { view, target });
    return () => {
      targets.current.delete(key);
    };
  };

  const start = (dragItem: DragItem, e: { x: number; y: number; absoluteX: number; absoluteY: number }) => {
    itemRef.current = dragItem;
    setItem(dragItem);
    x.set(e.absoluteX);
    y.set(e.absoluteY);
    offsetX.set(e.x);
    offsetY.set(e.y);
  };

  const move = (absX: number, absY: number) => {
    x.set(absX);
    y.set(absY);
  };

  const end = async (absX: number, absY: number) => {
    const dragItem = itemRef.current;
    itemRef.current = null;
    setItem(null);
    if (!dragItem) return;

    // measure on drop, the script may have scrolled since the drag started
    const entries = [...targets.current.entries()];
    const rects = await Promise.all(entries.map(([, entry]) => measure(entry.view)));

    let inArea = false;
    let best: DropTarget | null = null;
    let bestSize = Infinity;

    entries.forEach(([key, entry], i) => {
      const r = rects[i];
      if (!contains(r, absX, absY)) return;
      if (key === 'area') inArea = true;

      // the smallest box under the finger is the most specific spot
      const size = r.width * r.height;
      if (size < bestSize) {
        best = entry.target;
        bestSize = size;
      }
    });

    onDrop(dragItem, inArea ? best : null);
  };

  return { item, x, y, offsetX, offsetY, dropRef, start, move, end };
}

export const DragContext = createContext<ReturnType<typeof useDragDrop> | null>(null);

export function useDrag() {
  const drag = useContext(DragContext);
  if (!drag) throw new Error('useDrag must be used inside DragContext');
  return drag;
}
