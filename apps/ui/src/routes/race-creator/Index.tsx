import { useState } from 'react';
import NormalMode from './NormalMode';
import FreeMode from './FreeMode';

export type Mode = 'free' | 'normal';

export default function Index() {
  const [mode, setMode] = useState<Mode>('normal');

  function handleChangeMode(mode: string) {
    alt.emit('race:creator:changeMode', mode);
    setMode(mode as Mode);
  }

  function handleSubmit() {
    alt.emit('race:creator:submit');
  }

  function handleQuit() {
    alt.emit('race:creator:stop');
  }

  if (mode === 'normal')
    return <NormalMode onChangeMode={handleChangeMode} onSubmit={handleSubmit} onQuit={handleQuit} />;
  return <FreeMode onChangeMode={handleChangeMode} onSubmit={handleSubmit} onQuit={handleQuit} />;
}
