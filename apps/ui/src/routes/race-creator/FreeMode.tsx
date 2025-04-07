import Button from '../../lib/components/Button';
import type { Mode } from './Index';

interface Props {
  onChangeMode: (mode: Mode) => void;
  onSubmit: () => void;
  onQuit: () => void;
}

export default function FreeMode({ onChangeMode, onSubmit, onQuit }: Props) {
  return (
    <div className="flex items-center h-screen ml-20">
      <div className="p-4 space-y-4 rounded-md bg-bg-1/60">
        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">W</p>
          </div>
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">S</p>
          </div>
          <p>Move forward/backward</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">A</p>
          </div>
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">D</p>
          </div>
          <p>Move left/right</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-xs text-fix2 w-12 rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2">Space</p>
          </div>
          <div className="text-bg-1 uppercase bg-fg-1 text-xs text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">Ctrl</p>
          </div>
          <p>Move up/down</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-xs text-fix2 w-12 rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2">Shift</p>
          </div>
          <p>Speed up</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">1</p>
          </div>
          <p>Switch to start points</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">2</p>
          </div>
          <p>Switch to race points</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">LMB</p>
          </div>
          <p>Place a point at red dot</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">RMB</p>
          </div>
          <p>Delete current point</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">U</p>
          </div>
          <p>Increase current race point radius</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">N</p>
          </div>
          <p>Decrease current race point radius</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">M</p>
          </div>
          <p>Select a race point for moving</p>
        </div>

        <div className="space-x-2">
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
          <Button onClick={() => onChangeMode('normal')}>Switch to normal mode</Button>
          <Button onClick={onQuit}>Quit</Button>
        </div>
      </div>
    </div>
  );
}
