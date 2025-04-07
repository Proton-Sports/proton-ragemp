import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTshirt } from 'react-icons/fa';
import { PiPantsFill } from 'react-icons/pi';
import { FaHatCowboySide } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { BiSolidPurchaseTag } from 'react-icons/bi';

interface Buy {
  Name: string;
  id: number;
  ItemName: string;
}

interface Vehicle {
  id: number;
  displayname: string;
  price: number;
  itemname: string;
  category: string;
}

interface Vehicle2 {
  id: number;
  displayName: string;
  price: number;
  itemName: string;
  category: string;
}

type VehicleCategory = Record<string, Vehicle[]>;

function Index({ vehicles }: { vehicles: Vehicle2[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOwnedCategory, setSelectedOwnedCategory] = useState<string | null>(null);
  const [menuStatus, setmenuStatus] = useState<boolean>(true);
  const [category] = useState(
    Object.groupBy(
      vehicles.map((a) => ({
        id: a.id,
        displayname: a.displayName,
        price: a.price,
        itemname: a.itemName,
        category: a.category,
      })),
      (a) => a.category
    ) as VehicleCategory
  );
  // const [category, setCategory] = useState<VehicleCategory>({
  //   Sports: [
  //     {
  //       displayname: 'Comet',
  //       id: 1,
  //       itemname: 'comet2',
  //       price: 1400,
  //       category: 'sport',
  //     },
  //     {
  //       displayname: 'Elegy',
  //       id: 1,
  //       itemname: 'elegy',
  //       price: 1400,
  //       category: 'sport',
  //     },
  //     {
  //       displayname: 'Buffalo',
  //       id: 1,
  //       itemname: 'buffalo',
  //       price: 1400,
  //       category: 'sport',
  //     },
  //   ],
  //   Sedans: [
  //     {
  //       displayname: 'ABC',
  //       id: 1,
  //       itemname: 'abc',
  //       price: 1400,
  //       category: 'sport',
  //     },
  //   ],
  //   SUVs: [
  //     {
  //       displayname: 'ABC',
  //       id: 1,
  //       itemname: 'abc',
  //       price: 1400,
  //       category: 'sport',
  //     },
  //   ],
  // });
  const [ownedCategory, setOwnedCategory] = useState<VehicleCategory>({});

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
    setSelectedOwnedCategory(null);
  };

  const handleOwnedCategoryClick = (category: string) => {
    setSelectedOwnedCategory((prevCategory) => (prevCategory === category ? null : category));
    setSelectedCategory(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.3 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const hiddenStyle = { display: 'none' };
  const visibleStyle = { display: 'block' };

  const [buyVehicleSelected, setbuyVehicleSelected] = useState<boolean>(false);
  const [selectedBuyItem, setSelectedBuyItem] = useState<Buy>();
  const [selectedColor, setSelectedColor] = useState<number>(0);
  function buySelectItem() {
    alt.emit('shop:vehicles:buyVehicle', selectedBuyItem?.ItemName, selectedColor);
  }

  function selectItem(Name: string, id: number, ItemName: string) {
    setbuyVehicleSelected(true);
    setSelectedBuyItem({ Name, id, ItemName });
    const element = document.getElementById('hide-display') as HTMLElement;

    if (element) {
      element.style.display = 'block';
    }
    console.log(Name, id, ItemName);
    alt.emit('shop:select:vehicle', ItemName);
  }

  function closeSelectItem() {
    setbuyVehicleSelected(false);
    const element = document.getElementById('hide-display') as HTMLElement;
    setTimeout(() => {
      if (element) {
        element.style.display = 'none';
      }
    }, 500);
  }

  // altv handlers

  useEffect(() => {
    const toggleMenuStatus = (value: boolean) => {
      setmenuStatus(value);
      //toggleMenu(value); // sorry for that I made toggleMenu false opens, and true closes the menu
    };

    const handleOwnedVehicles = (data: string) => {
      setOwnedCategory(JSON.parse(data));
    };

    alt.on('shop:vehicles:menuStatus', toggleMenuStatus);
    alt.on('shop:vehicles:ownedVehicles', handleOwnedVehicles);

    alt.emit('shop:vehicles:ready');

    return () => {
      alt.off('shop:vehicles:menuStatus', toggleMenuStatus);
      alt.off('shop:vehicles:ownedVehicles', handleOwnedVehicles);
    };
  }, [setmenuStatus]);

  function choosenColor(color: number) {
    alt.emit('shop:vehicles:choosenColor', color);
    setSelectedColor(color);
  }

  /*
  Function for testing dynamic data recieving

  function test() {
    console.log('runs')
    setVehicles({
      Sports: [{ displayname: 'Comet', Id: 1, ItemName: 'comet2', Price: '1400', Category: 'Sport' }],
    });

    setOwnedVehicles({
      Sports: [{ displayname: 'Comet', Id: 1, ItemName: 'comet2', Price: '1400', Category: 'Sport' }],
    });

    // <button onClick={() => test()}>Test</button>
  }

  */

  return (
    <>
      <div
        className={
          menuStatus ? 'opacity-100 transition-opacity z-50 block' : 'opacity-0 transition-opacity z-50 hidden'
        }
      >
        <div className="font">
          <div className="rounded-sm absolute top-[50vh] left-[50vh] -translate-x-1/2 -translate-y-1/2 p-4 z-10 flex w-[82vh] h-[80vh]">
            <div className="">
              <div className="ml-auto mr-auto pr-[0.8vh] w-fit">
                <h1 className="text-[2.6vh] text-fg-1 uppercase font-bold text-center ">Buy new vehicle</h1>
                <h3 className="text-[1.8vh] text-fg-1 w-[70%] mt-[-1vh] text-center ml-auto mr-auto">
                  Choose your vehicle from the list
                </h3>
              </div>
              <div className="mt-[3vh] overflow-x-hidden pr-[0.8vh] max-h-[60vh]">
                <div className=" bg-bg-1/50 pt-[2vh] rounded-md overflow-hidden w-[30vh] text-[1.8vh]">
                  <h2 className="text-fg-1 uppercase mb-[2vh] text-center text-[1.8vh]">Categories</h2>
                  <motion.div>
                    {Object.keys(category).map((category) => (
                      <motion.button
                        key={category}
                        className={`w-full hover:bg-bg-1/60 transition-colors ${
                          selectedCategory === category ? 'bg-bg-1/60' : ''
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <motion.div
                          className={`text-fg-1 flex items-center bg-bg-1/60 p-[1.2vh] border-b-[0.01vh] border-b-fg-2/10 w-full ${
                            selectedCategory === category ? 'bg-bg-1/60' : ''
                          }`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="items-center flex mr-auto space-x-[0.8vh]">
                            <p>{category} </p>
                          </div>
                          <div className="ml-auto">
                            <IoIosArrowForward
                              style={{
                                transform: selectedCategory === category ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </div>
                        </motion.div>
                      </motion.button>
                    ))}
                  </motion.div>

                  {ownedCategory && (
                    <motion.div>
                      <h2 className="text-fg-1 mb-[1.6vh] text-center mt-[2vh] text-[1.8vh]">Already owned vehicles</h2>
                      {Object.keys(ownedCategory).map((category) => (
                        <motion.button
                          key={category}
                          className={`w-full hover:bg-bg-1/60 transition-colors ${
                            selectedOwnedCategory === category ? 'bg-bg-1/60' : ''
                          }`}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOwnedCategoryClick(category)}
                        >
                          <motion.div
                            className={`text-fg-1 flex items-center bg-bg-1/60 p-[1.2vh] border-b-[0.01vh] border-b-fg-2/10 w-full ${
                              selectedOwnedCategory === category ? 'bg-bg-1/60' : ''
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="items-center flex mr-auto space-x-[0.8vh]">
                              <p>{category} </p>
                              {category === 'Shirts' && <FaTshirt />}
                              {category === 'Pants' && <PiPantsFill />}
                              {category === 'Hats' && <FaHatCowboySide />}
                            </div>
                            <div className="ml-auto">
                              <IoIosArrowForward
                                style={{
                                  transform: selectedOwnedCategory === category ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease',
                                }}
                              />
                            </div>
                          </motion.div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-[11.3vh] overflow-x-hidden pr-[0.8vh] max-h-[60vh]">
              <motion.div
                className="bg-bg-1/50 pt-[2vh] rounded-md overflow-hidden w-[30vh] text-[1.8vh] h-fit ml-[2vh]"
                initial="hidden"
                animate={selectedOwnedCategory ? 'visible' : 'hidden'}
                exit="hidden"
                variants={containerVariants}
                style={selectedOwnedCategory ? visibleStyle : hiddenStyle}
              >
                {selectedOwnedCategory && (
                  <motion.div>
                    <motion.h2
                      className="text-fg-1 uppercase mb-[2vh] text-center text-[1.8vh]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ ease: 'easeInOut', duration: 0.3 }}
                    >
                      {selectedOwnedCategory}
                    </motion.h2>
                    {ownedCategory[selectedOwnedCategory as keyof typeof ownedCategory]?.map((item) => (
                      <motion.button
                        key={item.displayname}
                        className={`w-full hover:bg-bg-1/60 transition-colors`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`text-fg-1 flex items-center bg-bg-1/60 p-[1.2vh] border-b-[0.01vh] border-b-fg-2/10 w-full`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{
                            ease: 'easeInOut',
                            duration: 0.3,
                            delay: 0.1,
                          }}
                        >
                          <div className="items-center flex mr-auto space-x-[0.8vh]">
                            <p>{item.displayname}</p>
                          </div>
                          <div className="ml-auto text-[2vh]">
                            <p>
                              <IoIosCheckmarkCircle />
                            </p>
                          </div>
                        </motion.div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="mt-[11.3vh] overflow-x-hidden pr-[0.8vh] max-h-[60vh]">
              <motion.div
                className="bg-bg-1/50 pt-[2vh] rounded-md overflow-hidden w-[30vh] text-[1.8vh] h-fit ml-[2vh]"
                initial="hidden"
                animate={selectedCategory ? 'visible' : 'hidden'}
                exit="hidden"
                variants={containerVariants}
                style={selectedCategory ? visibleStyle : hiddenStyle}
              >
                {selectedCategory && (
                  <motion.div>
                    <motion.h2
                      className="text-fg-1 uppercase mb-[2vh] text-center text-[1.8vh]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ ease: 'easeInOut', duration: 0.3 }}
                    >
                      {selectedCategory}
                    </motion.h2>
                    {category[selectedCategory as keyof typeof category]?.map((item) => (
                      <motion.button
                        onClick={() => selectItem(item.displayname, item.id, item.itemname)}
                        key={item.id}
                        className={`w-full hover:bg-bg-1/60 transition-colors`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`text-fg-1 flex items-center bg-bg-1/60 p-[1.2vh] border-b-[0.01vh] border-b-fg-2/10 w-full`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{
                            ease: 'easeInOut',
                            duration: 0.3,
                            delay: 0.1,
                          }}
                        >
                          <div className="items-center flex mr-auto space-x-[0.8vh]">
                            <p>{item.displayname}</p>
                          </div>
                          <div className="ml-auto text-[1.3vh]">
                            <p>{item.price}$</p>
                          </div>
                        </motion.div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="font z-10 absolute top-[10vh] right-[6vh] -translate-x-1/2 -translate-y-1/2 font text-[1.6vh] text-bg-1  uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50">
          <p>esc</p>
        </div>

        <div className="bottom-[8vh] right-[10vh] fixed text-bg-1 font">
          <div
            className={buyVehicleSelected ? 'opacity-100 transition-opacity' : 'opacity-0 transition-opacity'}
            id="hide-display"
          >
            <div className="flex">
              <div className="mr-[3vh] flex items-center space-x-[1vh] bg-bg-1/60 p-[1vh] pl-[2vh] pr-[2vh] rounded-sm uppercase text-fg-1 text-[1.6vh]">
                <p>Pick a color</p>

                <button
                  type="button"
                  className="bg-[rgb(255_255_246)] w-[2.6vh] h-[2.6vh] rounded-full"
                  onClick={() => choosenColor(111)}
                >
                </button>
                <button
                  type="button"
                  className="bg-[rgb(188_25_23)] w-[2.6vh] h-[2.6vh] rounded-full"
                  onClick={() => choosenColor(150)}
                >
                </button>
                <button
                  type="button"
                  className="bg-[rgb(66_113_225)] w-[2.6vh] h-[2.6vh] rounded-full"
                  onClick={() => choosenColor(80)}
                >
                </button>
                <button
                  type="button"
                  className="bg-[rgb(241_204_64)] w-[2.6vh] h-[2.6vh] rounded-full"
                  onClick={() => choosenColor(126)}
                >
                </button>
                <button
                  type="button"
                  className="bg-[rgb(131_197_102)] w-[2.6vh] h-[2.6vh] rounded-full"
                  onClick={() => choosenColor(125)}
                >
                </button>
              </div>
              <div className="space-x-[1.4vh] text-[2vh]  bg-bg-1/60 p-[1vh] pl-[2vh] pr-[2vh] rounded-sm">
                <button className="bg-green-500 p-[1vh] rounded-sm" onClick={() => buySelectItem()}>
                  <BiSolidPurchaseTag />
                </button>
                <button className="bg-red-500 p-[1vh] rounded-sm" onClick={() => closeSelectItem()}>
                  <IoClose />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={menuStatus ? 'opacity-100 transition-opac-bulbs block' : 'opacity-0 transition-opac-bulbs hidden'}
      >
        <div className="light-bulb">
          <p>.</p>
        </div>
        <div className="light-bulb2">
          <p>.</p>
        </div>

        <div className="light-bulb3">
          <p>.</p>
        </div>

        <div className="background"></div>
      </div>
    </>
  );
}

export default Index;
