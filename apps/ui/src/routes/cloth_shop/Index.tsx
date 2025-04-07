import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaHatCowboySide, FaShoePrints, FaTshirt } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { PiPantsFill } from 'react-icons/pi';

interface Clothes {
  category: string;
  name: string;
  price: number;
  id: number;
}

type ClothesCategory = Record<string, Clothes[]>;

function Index(props?: { clothes?: Clothes[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBuyableCloth, setSelectedBuyableCloth] = useState<number>(0);
  const [menuStatus, setmenuStatus] = useState<boolean>(true);
  const [clothes] = useState(
    props?.clothes ? (Object.groupBy(props.clothes, (a) => a.category) as ClothesCategory) : {}
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.3 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const hiddenStyle = { display: 'none' };
  const visibleStyle = { display: 'block' };

  function toggleMenu(status: boolean) {
    setmenuStatus(status); // sorry for that i made toggleMenu false opens, and true closes menu
  }

  // altv data handlings

  useEffect(() => {
    const handleMenuStatus = (value: boolean) => {
      toggleMenu(value); // false opens, true closes the menu
    };

    alt.on('shop:cloth:menuStatus', handleMenuStatus);
    return () => {
      alt.off('shop:cloth:menuStatus', handleMenuStatus);
    };
  }, []);

  function buyItem(item: number) {
    if (selectedBuyableCloth == item) {
      alt.emit('shop:cloth:buyItem', item);
    } else {
      setSelectedBuyableCloth(item);
      alt.emit('shop:cloth:showcase', item);
    }
  }

  return (
    <>
      <div className={menuStatus ? 'opacity-100 transition-opac z-50 block' : 'opacity-0 transition-opac z-50 hidden'}>
        <div className="font">
          <div className="rounded-sm absolute top-[50vh] left-[50vh] -translate-x-1/2 -translate-y-1/2 p-4 z-10 flex w-[82vh] h-[80vh]">
            <div className="">
              <div className="ml-auto mr-auto pr-[0.8vh] w-fit">
                <h1 className="text-[2.6vh] text-fg-1 uppercase font-bold text-center ">Change your outfit</h1>
                <h3 className="text-[1.8vh] text-fg-1 w-[70%] mt-[-1vh] text-center ml-auto mr-auto">
                  Choose your clothes from the list
                </h3>
              </div>
              <div className="mt-[3vh] overflow-x-hidden pr-[0.8vh] max-h-[60vh]">
                <div className=" bg-bg-1/50 pt-[2vh] rounded-md overflow-hidden w-[30vh] text-[1.8vh]">
                  <h2 className="text-fg-1 uppercase mb-[2vh] text-center text-[1.8vh]">Categories</h2>
                  <motion.div>
                    {Object.keys(clothes).map((category) => (
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
                            {category === 'Shirts' && <FaTshirt />}
                            {category === 'Pants' && <PiPantsFill />}
                            {category === 'Head' && <FaHatCowboySide />}
                            {category === 'Shoes' && <FaShoePrints />}
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
                </div>
              </div>
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
                    {clothes[selectedCategory as keyof typeof clothes]?.map((item) => (
                      <motion.button
                        onClick={() => buyItem(item.id)}
                        key={item.name}
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
                            <p>{item.name} </p>
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

        <div className="z-10 absolute top-[10vh] right-[6vh] -translate-x-1/2 -translate-y-1/2 font text-[1.6vh] text-bg-1 uppercase bg-fg-1 text-fix rounded-md border-[0.5vh] border-bg-3/50">
          <p>esc</p>
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
      </div>
    </>
  );
}

export default Index;
