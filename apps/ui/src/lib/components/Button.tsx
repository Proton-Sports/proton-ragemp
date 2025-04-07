import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'base';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  transparent?: boolean;
}

export default function Button({ className, variant = 'base', transparent = false, ...props }: Props) {
  return (
    <button {...props} className={clsx('c-btn', `c-btn--${variant}`, transparent && 'c-btn-transparent', className)} />
  );
}
