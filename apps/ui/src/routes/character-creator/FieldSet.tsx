import clsx from 'clsx';
import type { ReactNode } from 'react';

export default function FieldSet({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('p-4 space-y-4 rounded-lg bg-bg-1', className)}>
      <h2 className="text-base text-center uppercase fugaz">{title}</h2>
      {children}
    </div>
  );
}
