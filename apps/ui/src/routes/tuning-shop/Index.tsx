import { Accordion } from '@ark-ui/react/accordion';
import { lazy, Suspense, useEffect, useRef, useState, type MouseEventHandler } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { Virtualizer } from 'virtua';
import CategoryValuesProvider from './CategoryValuesProvider';

interface Props {
  primaryColor: { r: number; g: number; b: number; a: number };
  secondaryColor: { r: number; g: number; b: number; a: number };
}

export interface Mod {
  id: number;
  name: string;
  category: number;
  model: number;
  value: number;
  price: number;
}

export interface OwnedMod {
  category: number;
  modId: number;
  isActive: boolean;
}

export interface WheelVariation {
  id: number;
  type: number;
  model?: number;
  value: number;
  name: string;
  price: number;
}

export interface OwnedWheelVariation {
  wheelVariationId: number;
  type: number;
  value: number;
  isActive: boolean;
}

interface RequestModData {
  mods: Mod[];
  ownedMods: OwnedMod[];
}

interface RequestWheelsData {
  wheelVariations: WheelVariation[];
  ownedWheelVariations: OwnedWheelVariation[];
  wheelType: number;
}

export default function Index({ primaryColor: initialPrimaryColor, secondaryColor: initialSecondaryColor }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const handleCamera: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };
  const [primaryColor] = useState(initialPrimaryColor);
  const [secondaryColor] = useState(initialSecondaryColor);
  const [categoryValues, setCategoryValues] = useState<Record<number, Record<string, unknown>>>({});

  useEffect(() => {
    const handleBuy = (category: number, modId: number, success: boolean) => {
      if (!success) {
        setCategoryValues((a) => ({
          ...a,
          [category]: {
            ...a[category],
            ownedMods: (a[category]?.ownedMods as OwnedMod[] | undefined)?.filter((a) => a.modId !== modId),
          },
        }));
      }
    };

    const handleBuyColor = (category: number, _: string, success: boolean) => {
      if (!success) {
        setCategoryValues((a) => ({
          ...a,
          [category]: {
            ...a[category],
            color:
              category === 66
                ? `#${primaryColor.r.toString(16)}${primaryColor.g.toString(16)}${primaryColor.b.toString(16)}`
                : `#${secondaryColor.r.toString(16)}${secondaryColor.g.toString(16)}${secondaryColor.b.toString(16)}`,
          },
        }));
      }
    };

    const handleWheelsBuy = (wheelVariationId: number, success: boolean) => {
      if (!success) {
        setCategoryValues((a) => ({
          ...a,
          1000: {
            ...a[1000],
            ownedWheelVariations: (a[1000]?.ownedWheelVariations as OwnedWheelVariation[] | undefined)?.filter(
              (b) => b.wheelVariationId !== wheelVariationId,
            ),
          },
        }));
      }
    };

    const handleModRequestData = (id: number, data: RequestModData) => {
      setCategoryValues((a) => ({
        ...a,
        [id]: {
          ...a[id],
          ...data,
        },
      }));
    };

    const handleWheelsRequestData = (data: RequestWheelsData) => {
      setCategoryValues((a) => ({
        ...a,
        1000: {
          ...a[1000],
          ...data,
        },
      }));
    };

    alt.on('tuning-shop.buy', handleBuy);
    alt.on('tuning-shop.colors.buy', handleBuyColor);
    alt.on('tuning-shop.wheels.buy', handleWheelsBuy);
    alt.on('tuning-shop.mods.requestData', handleModRequestData);
    alt.on('tuning-shop.wheels.requestData', handleWheelsRequestData);
    return () => {
      alt.off('tuning-shop.buy', handleBuy);
      alt.off('tuning-shop.colors.buy', handleBuyColor);
      alt.off('tuning-shop.wheels.buy', handleWheelsBuy);
      alt.off('tuning-shop.mods.requestData', handleModRequestData);
      alt.off('tuning-shop.wheels.requestData', handleWheelsRequestData);
    };
  }, [primaryColor.r, primaryColor.g, primaryColor.b, secondaryColor.r, secondaryColor.g, secondaryColor.b]);

  return (
    <div className="fixed inset-y-16 left-16 bg-bg-1/80 overflow-hidden grid grid-rows-[auto_1fr] rounded-lg min-w-96">
      <div className="p-4">
        <h2 className="text-xl font-black tracking-tight leading-none">PROTech AUTOPARTS</h2>
      </div>
      <CategoryValuesProvider categories={categoryValues} setCategories={setCategoryValues}>
        <div ref={scrollRef} className="overflow-auto p-4 pt-0" style={{ overflowAnchor: 'none' }}>
          <Accordion.Root multiple lazyMount={true}>
            <Accordion.Context>
              {(context) => (
                <Virtualizer scrollRef={scrollRef}>
                  {categories.map((category) => {
                    const Content = category.component as unknown as React.LazyExoticComponent<
                      (props: Record<string, unknown>) => React.JSX.Element
                    >;
                    return (
                      <Accordion.Item
                        key={category.id}
                        value={category.id + ''}
                        className="group border border-transparent data-[state=open]:border-bg-border rounded data-[state=open]:bg-bg-2/60"
                      >
                        <Accordion.ItemTrigger className="flex font-medium justify-between w-full rounded p-4 hover:bg-bg-2/60 text-fg-3 group-data-[state=open]:font-bold group-data-[state=open]:text-fg-1 tracking-tight">
                          {category.name}
                          <div className="flex gap-4">
                            <button
                              type="button"
                              disabled={!context.value.includes(category.id + '')}
                              onClick={handleCamera}
                              className="[&:not(:disabled)]:hover:text-fg-hover"
                            >
                              <BsEye />
                            </button>
                            <Accordion.ItemIndicator className="transition-transform ease-in-out data-[state=open]:-rotate-180">
                              <BiChevronDown />
                            </Accordion.ItemIndicator>
                          </div>
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                          <div className="p-4">
                            <Suspense fallback="Loading...">
                              {category.tag === 'wheel' ? (
                                <Content {...category.props} />
                              ) : category.tag === 'color' ? (
                                <Content
                                  {...category.props}
                                  initialValue={category.id == 66 ? primaryColor : secondaryColor}
                                />
                              ) : (
                                <Content
                                  {...category.props}
                                  onBuy={(modId: number) => {
                                    alt.emit('tuning-shop.buy', category.id, modId);
                                    setCategoryValues((a) => ({
                                      ...a,
                                      [category.id]: {
                                        ...a[category.id],
                                        ownedMods: [
                                          ...((a[category.id]?.ownedMods as OwnedMod[] | undefined)?.map((a) =>
                                            a.isActive
                                              ? {
                                                  ...a,
                                                  isActive: false,
                                                }
                                              : a,
                                          ) ?? []),
                                          { category: category.id, modId, isActive: true },
                                        ],
                                      },
                                    }));
                                  }}
                                  onToggle={(modId: number, value: boolean) => {
                                    alt.emit('tuning-shop.toggle', category.id, modId, value);
                                    if (value) {
                                      setCategoryValues((a) => ({
                                        ...a,
                                        [category.id]: {
                                          ...a[category.id],
                                          ownedMods:
                                            (a[category.id]?.ownedMods as OwnedMod[] | undefined)?.map((a) =>
                                              a.modId === modId
                                                ? { ...a, isActive: value }
                                                : a.isActive
                                                  ? { ...a, isActive: false }
                                                  : a,
                                            ) ?? [],
                                        },
                                      }));
                                    } else {
                                      setCategoryValues((a) => ({
                                        ...a,
                                        [category.id]: {
                                          ...a[category.id],
                                          ownedMods:
                                            (a[category.id]?.ownedMods as OwnedMod[] | undefined)?.map((a) =>
                                              a.modId === modId ? { ...a, isActive: value } : a,
                                            ) ?? [],
                                        },
                                      }));
                                    }
                                  }}
                                />
                              )}
                            </Suspense>
                          </div>
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    );
                  })}
                </Virtualizer>
              )}
            </Accordion.Context>
          </Accordion.Root>
        </div>
      </CategoryValuesProvider>
    </div>
  );
}

const categories = [
  colorCategory(66, 'Primary Color'),
  colorCategory(67, 'Secondary Color'),
  category(0, 'Spoilers'),
  category(1, 'Front Bumper'),
  category(2, 'Rear Bumper'),
  category(3, 'Side Skirt'),
  category(4, 'Exhaust'),
  category(5, 'Frame'),
  category(6, 'Grille'),
  category(7, 'Bonnet'),
  category(8, 'Left Wing'),
  category(9, 'Right Wing'),
  category(10, 'Roof'),
  category(11, 'Engine'),
  category(12, 'Brakes'),
  category(13, 'Transmission'),
  category(14, 'Horns'),
  category(15, 'Suspension'),
  category(16, 'Armor'),
  category(18, 'Turbo'),
  category(20, 'Custom Tire Smoke'),
  category(22, 'Xenon'),
  wheelCategory(1000, 'Wheels'),
  category(25, 'Plate Holders'),
  category(26, 'Plate Vanity'),
  category(27, 'Trim Design'),
  category(28, 'Ornaments'),
  category(30, 'Dial Design'),
  category(31, 'Door Interior'),
  category(32, 'Seats'),
  category(33, 'Steering Wheel'),
  category(34, 'Shift Lever'),
  category(35, 'Plaques'),
  category(36, 'Rear Shelf'),
  category(37, 'Trunk'),
  category(38, 'Hydraulics'),
  category(39, 'Engine Block'),
  category(40, 'Air Filter'),
  category(41, 'Strut Bar'),
  category(42, 'Arch Cover'),
  category(43, 'Antenna'),
  category(44, 'Exterior Parts'),
  category(45, 'Tank'),
  category(46, 'Door'),
  category(47, 'Wheels Rear Or Hydraulics'),
  category(48, 'Livery'),
];

function category(id: number, name: string, props?: Record<string, unknown>) {
  return {
    tag: 'default' as const,
    id,
    name,
    props: {
      id,
      ...props,
    },
    component: lazy(() => import('./Select.tsx')),
  };
}

function colorCategory(id: number, name: string, props?: Record<string, unknown>) {
  return {
    tag: 'color' as const,
    id,
    name,
    props: {
      id,
      ...props,
    },
    component: lazy(() => import('./SelectColor.tsx')),
  };
}

function wheelCategory(id: number, name: string, props?: Record<string, unknown>) {
  return {
    tag: 'wheel' as const,
    id,
    name,
    props: {
      id,
      ...props,
    },
    component: lazy(() => import('./SelectWheel.tsx')),
  };
}
