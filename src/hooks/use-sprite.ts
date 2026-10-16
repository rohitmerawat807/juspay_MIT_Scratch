import { SharedValue, useSharedValue } from 'react-native-reanimated';

export type Sprite = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  direction: SharedValue<number>;
};

// scratch defaults: centre of the stage, facing right
export function useSprite() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const direction = useSharedValue(90);

  const reset = () => {
    x.set(0);
    y.set(0);
    direction.set(90);
  };

  return { x, y, direction, reset };
}
