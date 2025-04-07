import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox as AriaCheckbox, type CheckboxProps } from 'react-aria-components';

interface Props extends CheckboxProps {}

export default function Checkbox({ children, className, ...props }: Props) {
  return (
    <AriaCheckbox {...props} className={clsx('c-checkbox-container', className)}>
      {(e) => (
        <>
          <span className="c-checkbox">
            <AnimatePresence>
              {e.isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{
                      duration: 0.15,
                      ease: e.isSelected ? 'circOut' : 'circIn',
                    }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </AnimatePresence>
          </span>
          {typeof children === 'function' ? children(e) : children}
        </>
      )}
    </AriaCheckbox>
  );
}
