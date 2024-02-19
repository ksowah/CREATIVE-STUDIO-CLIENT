"use client"

import Container from "./Container";
import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonOutlined from "./ButtonOutlined";
import ButtonSolid from "./ButtonSolid";

const Header = () => {

    const router = useRouter()

  return (
    <div className="absolute w-full h-[5rem] bg-white z-50">
      <Container>
        <div className="w-full h-full flex items-center">
          <Link href={"/"}>
            <p className="font-medium text-2xl cursor-pointer">
              CreativeStudio
            </p>
          </Link>

          <div className="flex flex-1 px-[4rem] space-x-6">
            <ul className="flex items-center space-x-6 text-sm ">
              <li className="cursor-pointer">Explore</li>
              <li className="cursor-pointer">Free + premium</li>
              <li className="cursor-pointer">Auction</li>
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
            <ButtonOutlined onClick={() => router.push("/login")} className="w-[7rem] h-[2.8rem]" title="Log in" />
           
            <ButtonSolid onClick={() => router.push("/signup")} title="Join" className="w-[7rem] h-[2.8rem] " />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
