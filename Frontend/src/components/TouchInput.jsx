import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

export const TouchInput = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[#E43D12] opacity-90">
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
        <input
          ref={ref}
          type={type}
          className={`
            input touch-target w-full
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </motion.div>
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
    </div>
  );
});
