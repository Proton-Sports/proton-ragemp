import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import background from '../../lib/assets/images/speedometer/background/back.png';
import kmh from '../../lib/assets/images/speedometer/KMH/KMH.png';
import greenLight from '../../lib/assets/images/speedometer/lights/greenon.png';
import redLight from '../../lib/assets/images/speedometer/lights/redon.png';
import RpmModule from './RPM';

import gear1 from '../../lib/assets/images/speedometer/gears/1.png';
import gear2 from '../../lib/assets/images/speedometer/gears/2.png';
import gear3 from '../../lib/assets/images/speedometer/gears/3.png';
import gear4 from '../../lib/assets/images/speedometer/gears/4.png';
import gear5 from '../../lib/assets/images/speedometer/gears/5.png';
import gear6 from '../../lib/assets/images/speedometer/gears/6.png';
import gear7 from '../../lib/assets/images/speedometer/gears/7.png';
import gear8 from '../../lib/assets/images/speedometer/gears/8.png';
import gear9 from '../../lib/assets/images/speedometer/gears/9.png';
import gearR from '../../lib/assets/images/speedometer/gears/R.png';

export default function Index() {
  const [greenOn, setGreenOn] = useState(false);
  const [redOn, setRedOn] = useState(false);
  const [gear, setGear] = useState(6);
  const [vehicleSpeed, setVehicleSpeed] = useState(90);

  const gears = [
    { id: 0, source: gearR },
    { id: 1, source: gear1 },
    { id: 2, source: gear2 },
    { id: 3, source: gear3 },
    { id: 4, source: gear4 },
    { id: 5, source: gear5 },
    { id: 6, source: gear6 },
    { id: 7, source: gear7 },
    { id: 8, source: gear8 },
    { id: 9, source: gear9 },
  ];

  useEffect(() => {
    function handleRed(state: boolean) {
      setRedOn(state);
    }
    function handleGreen(state: boolean) {
      setGreenOn(state);
    }
    function handleGear(g: number) {
      setGear(g);
    }
    function handleSpeed(g: number) {
      setVehicleSpeed(g);
    }

    alt.on('vehicle:red', handleRed);
    alt.on('vehicle:green', handleGreen);
    alt.on('vehicle:gear', handleGear);
    alt.on('vehicle:speed', handleSpeed);

    return () => {
      alt.off('vehicle:red', handleRed);
      alt.off('vehicle:green', handleGreen);
      alt.off('vehicle:gear', handleGear);
      alt.off('vehicle:speed', handleSpeed);
    };
  }, []);

  const customKmhStyle = {
    fontSize: '85px',
    lineHeight: 1,
    top: '28%',
    right: '37%',
    textShadow: '0 0 15px rgba(255,255,255,.5), 0 0 10px rgba(255,255,255,.5)',
  };

  const customInactiveStyle = {
    filter: 'brightness(25%)',
  };

  const customActiveStyle = {
    filter: 'brightness(100%)',
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { translateX: '0%' },
        hidden: { translateX: '100%' },
      }}
      transition={{ duration: 0.4, ease: 'circInOut' }}
      className="fixed -right-16 bottom-0"
    >
      <img src={redLight} className="absolute z-50" style={!redOn ? customInactiveStyle : customActiveStyle} />
      <img src={greenLight} className="absolute z-50" style={!greenOn ? customInactiveStyle : customActiveStyle} />

      <img src={gears[gear].source} className="absolute z-50" />
      <img src={kmh} className="absolute z-50" />
      <h2 className="digital-dream absolute drop-shadow-xl" style={customKmhStyle}>
        {vehicleSpeed}
      </h2>
      <img src={background} className="-z-10" />

      <RpmModule />

      {/* <motion.div className="absolute w-full -right-14 flex items-end" style={custom}>
        <span className="h-4 w-2 bg-white mr-1 text-transparent">0</span>
        <span className="h-2 w-2 bg-white mr-1 overflow-hidden text-transparent">0</span>
        <span className="h-4 w-2 bg-white mr-1 text-transparent">0</span>
        <span className="h-2 w-2 bg-white mr-1 overflow-hidden text-transparent">0</span>
      </motion.div> */}
    </motion.div>
  );
}
