import { useRanger, Ranger } from '@tanstack/react-ranger';
import clsx from 'clsx';
import { Fragment, useEffect, useRef, useState } from 'react';

interface Props {
  id?: string;
  defaultValues?: number[];
  values?: number[];
  min: number;
  max: number;
  step: number;
  onChange?: (values: number[]) => void;
  onDrag?: (values: number[]) => void;
  showProgress?: boolean;
}

export default function Slider({
  id,
  defaultValues,
  values: __values,
  min,
  max,
  step,
  showProgress,
  onChange,
  onDrag,
}: Props) {
  const rangerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(__values ?? defaultValues ?? []);

  useEffect(() => {
    if (__values) setValues(__values);
  }, [__values, setValues]);

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values: values,
    min,
    max,
    stepSize: step,
    onChange: onDrag
      ? undefined
      : (instance: Ranger<HTMLDivElement>) => {
          if (__values && onChange) onChange([...instance.sortedValues]);
          else setValues([...instance.sortedValues]);
        },
    onDrag: (instance: Ranger<HTMLDivElement>) => {
      if (__values && onDrag) onDrag([...instance.sortedValues]);
      else setValues([...instance.sortedValues]);
    },
  });

  return (
    <div ref={rangerRef} className="relative h-2 rounded-full select-none bg-bg-3">
      {rangerInstance.handles().map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart, isActive }, i) => (
        <Fragment key={i}>
          {showProgress && (
            <div
              className={clsx(
                'absolute inset-0 rounded-full transition ease-in-out',
                isActive ? 'bg-primary ring ring-primary/10' : 'bg-fg'
              )}
              style={{ width: `${rangerInstance.getPercentageForValue(value)}%` }}
            />
          )}
          <button
            id={id}
            onKeyDown={onKeyDownHandler}
            onMouseDown={onMouseDownHandler}
            onTouchStart={onTouchStart}
            role="slider"
            aria-valuemin={rangerInstance.options.min}
            aria-valuemax={rangerInstance.options.max}
            aria-valuenow={value}
            className={clsx(
              'absolute transition ease-in-out -translate-x-1/2 -translate-y-1/2 border rounded-full top-1/2 size-4',
              isActive
                ? 'bg-primary border-transparent ring ring-primary/40'
                : 'bg-fg hover:bg-primary-hover border-bg-border ring-0'
            )}
            style={{
              left: `${rangerInstance.getPercentageForValue(value)}%`,
              zIndex: isActive ? '1' : '0',
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}
