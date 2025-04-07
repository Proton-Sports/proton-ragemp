import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextArea({ className, ...props }: Props) {
  return <textarea {...props} className={clsx('c-textarea', className)}></textarea>;
}
