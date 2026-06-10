import React, { useEffect, useRef, useState } from 'react';
import { Animated, TextStyle } from 'react-native';

interface Props {
  value: number;
  duration?: number;
  style?: TextStyle | TextStyle[];
  /** Format the displayed number, e.g. (n) => n.toLocaleString() */
  format?: (n: number) => string;
  suffix?: string;
}

/** Animated number that counts up to `value` with ease-out. */
export default function CountUp({ value, duration = 700, style, format, suffix = '' }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start(() => setDisplay(value));
    return () => anim.removeListener(id);
  }, [value]);

  const text = format ? format(display) : String(display);
  return <Animated.Text style={style}>{text}{suffix}</Animated.Text>;
}
