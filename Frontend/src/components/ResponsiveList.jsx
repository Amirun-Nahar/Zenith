import { motion, AnimatePresence } from 'framer-motion';
import { useTouch } from '../hooks/useTouch';

export function ResponsiveList({
  items = [],
  renderItem,
  onItemClick,
  onItemSwipe,
  className = '',
  swipeToDelete = false,
  swipeToArchive = false,
}) {
  const getSwipeActions = (index) => {
    const { touchHandlers, isTouching } = useTouch({
      onSwipe: (direction, deltas) => {
        if (direction === 'left' && (swipeToDelete || swipeToArchive)) {
          onItemSwipe?.(items[index], direction);
        } else if (direction === 'right') {
          onItemSwipe?.(items[index], direction);
        }
      },
    });

    return { touchHandlers, isTouching };
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {items.map((item, index) => {
          const { touchHandlers, isTouching } = getSwipeActions(index);

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="relative"
              {...touchHandlers}
            >
              {/* Swipe Actions Background */}
              {(swipeToDelete || swipeToArchive) && (
                <div className="absolute inset-y-0 right-0 flex items-center justify-end px-4 text-sm font-medium opacity-50">
                  {swipeToDelete && <span>← Swipe to delete</span>}
                  {swipeToArchive && <span>← Swipe to archive</span>}
                </div>
              )}

              {/* List Item */}
              <motion.div
                className={`
                  relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden
                  transition-colors duration-200
                  ${onItemClick ? 'cursor-pointer active:bg-white/20' : ''}
                  ${isTouching ? 'scale-[0.98]' : 'scale-100'}
                `}
                onClick={() => onItemClick?.(item)}
                style={{
                  transform: `translateX(${isTouching ? '-2px' : '0'})`,
                }}
              >
                {renderItem(item)}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="text-center py-8 text-[#f8f7e5] opacity-60">
          No items to display
        </div>
      )}
    </div>
  );
}
