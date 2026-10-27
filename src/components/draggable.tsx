import { ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { DragItem, useDrag } from '@/hooks/use-drag-drop';

type Props = {
  item: DragItem;
  // blocks in the script need a long press so the list can still scroll
  longPress?: boolean;
  children: ReactNode;
};

export default function Draggable({ item, longPress, children }: Props) {
  const drag = useDrag();

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) => drag.start(item, e))
    .onUpdate((e) => drag.move(e.absoluteX, e.absoluteY))
    .onEnd((e) => drag.end(e.absoluteX, e.absoluteY));

  if (longPress) pan.activateAfterLongPress(250);

  return (
    <GestureDetector gesture={pan}>
      <View>{children}</View>
    </GestureDetector>
  );
}
