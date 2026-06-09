import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
}

// Drop-in replacement for TouchableOpacity that scales down slightly on
// press instead of fading — used on cards and primary buttons app-wide.
export default function PressableScale({
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  scaleTo = 0.97,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) =>
    Animated.spring(scale, { toValue, friction: 6, tension: 180, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
