import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";
import { IoMdPaperPlane } from "react-icons/io";
import Footer from "./Footer";
import ProfileImage from "./ProfileImage";

const UserFooter = () => {
  return (
    <div className="w-full border-t mt-[18rem] flex flex-col items-center ">
      <div className="w-[16rem] h-[10rem] bg-white -mt-[5rem] flex items-center justify-center ">
        <ProfileImage dimension="w-[8rem] h-[8rem]" image="/images/kev.jpg" />
      </div>

      <p className="font-medium text-[2rem] mt-8 ">Paul Isreal Dunyo</p>
      <p className="text-[#595862] text-center my-4 ">
        Freelance Logo & Brand Identity Designer
      </p>

      <Button
        variant="outlined"
        color="inherit"
        className="w-[12rem] h-[4rem] mt-[2rem] rounded-full "
        startIcon={<IoMdPaperPlane />}
      >
        <p className="normal-case font-bold">Get in touch</p>
      </Button>

      <Footer noborder />
    </div>
  );
};

export default UserFooter;
