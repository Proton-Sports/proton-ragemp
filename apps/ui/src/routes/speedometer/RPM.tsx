import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RpmModule() {
  const custom = {
    bottom: '22%',
    right: '-14.5%',
  };
  const [content, setContent] = useState<JSX.Element[]>([]);
  const [rpm, setRpm] = useState<number>(0);

  useEffect(() => {
    const getDials = () => {
      setContent([]);
      for (let i = 0; i < rpm / 10; i += 50) {
        if (i > 949) continue;

        let color = 'bg-white';
        if (i > 800) {
          color = 'bg-red-700';
        }
        let classnames = 'h-[16px] w-[8px] mr-[4.5px] text-transparent';
        if (i % 100 == 50) {
          classnames = 'h-[8px] w-[8px] mr-[4.5px] overflow-hidden text-transparent';
        }

        setContent((oldArray) => [...oldArray, <span className={`${classnames} ${color}`}>0</span>]);
      }
    };

    getDials();
  }, [rpm]);

  useEffect(() => {
    function handleRPM(g: number) {
      setRpm(g);
      //console.log(g);
    }

    alt.on('vehicle:rpm', handleRPM);

    return () => {
      alt.off('vehicle:rpm', handleRPM);
    };
  }, []);

  return (
    <motion.div className="absolute w-full flex items-end " style={custom}>
      {content}
    </motion.div>
  );
}
