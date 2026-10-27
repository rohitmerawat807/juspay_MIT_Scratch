import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BLOCKS, createBlock } from '@/blocks/catalog';
import { DropTarget, insertBlock, moveBlock, removeBlock, updateBlock } from '@/blocks/tree';
import BlockView from '@/components/block-view';
import Palette from '@/components/palette';
import ScriptArea from '@/components/script-area';
import SpriteList from '@/components/sprite-list';
import Stage from '@/components/stage';
import { playAll } from '@/engine/play';
import { Bubble } from '@/engine/run-script';
import { DragContext, DragItem, useDragDrop } from '@/hooks/use-drag-drop';
import { useSprites } from '@/hooks/use-sprites';

export default function EditorScreen() {
  const sprites = useSprites();
  const [bubbles, setBubbles] = useState<Record<string, Bubble | null>>({});
  const [running, setRunning] = useState(false);

  const onDrop = (item: DragItem, target: DropTarget | null) => {
    const { block } = item;

    if (block) {
      // dragging a script block out of the script area deletes it
      sprites.updateBlocks((blocks) =>
        target ? moveBlock(blocks, block, target) : removeBlock(blocks, block.id),
      );
    } else if (target) {
      sprites.updateBlocks((blocks) => insertBlock(blocks, createBlock(item.type), target));
    }
  };

  const drag = useDragDrop(onDrop);

  const ghostStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drag.x.value - drag.offsetX.value },
      { translateY: drag.y.value - drag.offsetY.value },
    ],
  }));

  const setArg = (id: string, key: string, value: string) => {
    sprites.updateBlocks((blocks) =>
      updateBlock(blocks, id, (block) => ({ ...block, args: { ...block.args, [key]: value } })),
    );
  };

  const play = async () => {
    setRunning(true);
    try {
      await playAll(sprites.sprites, {
        setBubble: (id, bubble) =>
          setBubbles((prev) => ((prev[id] ?? null) === bubble ? prev : { ...prev, [id]: bubble })),
        onSwap: sprites.swapScripts,
      });
    } finally {
      setBubbles({});
      setRunning(false);
    }
  };

  const disabled = running || sprites.sprites.every((s) => s.blocks.length === 0);

  return (
    <DragContext value={drag}>
      <View style={styles.root}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Scratch</Text>
            <View style={styles.buttons}>
              <Pressable
                onPress={sprites.reset}
                disabled={running}
                style={[styles.button, styles.resetButton, running && styles.disabled]}>
                <Text style={styles.buttonText}>Reset</Text>
              </Pressable>
              <Pressable
                onPress={play}
                disabled={disabled}
                style={[styles.button, styles.playButton, disabled && styles.disabled]}>
                <Text style={styles.buttonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          <Stage sprites={sprites.sprites} bubbles={bubbles} />
          <SpriteList
            sprites={sprites.sprites}
            selectedId={sprites.selected.id}
            onSelect={sprites.select}
            onAdd={sprites.addSprite}
            onRemove={sprites.removeSprite}
            canRemove={!running && sprites.sprites.length > 1}
          />
          <Palette />
          <ScriptArea blocks={sprites.selected.blocks} onChangeArg={setArg} />
        </SafeAreaView>

        {drag.item && (
          <Animated.View pointerEvents="none" style={[styles.ghost, ghostStyle]}>
            <BlockView
              type={drag.item.type}
              args={drag.item.block?.args ?? BLOCKS[drag.item.type].defaults}
            />
          </Animated.View>
        )}
      </View>
    </DragContext>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  resetButton: {
    backgroundColor: '#888',
  },
  playButton: {
    backgroundColor: '#4cbf56',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  ghost: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.8,
  },
});
