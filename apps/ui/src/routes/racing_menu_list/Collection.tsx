import type React from 'react';

export default function Collection() {
  return (
    <div className="fixed p-8 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="flex gap-8">
        <Option
          onClick={() => {
            alt.emit('race-menu-collection.option.change', 'cars');
          }}
        >
          Cars
        </Option>
        <Option
          onClick={() => {
            alt.emit('race-menu-collection.option.change', 'clothes');
          }}
        >
          Clothes
        </Option>
      </div>
    </div>
  );
}

const Option = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  return (
    <button
      type="button"
      className="w-48 h-24 rounded-md text-center content-center bg-bg-2 border border-bg-border fugaz uppercase transition duration-75 ease-in-out hover:bg-bg-hover"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
