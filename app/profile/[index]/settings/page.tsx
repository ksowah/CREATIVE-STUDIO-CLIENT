"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
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
                  placeholder="Kelvin Sowah"
                />
              </div>
              <div>
                <p className="text-md font-medium mb-2">Specialization</p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="w-full"
                  placeholder="Product Designer"
                />
              </div>
              <div>
                <p className="text-md font-medium mb-2">Bio</p>
                <TextField
                  id="outlined-basic"
                  multiline
                  rows={5}
                  variant="outlined"
                  className="w-full"
                />
              </div>

              <div className="pt-10 space-y-6">
                <h3 className="font-medium text-[1.2rem] ">Contact Info</h3>

                <div>
                  <p className="text-md font-medium mb-2">Phone Number</p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    type="tel"
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2">Email</p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    type="email"
                  />
                </div>
              </div>

              <div className="pt-10 space-y-6">
                <h3 className="font-medium text-[1.2rem] ">Links</h3>

                <div>
                  <p className="text-md font-medium mb-2">Portfolio Website</p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    type="url"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-end pb-6 " >
                <ButtonSolid title="Save Changes" />
            </div>
          </div>
        </SettingsContainer>

        <Footer />
      </Container>

    </div>
  );
};

export default Settings;
