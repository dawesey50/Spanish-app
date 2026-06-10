import React, { useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType, ImageStyle } from 'react-native';

interface Props {
  source: ImageSourcePropType;
  style?: ImageStyle | ImageStyle[];
  /** Peak scale of the pulse (default 1.1) */
  to?: number;
}

/** Image with a gentle perpetual scale pulse — used for the streak flame. */
export default function PulseImage({ source, style, to = 1.1 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: to, duration: 600, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Image
      source={source}
      style={[style, { transform: [{ scale }] }]}
      resizeMode="contain"
    />
  );
}
