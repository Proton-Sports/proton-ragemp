import { useEffect, useMemo } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Button from '../../lib/components/Button';
import { useCategoryValues } from './context';
import type { OwnedWheelVariation, WheelVariation } from './Index';
import { wheelTypeNames } from './utils';

interface Props {
  id: number;
}

export default function Select({ id }: Props) {
  const { categories, setCategories } = useCategoryValues();
  const category = useMemo(() => categories[id] ?? {}, [categories, id]);
  const wheels = useMemo(() => (category.wheelVariations ?? []) as WheelVariation[], [category]);
  const ownedWheels = useMemo(() => (category.ownedWheelVariations ?? []) as OwnedWheelVariation[], [category]);
  const wheelType = useMemo(() => category.wheelType as number | undefined, [category]);
  const categorizedWheels = useMemo(() => Object.groupBy(wheels, (a) => a.type), [wheels]);
  const index = (category.index as number) ?? -1;
  const activeWheel = useMemo(
    () => (index === -1 || wheelType == null ? undefined : categorizedWheels[wheelType]?.[index]),
    [categorizedWheels, wheelType, index],
  );
  const activeOwnedWheel = useMemo(
    () => (activeWheel ? ownedWheels?.find((a) => a.wheelVariationId === activeWheel.id) : undefined),
    [ownedWheels, activeWheel],
  );
  const wheelTypes = useMemo(
    () =>
      Object.keys(categorizedWheels)
        .map((a) => Number(a))
        .toSorted((a, b) => a - b),
    [categorizedWheels],
  );
  const wheelTypeIndex = useMemo(
    () => (wheelType == null ? -1 : wheelTypes.indexOf(wheelType)),
    [wheelTypes, wheelType],
  );

  useEffect(() => {
    if (category != null && category.wheelVariations != null && category.ownedWheelVariations != null) {
      return;
    }

    alt.emit('tuning-shop.wheels.requestData');
  }, [category]);

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={wheelTypeIndex <= -1}
          className="disabled:text-fg-disabled"
          onClick={() => {
            if (wheelTypeIndex <= -1) {
              return;
            }

            setCategories((a) => ({
              ...a,
              1000: {
                ...a[1000],
                wheelType: wheelTypes[wheelTypeIndex - 1],
                index: undefined,
              },
            }));
          }}
        >
          <BiChevronLeft />
        </button>
        <div>
          <p className="font-medium text-center">
            {wheelTypeNames[wheelTypes[wheelTypeIndex] as keyof typeof wheelTypeNames] ?? 'Vanilla (no wheel type)'}
          </p>
        </div>
        <button
          type="button"
          disabled={wheelTypeIndex >= wheelTypes.length - 1}
          className="disabled:text-fg-disabled"
          onClick={() => {
            if (wheelTypeIndex >= wheelTypes.length - 1) {
              return;
            }

            setCategories((a) => ({
              ...a,
              1000: {
                ...a[1000],
                wheelType: wheelTypes[wheelTypeIndex + 1],
                index: undefined,
              },
            }));
          }}
        >
          <BiChevronRight />
        </button>
      </div>
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
              alt.emit('tuning-shop.wheels.change', wheelType, index - 1);
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
          {activeWheel ? (
            <p className="font-medium text-center">{activeWheel.name}</p>
          ) : (
            <p className="font-medium text-center text-sm text-fg-3">Vanilla (no mod)</p>
          )}
        </div>
        <button
          type="button"
          disabled={wheelTypeIndex === -1 || index >= wheels.length - 1}
          className="disabled:text-fg-disabled"
          onClick={() => {
            if (index >= wheels.length - 1) {
              return;
            }
            setCategories((a) => {
              alt.emit('tuning-shop.wheels.change', wheelType, index + 1);
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
      {activeWheel &&
        (ownedWheels == null || activeOwnedWheel == null ? (
          <Button
            type="button"
            variant="base"
            className="text-sm font-medium mx-auto"
            onClick={() => {
              alt.emit('tuning-shop.wheels.buy', activeWheel.id);
              setCategories((a) => ({
                ...a,
                1000: {
                  ...a[1000],
                  ownedWheelVariations: [
                    ...((a[1000]?.ownedWheelVariations as OwnedWheelVariation[]) ?? []),
                    {
                      wheelVariationId: activeWheel.id,
                      type: activeWheel.type,
                      value: activeWheel.value,
                      isActive: true,
                    },
                  ],
                },
              }));
            }}
          >
            Buy for {activeWheel?.price ?? 0}PT
          </Button>
        ) : (
          <Button
            type="button"
            variant="base"
            className="text-sm font-medium mx-auto"
            onClick={() => {
              const isActive = !activeOwnedWheel.isActive;
              alt.emit('tuning-shop.wheels.toggle', activeWheel, isActive);
              if (isActive) {
                setCategories((a) => ({
                  ...a,
                  1000: {
                    ...a[1000],
                    ownedWheelVariations: (a[1000]?.ownedWheelVariations as OwnedWheelVariation[] | undefined)?.map(
                      (b) =>
                        b.wheelVariationId === activeWheel.id
                          ? {
                              ...b,
                              isActive: true,
                            }
                          : b.isActive
                            ? { ...b, isActive: false }
                            : b,
                    ),
                  },
                }));
              } else {
                setCategories((a) => ({
                  ...a,
                  1000: {
                    ...a[1000],
                    ownedWheelVariations: (a[1000]?.ownedWheelVariations as OwnedWheelVariation[] | undefined)?.map(
                      (b) =>
                        b.wheelVariationId === activeWheel.id
                          ? {
                              ...b,
                              isActive: false,
                            }
                          : b,
                    ),
                  },
                }));
              }
            }}
          >
            {activeOwnedWheel.isActive ? 'Detach' : 'Attach'}
          </Button>
        ))}
      <p className="text-xs text-fg-3 text-center">
        {wheelTypeIndex !== -1 &&
          (activeWheel == null
            ? `There are ${categorizedWheels[wheelType!]?.length ?? 0} items in total.`
            : `${index + 1}/${categorizedWheels[wheelType!]?.length ?? 0}`)}
      </p>
    </div>
  );
}
