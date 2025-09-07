import { useCallback, useRef, useState } from 'react';

export function useTouch({
  onSwipe = () => {},
  onTap = () => {},
  onDoubleTap = () => {},
  onLongPress = () => {},
  swipeThreshold = 50,
  longPressDelay = 500,
  doubleTapDelay = 300,
} = {}) {
  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef(0);
  const longPressTimerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const now = Date.now();
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    };
    setIsTouching(true);

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      onLongPress();
      setIsTouching(false);
    }, longPressDelay);
  }, [longPressDelay, onLongPress]);

  const handleTouchMove = useCallback((e) => {
    if (!isTouching) return;

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // If moved more than threshold, trigger swipe
    if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
      const direction = Math.abs(deltaX) > Math.abs(deltaY)
        ? deltaX > 0 ? 'right' : 'left'
        : deltaY > 0 ? 'down' : 'up';
      onSwipe(direction, { deltaX, deltaY });
      setIsTouching(false);
    }
  }, [isTouching, onSwipe, swipeThreshold]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setIsTouching(false);

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    const touchEnd = Date.now();
    const touchDuration = touchEnd - touchStartRef.current.time;

    // If touch duration is short enough, handle tap
    if (touchDuration < 300) {
      const timeSinceLastTap = touchEnd - lastTapRef.current;
      
      if (timeSinceLastTap < doubleTapDelay) {
        // Double tap
        onDoubleTap();
        lastTapRef.current = 0;
      } else {
        // Single tap
        onTap();
        lastTapRef.current = touchEnd;
      }
    }
  }, [doubleTapDelay, onDoubleTap, onTap]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: () => {
      setIsTouching(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    },
  };

  return {
    isTouching,
    touchHandlers,
  };
}
