import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { formatRelativeTimeParts } from '../../lib/utils/format';
import styles from './styles.module.css';

const flags = [
  'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fechesters.co.uk%2Fimages%2Fposts%2Fflag-of-spain.png&f=1&nofb=1&ipt=75e5c8ac77aa46c67ef0c9782e2c83812c51a1326dd7b589052a34b7650b2300&ipo=images',
  'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F532%2F212%2Foriginal%2Fvector-united-states-of-america-flag-usa-flag-america-flag-background.jpg&f=1&nofb=1&ipt=f9590f32e22bd1055aefff5ac3466317ec5850168c362710970004c3826f0750&ipo=images',
  'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwallpapercave.com%2Fwp%2FsZzrQNk.jpg&f=1&nofb=1&ipt=870866918f6fb96c88fdab0205785b77d718a86be41d7710147080c3419c8f13&ipo=images',
];

const logos = [
  'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6PBA7xDtPJA%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=907008e2e5ea5396e4444e851b611a22e951ed82e1c89ec09a0469b8ae01300d&ipo=images',
  'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fdanwiki%2Fimages%2Fe%2Fe9%2FGlobe_Oil_Logo.webp%2Frevision%2Flatest%3Fcb%3D20230208015356%26path-prefix%3Dde&f=1&nofb=1&ipt=8c61e9b22acf0afa0cb00fa7b2943d677e773a675bf463abd8b6b885042d2b8a&ipo=images',
  'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Flogopedia%2Fimages%2F5%2F5e%2FLogo-IV-Vapid.png%2Frevision%2Flatest%3Fcb%3D20180520153050&f=1&nofb=1&ipt=1254292d6439d62bcd106a3daa4884a04dc04ec97361daed824a565c04bfbcf7&ipo=images',
];

interface Data {
  name: string;
  participants: {
    name: string;
    team: string;
    timeMs: number;
  }[];
}

export default function Index(props: Data) {
  const [data] = useState<Data | null>(props);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function handleToggle() {
      setVisible((v) => !v);
    }

    alt.on('race-finish-scoreboard:toggle', handleToggle);
    return () => {
      alt.off('race-finish-scoreboard:toggle', handleToggle);
    };
  }, []);

  return (
    <AnimatePresence>
      {data && visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8 fugaz">
            <div className="text-right text-sm">
              Press <span className="px-2 py-0.5 bg-bg-2 rounded">X</span> to show/hide
            </div>
            <div className="flex items-stretch text-2xl rounded-md uppercase !mt-2">
              <div className="relative">
                <div className="absolute inset-0 bg-bg/90" />
                <div className="bg-primary pl-4 pr-12 py-2 -mr-2 fugaz [clip-path:polygon(0_0,_100%_0,_75%_100%,_0%_100%)]">
                  Results
                </div>
              </div>
              <div className="flex grow items-center justify-center text-nowrap bg-bg/90 pr-4 text-xl">{data.name}</div>
            </div>
            <div className="max-h-[36rem] min-h-[36rem] overflow-y-auto overflow-x-visible bg-bg-1/90">
              <table className="w-full table-auto text-left min-w-[56rem]">
                <thead className="uppercase">
                  <motion.tr
                    className="*:px-2 *:py-1 bg-primary backdrop-blur sticky top-0 z-50"
                    initial={{ opacity: 0, x: '-4rem' }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <th className="border-none">Pos.</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th>Time</th>
                  </motion.tr>
                </thead>
                <tbody className="overflow-y-scroll">
                  {data.participants.map(({ name, team, timeMs }, i) => {
                    const parts = timeMs === 0 ? null : formatRelativeTimeParts(timeMs);
                    return (
                      <motion.tr
                        className="*:px-2 *:py-1 *:even:bg-bg-3/30"
                        initial={{ opacity: 0, x: '-4rem' }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeInOut' }}
                      >
                        <td>{i + 1}.</td>
                        <td className="flex items-center gap-2">
                          <img
                            src={flags[Math.floor(Math.random() * flags.length)]}
                            className="w-auto max-h-full max-w-4 aspect-[1/2] object-cover object-center -my-1"
                          />
                          {name}
                        </td>
                        <td>{team}</td>
                        <td>
                          <span>{parts == null ? 'DF' : `${parts[1]}:${parts[2]}.${parts[3]}`}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <motion.tr
                    className="bg-primary absolute flex bottom-0 w-full backdrop-blur *:px-2 *:py-1"
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * 13 + 0.4, ease: 'easeInOut' }}
                  >
                    <td colSpan={4} className={clsx('w-full')}>
                      <div className={styles.wrapper}>
                        <Marquee autoFill>
                          {logos.map((logo) => (
                            <img src={logo} className="w-24 h-auto object-cover px-4" />
                          ))}
                        </Marquee>
                      </div>
                    </td>
                  </motion.tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
