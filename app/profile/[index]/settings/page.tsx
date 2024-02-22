"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Header from "@/components/Header";
import SessionAvatar from "@/components/SessionAvatar";
import SettingsContainer from "@/components/SettingsContainer";
import { MyContext } from "@/context/Context";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const Settings = () => {
  

  return (
    <div className="bg-[#F3F3F3] ">
      <Header />
      <Container>
        <SettingsContainer>
          <div className="">
            <h2 className="font-medium text-[1.6rem] ">Edit Profile</h2>

            <div className="flex items-center mt-6 space-x-8 ">
              <SessionAvatar image="" size={170} />

              <div className="flex items-center space-x-4">
                <ButtonSolid className="w-[8rem] " title="Change Photo" />

                <ButtonOutlined className="w-[8rem]" title="Delete" />
              </div>
            </div>

            <div className="py-[4rem] space-y-6 ">
              <div>
                <p className="text-md font-medium mb-2 "> Full Name </p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-md font-medium mb-2"> Full Name </p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-md font-medium mb-2"> Full Name </p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </SettingsContainer>
      </Container>

      <div className="h-[22rem] "></div>
    </div>
  );
};

export default Settings;
