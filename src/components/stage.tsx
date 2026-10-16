import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import type { Bubble } from '@/engine/run-script';
import { Sprite } from '@/hooks/use-sprite';

// stage size in scratch units, (0, 0) is the centre and y points up
export const STAGE_WIDTH = 480;
export const STAGE_HEIGHT = 360;

type Props = {
  sprite: Sprite;
  bubble: Bubble | null;
};

export default function Stage({ sprite, bubble }: Props) {
  const width = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    width.set(e.nativeEvent.layout.width);
  };

  const position = useAnimatedStyle(() => {
    const scale = width.value / STAGE_WIDTH;
    return {
      transform: [{ translateX: sprite.x.value * scale }, { translateY: -sprite.y.value * scale }],
    };
  });

  const rotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sprite.direction.value - 90}deg` }],
  }));

  return (
    <View style={styles.stage} onLayout={onLayout}>
      <Animated.View style={[styles.sprite, position]}>
        {bubble && (
          <View style={styles.bubble}>
            <Text>{bubble.kind === 'think' ? `(${bubble.text})` : bubble.text}</Text>
          </View>
        )}
        <Animated.Text style={[styles.costume, rotation]}>🐱</Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    aspectRatio: STAGE_WIDTH / STAGE_HEIGHT,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  sprite: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costume: {
    fontSize: 32,
  },
  bubble: {
    position: 'absolute',
    bottom: 36,
    left: 24,
    width: 120,
    padding: 6,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
