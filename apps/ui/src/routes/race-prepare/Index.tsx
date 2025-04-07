import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Data {
  endTime: number;
}

export default function Index() {
  const [data, setData] = useState<Data | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    function handleSetData(data: Data) {
      setData(data);
    }

    alt.on('race-prepare:setData', handleSetData);
    return () => {
      alt.off('race-prepare:setData', handleSetData);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const seconds = Math.max(-1, Math.floor((data.endTime - Date.now()) / 1000));
    setRemainingSeconds(seconds);
    let clear = false;
    const interval = setInterval(() => {
      const seconds = Math.max(-1, Math.floor((data.endTime - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds === -1) {
        clear = true;
        clearInterval(interval);
      }
    }, 500);
    return () => {
      if (!clear) {
        clearInterval(interval);
      }
    };
  }, [data, setRemainingSeconds]);

  if (!data) return null;

  return (
    <div className="fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={remainingSeconds}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
        >
          <span className="text-[8rem] font-black text-fg/80">
            {remainingSeconds === 0 ? 'READY' : remainingSeconds === -1 ? 'GO!!!' : remainingSeconds}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
