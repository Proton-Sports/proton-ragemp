import { Slider as ArkSlider } from '@ark-ui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface Props {
  id?: string;
  defaultValues?: number[];
  values?: number[];
  min: number;
  max: number;
  step: number;
  onChange?: (values: number[]) => void;
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
}: Props) {
  const isControlled = onChange != null;
  const [values, setValues] = useState(__values ?? defaultValues ?? [min]);

  useEffect(() => {
    if (isControlled && __values) setValues(__values);
  }, [__values, isControlled, setValues]);

  const handleChange = (details: { value: number[] }) => {
    if (onChange) onChange(details.value);
    else setValues(details.value);
  };

  return (
    <ArkSlider.Root
      id={id}
      min={min}
      max={max}
      step={step}
      value={__values}
      onValueChange={handleChange}
    >
      <ArkSlider.Control className="relative flex items-center justify-center">
        <ArkSlider.Track className="bg-bg-3 h-2 w-full rounded-full">
          {showProgress && <ArkSlider.Range className="bg-primary" />}
        </ArkSlider.Track>
        {((isControlled ? __values : values) ?? []).map((_value, i) => (
          <ArkSlider.Thumb
            key={i}
            index={i}
            className={clsx(
              'border rounded-full size-5',
              'bg-fg hover:bg-primary-hover border-bg-border ring-0'
            )}
          />
        ))}
      </ArkSlider.Control>
    </ArkSlider.Root>
  );
}
