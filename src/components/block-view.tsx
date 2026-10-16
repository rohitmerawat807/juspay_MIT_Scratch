import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { BLOCKS, CATEGORIES } from '@/blocks/catalog';
import { BlockType } from '@/blocks/types';

// the plain ios number pad has no minus key
const numberKeyboard = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';

type Props = {
  type: BlockType;
  args: Record<string, string>;
  onChange?: (key: string, value: string) => void;
};

export default function BlockView({ type, args, onChange }: Props) {
  const def = BLOCKS[type];

  return (
    <View style={[styles.block, { backgroundColor: CATEGORIES[def.category].color }]}>
      {def.parts.map((part, i) => {
        if (typeof part === 'string') {
          return (
            <Text key={i} style={styles.label}>
              {part}
            </Text>
          );
        }

        if (!onChange) {
          return (
            <Text key={i} style={styles.input}>
              {args[part.key]}
            </Text>
          );
        }

        return (
          <TextInput
            key={i}
            style={styles.input}
            value={args[part.key]}
            onChangeText={(text) => onChange(part.key, text)}
            keyboardType={part.kind === 'number' ? numberKeyboard : 'default'}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    borderRadius: 4,
  },
  label: {
    color: '#fff',
  },
  input: {
    minWidth: 30,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
});
