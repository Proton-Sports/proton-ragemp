import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import GreenSound from '../../lib/assets/audio/race-start-countdown/green-sound.mp3';
import RedSound from '../../lib/assets/audio/race-start-countdown/red-sound.mp3';
import Logo from '../../lib/assets/images/proton-text-logo.png';

type Status = 'running' | null;

export default function Index() {
  const [status, setStatus] = useState<'running' | null>(null);
  const [step, setStep] = useState(-1);
  const interval = useRef<number>();
  const audio = useRef(new Audio());

  const count = useCallback(() => {
    setStep((step) => {
      const a = audio.current!;
      step += 1;
      if (step < 5) {
        if (a.src !== RedSound) {
          a.src = RedSound;
        }
      } else {
        a.src = GreenSound;
      }

      if (a.paused) {
        a.play().catch(() => {});
      }
      a.currentTime = 0;
      return step;
    });
  }, [setStep]);

  useEffect(() => {
    const currentAudio = audio.current;
    function handleSetStatus(value: Status) {
      setStatus(value);
    }
    alt.on('race-start-countdown:setStatus', handleSetStatus);
    return () => {
      currentAudio.pause();
      alt.off('race-start-countdown:setStatus', handleSetStatus);
    };
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    const currentAudio = audio.current;
    setStep(-1);
    count();
    interval.current = setInterval(count, 1000);
    return () => {
      clearInterval(interval.current);
      interval.current = 0;
      currentAudio.pause();
    };
  }, [status, count]);

  useEffect(() => {
    if (step === 5) {
      clearInterval(interval.current);
      interval.current = 0;
    }
  }, [step]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2">
      <div className="p-4 bg-bg-2 mx-auto rounded-full">
        <motion.img
          src={Logo}
          className="object-cover max-w-72 mx-auto"
          variants={{
            hidden: { opacity: 0, transition: { duration: 0.4, ease: 'backInOut' } },
            visible: { opacity: 1, transition: { delay: 0.6, duration: 0.6, ease: 'easeInOut' } },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        />
      </div>
      <motion.ol
        className="mt-8 flex gap-8"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {new Array(5).fill(0).map((_, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, translateY: '-200%', transition: { ease: 'backInOut', duration: 0.6 } },
              visible: { opacity: 1, translateY: '0', transition: { type: 'spring', duration: 0.6 } },
            }}
          >
            <LightIndicator red={step >= i} green={step === 5} />
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}

function LightIndicator({ red, green }: { red: boolean; green: boolean }) {
  return (
    <div className="p-4 space-y-4 rounded-full bg-bg-2 border-[0.5rem] border-bg-3">
      <div className="size-20 rounded-full bg-bg-3">
        {green && (
          <motion.div
            className="z-50 size-full rounded-full bg-green-500"
            style={{
              boxShadow: '0 0 4px #22c55e, 0 0 80px #22c55e',
            }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          ></motion.div>
        )}
      </div>
      <div className="size-20 rounded-full bg-bg-3">
        {red && (
          <motion.div
            className="size-full rounded-full bg-red-500"
            style={{
              boxShadow: '0 0 4px #ef4444, 0 0 40px #ef4444',
            }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          ></motion.div>
        )}
      </div>
    </div>
  );
}
