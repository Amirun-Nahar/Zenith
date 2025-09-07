import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TouchSelect = forwardRef(({
  label,
  error,
  options = [],
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    setIsOpen(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsOpen(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="space-y-1 relative">
      {label && (
        <label className="block text-sm font-medium text-[#f8f7e5] opacity-90">
          {label}
        </label>
      )}
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          y: isFocused ? -2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <select
          ref={ref}
          className={`
            input touch-target w-full appearance-none
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: isOpen ? 180 : 0 }}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
