import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Block } from '@/blocks/types';
import BlockView from './block-view';

type Props = {
  blocks: Block[];
  onRemove: (id: string) => void;
  onChangeArg: (id: string, key: string, value: string) => void;
};

export default function ScriptArea({ blocks, onRemove, onChangeArg }: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      {blocks.length === 0 && <Text style={styles.hint}>Tap a block to add it</Text>}

      {blocks.map((block) => (
        <View key={block.id} style={styles.row}>
          <BlockView
            type={block.type}
            args={block.args}
            onChange={(key, value) => onChangeArg(block.id, key, value)}
          />
          <Pressable onPress={() => onRemove(block.id)}>
            <Text style={styles.remove}>✕</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
    padding: 8,
  },
  hint: {
    color: '#888',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  remove: {
    color: '#888',
  },
});
