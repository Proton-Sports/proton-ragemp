import { motion } from 'framer-motion';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';

export default function Index() {
  const handleMessage = () => {};

  useEffect(() => {
    alt.on('chat:sendMessage', handleMessage);

    return () => {
      alt.off('chat:sendMessage', handleMessage);
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: { translateX: '0%' },
        hidden: { translateX: '-100%' },
      }}
      transition={{ duration: 0.4, ease: 'circInOut' }}
      className="w-3/6 h-2/5 bg-red-400 text-black"
    >
      <ChatMessage author="System" message="Kampfmodz joined the race" region="Race" isSystem={true} />
      <ChatMessage author="Kampfmodz" message="Hello to Global" region="Global" isSystem={false} />
      <ChatMessage author="Kampfmodz" message="Hello to Race chat" region="Race" isSystem={false} />

      <ChatMessage author="System" message="Helutu was banned from the server" region="Global" isSystem={true} />
      <ChatMessage author="Sulfito" message="Bye Bye Helutu" region="Global" isSystem={true} />
    </motion.div>
  );
}
