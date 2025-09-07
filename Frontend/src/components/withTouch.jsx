import { useTouch } from '../hooks/useTouch';

export function withTouch(WrappedComponent, options = {}) {
  return function TouchWrapper(props) {
    const { isTouching, touchHandlers } = useTouch({
      onTap: () => {
        if (props.onTap) props.onTap();
      },
      onDoubleTap: () => {
        if (props.onDoubleTap) props.onDoubleTap();
      },
      onLongPress: () => {
        if (props.onLongPress) props.onLongPress();
      },
      onSwipe: (direction, deltas) => {
        if (props.onSwipe) props.onSwipe(direction, deltas);
      },
      ...options,
    });

    return (
      <WrappedComponent
        {...props}
        {...touchHandlers}
        isTouching={isTouching}
        className={`${props.className || ''} touch-action-none`}
      />
    );
  };
}
