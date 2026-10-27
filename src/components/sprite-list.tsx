import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Sprite } from '@/hooks/use-sprites';

type Props = {
  sprites: Sprite[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function SpriteList({ sprites, selectedId, onSelect, onAdd, onRemove, canRemove }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bar}
      contentContainerStyle={styles.content}>
      {sprites.map((sprite) => (
        <Pressable
          key={sprite.id}
          onPress={() => onSelect(sprite.id)}
          style={[styles.item, sprite.id === selectedId && styles.selected]}>
          <Text>
            {sprite.costume} {sprite.name}
          </Text>
        </Pressable>
      ))}
      <Pressable onPress={onAdd} style={styles.item}>
        <Text>+ Sprite</Text>
      </Pressable>
      <Pressable
        onPress={onRemove}
        disabled={!canRemove}
        style={[styles.item, styles.remove, !canRemove && styles.disabled]}>
        <Text style={styles.removeText}>Delete</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    gap: 6,
    padding: 8,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  selected: {
    borderColor: '#4c97ff',
    backgroundColor: '#eef4ff',
  },
  remove: {
    borderColor: '#e55',
  },
  removeText: {
    color: '#e55',
  },
  disabled: {
    opacity: 0.4,
  },
});
