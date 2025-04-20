import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Arrow from '../../lib/assets/images/arrow_button.png';
import Button from '../../lib/components/Button';
import DNA from './DNA';
import { type FaceData, type DNAData, type OverlayData, type HairData, dto as appearaceDto } from './utils';
import Face from './Face';
import Overlay from './Overlay';
import Hair from './Hair';
import { Popover, Transition } from '@headlessui/react';
import { useRuntime } from '$lib/contexts/runtime-context';

export default function Index() {
  type Page = (typeof pages)[number]['id'];

  const { messenger } = useRuntime();
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [dnaData, setDNAData] = useState<DNAData>({
    gender: 'male',
    mother: [0],
    father: [0],
    motherSkin: [0],
    fatherSkin: [0],
    faceMix: [0.5],
    skinMix: [0.5],
    eyesColor: [0],
  });
  const [faceData, setFaceData] = useState<FaceData>({
    noseWidth: [0],
    noseHeight: [0],
    noseLength: [0],
    noseBridge: [0],
    noseTip: [0],
    noseBridgeShaft: [0],
    browHeight: [0],
    browWidth: [0],
    cheekBoneHeight: [0],
    cheekBoneWidth: [0],
    cheekWidth: [0],
    eyeLids: [0],
    lips: [0],
    jawWidth: [0],
    jawHeight: [0],
    chinLength: [0],
    chinPosition: [0],
    chinWidth: [0],
    chinShape: [0],
    neckWidth: [0],
  });
  const [overlayData, setOverlayData] = useState<OverlayData>({
    blemish: [0],
    blemishOpacity: [0],
    ageing: [0],
    ageingOpacity: [0],
    complexion: [0],
    complexionOpacity: [0],
    sunDamage: [0],
    sunDamageOpacity: [0],
    freckles: [0],
    frecklesOpacity: [0],
    bodyBlemish: [0],
    bodyBlemishOpacity: [0],
    blush: [0],
    blushOpacity: [0],
    lipstick: [0],
    lipstickOpacity: [0],
  });
  const [hairData, setHairData] = useState<HairData>({
    hair: [0],
    hairColor1: [0],
    hairColor2: [0],
    facialHair: [0],
    facialHairColor1: [0],
    facialHairColor2: [0],
    facialHairOpacity: [0],
    eyeBrows: [0],
    eyeBrowsColor: [0],
  });

  const pages = [
    {
      id: 'dna',
      label: 'DNA',
      node: <DNA data={dnaData} onDrag={handleDNADrag} onGenderChange={handleDNAGenderChange} />,
    },
    { id: 'face', label: 'Face', node: <Face data={faceData} onDrag={handleFaceDrag} /> },
    { id: 'overlay', label: 'Overlay', node: <Overlay data={overlayData} onDrag={handleOverlayDrag} /> },
    { id: 'hair', label: 'Hair', node: <Hair gender={dnaData.gender} data={hairData} onDrag={handleHairDrag} /> },
  ] as const;

  function handleChangePage(page: Page) {
    setActivePage((activePage) => (activePage === page ? null : page));
  }

  function handleDNADrag(field: keyof DNAData, values: number[]) {
    setDNAData((x) => ({ ...x, [field]: values }));
    emitSetAppearance();
  }

  function handleDNAGenderChange(value: 'male' | 'female') {
    setDNAData((x) => ({ ...x, gender: value }));
    messenger.publish('character-creator.setGender', value === 'male' ? 1 : 0);
  }

  function handleFaceDrag(field: keyof FaceData, values: number[]) {
    setFaceData((x) => ({ ...x, [field]: values }));
    emitSetAppearance();
  }

  function handleOverlayDrag(field: keyof OverlayData, values: number[]) {
    setOverlayData((x) => ({ ...x, [field]: values }));
    emitSetAppearance();
  }

  function handleHairDrag(field: keyof HairData, values: number[]) {
    setHairData((x) => ({ ...x, [field]: values }));
    emitSetAppearance();
  }

  function handleMouseEnter() {
    messenger.publish('character-creator.mouseEntered', true);
  }

  function handleMouseLeave() {
    messenger.publish('character-creator.mouseEntered', false);
  }

  function emitSetAppearance() {
    messenger.publish('character-creator.setAppearance', JSON.stringify(appearaceDto(dnaData, faceData, overlayData, hairData)));
  }

  return (
    <>
      <div className="absolute inset-0 bg-bg-1/40" />
      <div className="fixed flex gap-16 -translate-y-1/2 top-1/2 left-16">
        <ol className="flex flex-col flex-grow gap-4">
          {pages.map(({ id, label }) => {
            const active = activePage === id;
            return (
              <li key={id} className="w-full min-w-36">
                <Button
                  transparent={!active}
                  variant={active ? 'primary' : 'base'}
                  className={clsx(
                    'flex items-center w-full text-left uppercase duration-100 group fugaz transition',
                    active && 'translate-x-8'
                  )}
                  onClick={() => handleChangePage(id)}
                >
                  {label}
                  <img
                    src={Arrow}
                    className={clsx(
                      'transition-opacity ml-auto w-4',
                      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                  />
                </Button>
              </li>
            );
          })}
          <li className="z-20 items-end mt-auto">
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button as="div">
                    <Button type="submit" variant="primary" className="w-full text-left uppercase fugaz">
                      Create
                    </Button>
                  </Popover.Button>
                  <Transition
                    show={open}
                    enter="transition ease-in-out"
                    enterFrom="transform translate-y-4 opacity-0"
                    enterTo="transform opacity-100"
                    leave="transition ease-in-out"
                    leaveFrom="transform opacity-100"
                    leaveTo="transform translate-y-1 opacity-0"
                  >
                    <Popover.Panel className="absolute -translate-y-[140%] w-max c-btn bg-bg-1" static>
                      {({ close }) => (
                        <form
                          className="p-4 space-y-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            messenger.publish(
                              'character-creator.submitAppearance',
                              JSON.stringify(appearaceDto(dnaData, faceData, overlayData, hairData))
                            );
                            close();
                          }}
                        >
                          <span>Do you want to proceed to create the character?</span>
                          <div className="w-full space-x-4">
                            <Button variant="primary" type="submit" className="uppercase fugaz">
                              Create
                            </Button>
                            <Button type="button" onClick={() => close()} className="uppercase fugaz">
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </li>
        </ol>
        <div
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
          className="relative px-1 py-2 c-btn bg-bg-1/60"
        >
          <div className="w-[22rem] h-[36rem] max-h-[36rem] overflow-y-auto px-3 py-2">
            <AnimatePresence mode="wait">
              {activePage && (
                <motion.div
                  key={activePage}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  initial={{ opacity: 0, translateY: -5 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0.6, translateY: 40, transitionDuration: '400ms' }}
                >
                  {pages.find((x) => x.id === activePage)?.node}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
