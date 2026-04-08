// Animated counter hook for stats
import { useEffect, useState } from "react";

export function useCountUp(end: number, duration = 1200, start = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (end === start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(start + (end - start) * eased));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}
