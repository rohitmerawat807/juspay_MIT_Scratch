import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Palette from '@/components/palette';
import ScriptArea from '@/components/script-area';
import Stage from '@/components/stage';
import { Bubble, runScript } from '@/engine/run-script';
import { useScript } from '@/hooks/use-script';
import { useSprite } from '@/hooks/use-sprite';

export default function EditorScreen() {
  const sprite = useSprite();
  const script = useScript();
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [running, setRunning] = useState(false);

  const play = async () => {
    setRunning(true);
    try {
      await runScript(script.blocks, { sprite, setBubble });
    } finally {
      setBubble(null);
      setRunning(false);
    }
  };

  const disabled = running || script.blocks.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scratch</Text>
        <View style={styles.buttons}>
          <Pressable
            onPress={sprite.reset}
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

      <Stage sprite={sprite} bubble={bubble} />
      <Palette onAdd={script.add} />
      <ScriptArea blocks={script.blocks} onRemove={script.remove} onChangeArg={script.setArg} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
