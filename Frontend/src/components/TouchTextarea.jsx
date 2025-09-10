import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TouchTextarea = forwardRef(({
  label,
  error,
  className = '',
  onFocus,
  onBlur,
  maxLength,
  showCount = true,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(props.value?.length || 0);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) props.onChange(e);
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
        className="relative"
      >
        <textarea
          ref={ref}
          className={`
            input touch-target w-full min-h-[120px] resize-y
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        
        {showCount && maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-[#E43D12] opacity-60">
            {charCount}/{maxLength}
          </div>
        )}
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
