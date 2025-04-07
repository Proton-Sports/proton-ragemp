import type { Mode } from './Index';
import Button from '../../lib/components/Button';

interface Props {
  onChangeMode: (mode: Mode) => void;
  onSubmit: () => void;
  onQuit: () => void;
}

export default function NormalMode({ onChangeMode, onSubmit, onQuit }: Props) {
  return (
    <div className="flex items-center h-screen ml-20">
      <div className="p-4 space-y-4 rounded-md bg-bg-1/60">
        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">1</p>
          </div>
          <p>Switch to start points</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">2</p>
          </div>
          <p>Switch to race points</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">Z</p>
          </div>
          <p>Place a point at current position</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">X</p>
          </div>
          <p>Delete last point</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">U</p>
          </div>
          <p>Increase current race point radius</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">N</p>
          </div>
          <p>Decrease current race point radius</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="font text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50 relative">
            <p className="absolute top-1/2 left-[1.45vh] -translate-x-1/2 -translate-y-1/2 ">M</p>
          </div>
          <p>Select a race point for moving</p>
        </div>

        <div className="space-x-2">
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
          <Button onClick={() => onChangeMode('free')}>Switch to free camera</Button>
          <Button onClick={onQuit}>Quit</Button>
        </div>
      </div>
    </div>
  );
}
