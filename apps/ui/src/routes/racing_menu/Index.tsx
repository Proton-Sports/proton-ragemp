import { useState, useEffect } from 'react';

export default function Index() {
  const [menuOn, setMenuOn] = useState(true);

  useEffect(() => {
    const handleMenuStatus = (status: boolean) => {
      setMenuOn(status); // true for open, false for close
    };

    alt.on('racing:racingMenu:menu', handleMenuStatus);

    return () => {
      alt.off('racing:racingMenu:menu', handleMenuStatus);
    };
  }, []);

  return (
    <>
      <div
        className={`w-fit font container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${
          menuOn ? 'opacity-100 delay-200' : 'opacity-0'
        }`}
      >
        <div className="flex ml-auto mr-auto">
          <div className="">
            <div className="mb-2 space-x-8">
              <button>Button</button>
              <button>Button</button>
              <button>Button</button>
              <button>Button</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
              <div className="h-32 bg-black w-60">Card</div>
            </div>
          </div>
        </div>
      </div>

      <div className={menuOn ? 'lights opacity-100 transition-opacity' : 'opacity-0 transition-opacity'}>
        <div className="bg-light">.</div>
        <div className="bg-light2">.</div>
        <div className="bg-light3">.</div>
        <div className="bg-light4">.</div>
      </div>
    </>
  );
}
