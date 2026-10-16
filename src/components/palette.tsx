import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { blocksIn, CATEGORIES } from '@/blocks/catalog';
import { BlockType, Category } from '@/blocks/types';
import BlockView from './block-view';

const categories = Object.keys(CATEGORIES) as Category[];

export default function Palette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [category, setCategory] = useState<Category>('motion');

  return (
    <View style={styles.palette}>
      <View style={styles.tabs}>
        {categories.map((key) => (
          <Pressable key={key} onPress={() => setCategory(key)}>
            <Text style={[styles.tab, key === category && styles.activeTab]}>
              {CATEGORIES[key].label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.blocks}>
        {blocksIn(category).map((def) => (
          <Pressable key={def.type} onPress={() => onAdd(def.type)}>
            <BlockView type={def.type} args={def.defaults} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  palette: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  tab: {
    color: '#888',
  },
  activeTab: {
    color: '#000',
    fontWeight: '600',
  },
  blocks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
