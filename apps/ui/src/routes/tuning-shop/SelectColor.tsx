import { useMemo } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import Color from './Color';
import { useCategoryValues } from './context';
import Button from '../../lib/components/Button';

interface Props {
  id: number;
  initialValue: { r: number; g: number; b: number; a: number };
}

const debounced = (fn: (id: number, color: string) => void) => {
  let timeout = 0;
  return (id: number, color: string) => {
    if (timeout !== 0) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(id, color);
    }, 66);
  };
};

export default function SelectColor({ id, initialValue }: Props) {
  const { categories, setCategories } = useCategoryValues();
  const initialHex = useMemo(
    () => `#${initialValue.r.toString(16)}${initialValue.g.toString(16)}${initialValue.b.toString(16)}`,
    [initialValue]
  );
  const category = useMemo(() => categories[id], [categories, id]);
  const color = useMemo(() => (category?.color as string) ?? initialHex, [category, initialHex]);
  const emitChange = useMemo(
    () =>
      debounced((id, color) => {
        alt.emit('tuning-shop.colors.change', id, color);
      }),
    []
  );

  const handleChange = (color: string) => {
    setCategories((a) => ({
      ...a,
      [id]: {
        ...a[id],
        color,
      },
    }));
    emitChange(id, color);
  };

  const handleChangeInstantly = (color: string) => {
    setCategories((a) => ({
      ...a,
      [id]: {
        ...a[id],
        color,
      },
    }));
    alt.emit('tuning-shop.colors.change', id, color);
  };

  return (
    <div className="flex gap-2">
      <div className="colorful-picker flex-1 min-h-40">
        <HexColorPicker color={color} onChange={handleChange} />
      </div>
      <div className="flex-1 grid grid-rows-[1fr_auto] items-start gap-2 -mr-2 pr-2">
        <div className="flex flex-wrap *:basis-6 justify-center">
          {colors.map((a) => (
            <Color key={a} color={a} onClick={handleChangeInstantly} />
          ))}
        </div>
        <HexColorInput prefixed color={color} onChange={handleChangeInstantly} className="c-input" />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="primary"
            disabled={color === initialHex}
            onClick={() => {
              alt.emit('tuning-shop.colors.buy', id, color);
            }}
            className="text-sm font-medium grow"
          >
            Buy
          </Button>
          <Button
            type="button"
            variant="base"
            className="text-sm font-medium grow"
            onClick={() => {
              setCategories((a) => ({
                ...a,
                [id]: {
                  ...a[id],
                  color: initialHex,
                },
              }));
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

const colors = [
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#64748b',
  '#6b7280',
  '#71717a',
  '#737373',
  '#78716c',
  '#000000',
];
