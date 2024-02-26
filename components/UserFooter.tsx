import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";
import { IoMdPaperPlane } from "react-icons/io";
import Footer from "./Footer";
import ProfileImage from "./ProfileImage";
import SessionAvatar from "./SessionAvatar";
import Link from "next/link";

interface Props {
  image: string;
  name: string;
  designerUsername: string;
  specialization?: string;
}

const UserFooter = ({
  image,
  name,
  designerUsername,
  specialization,
}: Props) => {
  return (
    <div className="w-full border-t mt-[18rem] flex flex-col items-center ">
      <div className="w-[16rem] h-[10rem] bg-white -mt-[5rem] flex items-center justify-center ">
        <SessionAvatar image={image} size={135} />
      </div>

      <p className="font-medium text-[2rem] mt-8 ">{name}</p>
      <p className="text-[#595862] text-center my-4 ">
        {specialization || "Product Designer"}
      </p>

      <Link
        className="flex flex-col items-center"
        href={`/profile/${designerUsername}`}
      >
        <Button
          variant="outlined"
          color="inherit"
          className="w-[12rem] h-[4rem] mt-[2rem] rounded-full "
          startIcon={<IoMdPaperPlane />}
        >
          <p className="normal-case font-bold">Get in touch</p>
        </Button>
      </Link>

      <Footer noborder />
    </div>
  );
};

export default UserFooter;
