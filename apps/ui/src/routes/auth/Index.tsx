import { useRuntime } from '$lib/contexts/runtime-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import Bg from '../../lib/assets/images/background.jpg';
import Logo from '../../lib/assets/images/logo.png';

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { messenger } = useRuntime();

  function onClick() {
    if (!loading) {
      messenger.publish('authentication.login');
    }
  }

  messenger.on('authentication.profile', (avatarUrl: string, username: string) => {
    setAvatarUrl(avatarUrl);
    setUsername(username);
    setLoading(false);
  });

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-[3vh]"
      >
        <img src={Logo} className="w-[25vh]" />
        <p className="flex items-center text-white text-md">
          {loading ? (
            'Register your account through Discord'
          ) : (
            <>
              <img src={avatarUrl} className="rounded-full w-[3vh] mr-[1vh]" />
              continue as <span className="text-pr-primary ml-[0.35vh]">{username}</span>?
            </>
          )}
        </p>
        <button
          className="uppercase font-[bold] text-white bg-pr-secondary w-[60vh] h-[7vh] rounded-[0.5vh] text-lg hover:bg-red transition-colors flex items-center justify-center bg-gray-800"
          onClick={onClick}
        >
          {loading ? (
            <>
              <BsDiscord className="mr-[0.5vh]" />
              Waiting for Discord...
            </>
          ) : (
            'Confirm'
          )}
        </button>
      </motion.div>
    </div>
  );
}
