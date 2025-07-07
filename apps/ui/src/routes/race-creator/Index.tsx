import { useState } from 'react';
import NormalMode from './NormalMode';
import FreeMode from './FreeMode';
import { useRuntime } from '$lib/contexts/runtime-context';

export type Mode = 'free' | 'normal';

export default function Index() {
  const [mode, setMode] = useState<Mode>('normal');
  const { messenger } = useRuntime();

  function handleChangeMode(mode: string) {
    messenger.publish('race:creator:changeMode', mode);
    setMode(mode as Mode);
  }

  function handleSubmit() {
    messenger.publish('race:creator:submit');
  }

  function handleQuit() {
    messenger.publish('race:creator:stop');
  }

  if (mode === 'normal')
    return <NormalMode onChangeMode={handleChangeMode} onSubmit={handleSubmit} onQuit={handleQuit} />;
  return <FreeMode onChangeMode={handleChangeMode} onSubmit={handleSubmit} onQuit={handleQuit} />;
}
