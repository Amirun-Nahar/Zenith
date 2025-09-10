import { motion } from 'framer-motion';
import { withTouch } from './withTouch';

function TouchButtonBase({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isTouching,
  onClick,
  ...props
}) {
  const baseClasses = 'btn touch-target transition-all duration-200';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'bg-white/10 text-[#E43D12]',
    danger: 'btn-danger',
    success: 'btn-success',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      animate={{
        scale: isTouching ? 0.95 : 1,
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export const TouchButton = withTouch(TouchButtonBase, {
  longPressDelay: 500,
  doubleTapDelay: 300,
});
