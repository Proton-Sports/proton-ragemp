import { motion } from 'framer-motion';
import Logo from '../../lib/assets/images/proton-text-logo.png';

export default function Index() {
  return (
    <div className="fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, ease: 'circInOut' }}
      >
        <img src={Logo} className="w-auto h-20" />
      </motion.div>
    </div>
  );
}
