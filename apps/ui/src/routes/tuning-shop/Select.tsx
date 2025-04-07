import { useEffect, useMemo } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useCategoryValues } from './context';
import Button from '../../lib/components/Button';
import type { Mod, OwnedMod } from './Index';

interface Props {
  id: number;
  defaultId?: number;
  onBuy: (modId: number) => void;
  onToggle: (modId: number, value: boolean) => void;
}

export default function Select({ id, defaultId, onBuy, onToggle }: Props) {
  const { categories, setCategories } = useCategoryValues();
  const category = useMemo(() => categories[id] ?? {}, [categories, id]);
  const mods = useMemo(() => (category.mods ?? []) as Mod[], [category]);
  const ownedMods = useMemo(() => (category.ownedMods ?? []) as OwnedMod[], [category]);
  const index = useMemo(
    () => (category.index as number) ?? mods.findIndex((a) => a.id === defaultId),
    [category.index, mods, defaultId],
  );
  const activeItem = useMemo(() => (index === -1 ? undefined : mods[index]), [mods, index]);
  const activeOwnedMod = useMemo(
    () => (activeItem ? ownedMods?.find((a) => a.modId === activeItem.id) : undefined),
    [ownedMods, activeItem],
  );

  useEffect(() => {
    if (category != null && category.mods != null && category.ownedMods != null) {
      return;
    }
    alt.emit('tuning-shop.mods.requestData', id);
  }, [category, id]);

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          type="button"
          disabled={index <= -1}
          className="disabled:text-fg-disabled"
          onClick={() => {
            if (index <= -1) {
              return;
            }
            setCategories((a) => {
              alt.emit('tuning-shop.values.change', id, mods[index - 1]?.value ?? 0);
              return {
                ...a,
                [id]: {
                  ...a[id],
                  index: index - 1,
                },
              };
            });
          }}
        >
          <BiChevronLeft />
        </button>
        <div>
          {activeItem ? (
            <p className="font-medium text-center">{activeItem.name}</p>
          ) : (
            <p className="font-medium text-center text-sm text-fg-3">Vanilla (no mod)</p>
          )}
        </div>
        <button
          type="button"
          disabled={index >= mods.length - 1}
          className="disabled:text-fg-disabled"
          onClick={() => {
            if (index >= mods.length - 1) {
              return;
            }
            setCategories((a) => {
              alt.emit('tuning-shop.values.change', id, mods[index + 1].value);
              return {
                ...a,
                [id]: {
                  ...a[id],
                  index: index + 1,
                },
              };
            });
          }}
        >
          <BiChevronRight />
        </button>
      </div>
      {activeItem &&
        (ownedMods == null || activeOwnedMod == null ? (
          <Button
            type="button"
            variant="base"
            className="text-sm font-medium mx-auto"
            onClick={() => {
              onBuy(activeItem.id);
            }}
          >
            Buy for {activeItem?.price ?? 0}PT
          </Button>
        ) : (
          <Button
            type="button"
            variant="base"
            className="text-sm font-medium mx-auto"
            onClick={() => {
              onToggle(activeItem.id, !activeOwnedMod.isActive);
            }}
          >
            {activeOwnedMod.isActive ? 'Detach' : 'Attach'}
          </Button>
        ))}
      <p className="text-xs text-fg-3 text-center">
        {activeItem == null ? `There are ${mods.length ?? 0} items in total.` : `${index + 1}/${mods.length}`}
      </p>
    </div>
  );
}
