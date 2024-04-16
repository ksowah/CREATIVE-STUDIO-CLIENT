"use client";

import Container from "./Container";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonOutlined from "./ButtonOutlined";
import ButtonSolid from "./ButtonSolid";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/Context";
import SessionAvatar from "./SessionAvatar";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Tooltip } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import Image from "next/image";
import { RiMenu2Line } from "react-icons/ri";
import SideMenu from "./SideMenu";
import { IoMdClose } from "react-icons/io";

const Header = () => {
  const pathname = usePathname();

  const { appState } = useContext(MyContext);

  const { data, loading, refetch } = useQuery(GET_CART_ITEMS);

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const user = appState.session;

  const numberOfItems = data?.getCartItems.length;

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="w-full">
      <div className={`${isOpenMenu ? "fixed" : "absolute"} w-full h-[5rem] bg-white z-50`}>
        <Container>
          <div className="w-full h-full flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              {isOpenMenu ? (
                <IoMdClose  onClick={()=>setIsOpenMenu(false)} className="xl:hidden" size={22} />
              ) : (
                <RiMenu2Line
                  onClick={() => setIsOpenMenu(true)}
                  className="xl:hidden"
                  size={20}
                />
              )}
              <Link href={"/"}>
                <p className="font-medium text-xl lg:text-2xl cursor-pointer">
                  CreativeStudio
                </p>
              </Link>
            </div>

            <div className="hidden xl:flex flex-1 px-[4rem] space-x-6">
              <ul className="flex items-center space-x-6 text-sm ">
                <Link href={"/art"}>
                  <li
                    className={`cursor-pointer ${
                      pathname.includes("/art") && "font-bold"
                    } `}
                  >
                    Art Store
                  </li>
                </Link>
                <li className="cursor-pointer">Explore</li>
                <Link href={"/subscription"}>
                  <li
                    className={`cursor-pointer ${
                      pathname.includes("/subscription") && "font-bold"
                    } `}
                  >
                    Free + premium
                  </li>
                </Link>
                {user && (
                  <Link href={"/wallet"}>
                    <li
                      className={`cursor-pointer ${
                        pathname.includes("/wallet") && "font-bold"
                      } `}
                    >
                      Wallet
                    </li>
                  </Link>
                )}
              </ul>

              <div className="flex items-center space-x-2">
                <CiSearch size={20} color="gray" />
                <input
                  type="text"
                  placeholder="search for creative designs"
                  className="text-sm w-[16rem] outline-none border-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Tooltip title="Auction room">
                <Link href={"/art/auctionroom"}>
                  <div className="hidden lg:flex h-[2.6rem] w-[2.6rem] cursor-pointer border rounded-md items-center justify-center  ">
                    <Image
                      src={"/icons/hammer.svg"}
                      alt=""
                      height={20}
                      width={20}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </Link>
              </Tooltip>

              <Tooltip title="Your cart">
                <Link
                  href={"/art/cart"}
                  className="hidden lg:flex relative h-[2.6rem] cursor-pointer w-[2.6rem] border rounded-md items-center justify-center"
                >
                  {user && data?.getCartItems.length > 0 && (
                    <div className="absolute -top-2 -right-2 px-[6px]  flex items-center justify-center rounded-full bg-black ">
                      <p className="text-white text-[11px]">{numberOfItems}</p>
                    </div>
                  )}
                  <MdOutlineShoppingCart size={20} />
                </Link>
              </Tooltip>

              {user ? (
                <Link href={`/profile/${user?.username}`}>
                  <div className="cursor-pointer">
                    <SessionAvatar image={user?.avatar} size={45} />
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href={"/login"}>
                    <ButtonOutlined
                      className="hidden md:flex lg:w-[7rem] lg:h-[2.8rem]"
                      title="Log in"
                    />
                  </Link>

                  <Link href={"/signup"}>
                    <ButtonSolid
                      title="Join"
                      className="lg:w-[7rem] lg:h-[2.8rem] "
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      <SideMenu setIsOpen={setIsOpenMenu} isOpen={isOpenMenu} />
    </div>
  );
};

export default Header;
