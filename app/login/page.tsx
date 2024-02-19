"use client"

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import { Button, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {

    const router = useRouter()

  return (
    <main className="relative min-h-screen w-screen bg-black">
      <Image src={"/images/authbg.jpg"} alt="bg" fill />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="h-fit w-[34rem] rounded-2xl bg-white flex flex-col p-[2rem] ">
          <h2 className="mt-[2rem] font-medium text-[1.5rem] ">
            Sign in to <span className="text-[#175CF6] cursor-pointer " onClick={() => router.push("/")}  >CreativeStudio</span>{" "}
          </h2>

          <div className="mt-[2rem] w-full space-y-8">
            <TextField
              id="outlined-basic"
              label="Email"
              type="email"
              variant="outlined"
              className="w-full"
            />
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              variant="outlined"
              className="w-full"
            />

            <p className="text-sm w-[22rem]">
              By continuing you agree to the{" "}
              <span className="text-[#175CF6] cursor-pointer ">Terms & Conditions</span> and
              <span className="text-[#175CF6] cursor-pointer "> Privacy Policy</span>
            </p>

            <ButtonSolid className="w-full h-[3rem]" title="Sign in" />

            <Button
              variant="outlined"
              color="inherit"
              className="w-full h-[3rem] "
              startIcon={<FcGoogle />}
            >
              <p className="normal-case font-bold">Sign in with Google</p>
            </Button>

            <p className="text-sm text-center">
              Not a member yet? <span onClick={() => router.push("/signup")} className="font-bold cursor-pointer ">Sign up now</span>{" "}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
