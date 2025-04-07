import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  ipls: string[];
  selected: string | null;
  onChange: (value: string | null) => void;
}

export default function IplListbox({ ipls, selected, onChange }: Props) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="text-left c-input">
          <span className="block truncate">{selected ?? 'None'}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HiChevronUpDown className="w-5 h-5 text-fg-3" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute w-full p-1 mt-1 overflow-auto text-base rounded-md shadow-lg bg-bg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            <Listbox.Option
              className={({ active }) =>
                clsx(
                  'relative cursor-default select-none py-2 pl-10 pr-4 rounded',
                  active && 'bg-primary text-primary-fg'
                )
              }
              value={null}
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>None</span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-fg">
                      <HiCheck className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
            {ipls.map((ipl) => (
              <Listbox.Option
                key={ipl}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-10 pr-4 rounded',
                    active && 'bg-primary text-primary-fg'
                  )
                }
                value={ipl}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{ipl}</span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-fg">
                        <HiCheck className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
