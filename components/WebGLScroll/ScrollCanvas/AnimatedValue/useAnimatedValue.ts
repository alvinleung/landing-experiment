import { useEffect, useRef } from "react";
import { AnimatedValue } from "./AnimatedValue";

export function useAnimatedValue(initial = 0) {
  const scrollValue = useRef(new AnimatedValue(initial)).current;
  useEffect(() => {
    () => {
      scrollValue.cleanup();
    };
  }, [scrollValue]);
  return scrollValue;
}
