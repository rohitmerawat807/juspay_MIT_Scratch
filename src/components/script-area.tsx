import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { CATEGORIES } from '@/blocks/catalog';
import { Block } from '@/blocks/types';
import { useDrag } from '@/hooks/use-drag-drop';
import BlockView from './block-view';
import Draggable from './draggable';

type Props = {
  blocks: Block[];
  onChangeArg: (id: string, key: string, value: string) => void;
};

export default function ScriptArea({ blocks, onChangeArg }: Props) {
  const drag = useDrag();

  return (
    <View style={styles.area} ref={drag.dropRef('area', { parentId: null })}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        {blocks.length === 0 && (
          <Text style={styles.hint}>
            Drag blocks here. Long press a block to move it, drag it out to delete.
          </Text>
        )}
        <BlockList blocks={blocks} parentId={null} onChangeArg={onChangeArg} />
      </ScrollView>
    </View>
  );
}

type ListProps = Props & { parentId: string | null };

function BlockList({ blocks, parentId, onChangeArg }: ListProps) {
  const drag = useDrag();

  return (
    <View style={styles.list}>
      {blocks.map((block) => (
        <View key={block.id}>
          <Draggable item={{ type: block.type, block }} longPress>
            <View ref={drag.dropRef(`row:${block.id}`, { parentId, beforeId: block.id })}>
              <BlockView
                type={block.type}
                args={block.args}
                onChange={(key, value) => onChangeArg(block.id, key, value)}
              />
            </View>
          </Draggable>

          {block.children && (
            <View style={styles.slot} ref={drag.dropRef(`slot:${block.id}`, { parentId: block.id })}>
              <BlockList blocks={block.children} parentId={block.id} onChangeArg={onChangeArg} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  hint: {
    color: '#888',
  },
  list: {
    alignItems: 'flex-start',
    gap: 4,
  },
  // the inside of a repeat block
  slot: {
    minWidth: 120,
    minHeight: 30,
    paddingLeft: 6,
    paddingVertical: 4,
    borderLeftWidth: 10,
    borderBottomWidth: 10,
    borderColor: CATEGORIES.control.color,
  },
});
