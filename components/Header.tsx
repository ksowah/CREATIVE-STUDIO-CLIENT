"use client";

import Container from "./Container";
import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ButtonOutlined from "./ButtonOutlined";
import ButtonSolid from "./ButtonSolid";
import ProfileImage from "./ProfileImage";
import { useContext, useState } from "react";
import { MyContext } from "@/context/Context";
import SessionAvatar from "./SessionAvatar";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Badge, Tooltip } from "@mui/material";
import { ImHammer2 } from "react-icons/im";


const Header = () => {
  const router = useRouter();

  const pathname = usePathname();

  const { appState, setAppState } = useContext(MyContext);

  const user = appState.session;

  return (
    <div className="absolute w-full h-[5rem] bg-white z-40">
      <Container>
        <div className="w-full h-full flex items-center">
          <Link href={"/"}>
            <p className="font-medium text-2xl cursor-pointer">
              CreativeStudio
            </p>
          </Link>

          <div className="flex flex-1 px-[4rem] space-x-6">
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
              <li className="cursor-pointer">Free + premium</li>
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
              <Link href={"/art/auctionroom"} >
                <div className="h-[2.6rem] w-[2.6rem] cursor-pointer border rounded-md flex items-center justify-center  ">
                  <ImHammer2 size={20} />
                </div>
              </Link>
            </Tooltip>

            <Link
              href={"/art/cart"}
              className="h-[2.6rem] cursor-pointer w-[2.6rem] border rounded-md flex items-center justify-center  "
            >
              <MdOutlineShoppingCart size={20} />
            </Link>

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
                    className="w-[7rem] h-[2.8rem]"
                    title="Log in"
                  />
                </Link>

                <Link href={"/signup"}>
                  <ButtonSolid title="Join" className="w-[7rem] h-[2.8rem] " />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
