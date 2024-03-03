"use client";

import ButtonSolid from "@/components/ButtonSolid";
import CoverLoader from "@/components/CoverLoader";
import { registerNewUser } from "@/helpers/functions";
import { REGISTER } from "@/apollo/mutations/user";
import { useMutation } from "@apollo/client";
import { Alert, Button, LinearProgress, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoCheckmark } from "react-icons/io5";

const SignUp = () => {
  const router = useRouter();

  const [registerUser, { loading, error }] = useMutation(REGISTER);


  const [registerData, setRegisterData] = useState<any>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <main className="relative min-h-screen w-screen bg-black">
      <Image src={"/images/authbg.jpg"} alt="bg" fill />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="relative h-fit w-[34rem] overflow-hidden rounded-2xl bg-white flex flex-col p-[2rem] ">
          {loading && <CoverLoader />}
          {success && (
            <Alert
              className={`mb-2 `}
              icon={<IoCheckmark size={20} />}
              severity="success"
            >
              A Verification link has been sent to {registerData.email}. Please
              verify your email to continue.
            </Alert>
          )}

          {registrationError && (
            <Alert className={`mb-2 `} severity="error">
              {errorMessage}
            </Alert>
          )}

          <h2 className="font-medium text-[1.5rem] ">
            Sign up on{" "}
            <span
              className="text-[#175CF6] cursor-pointer"
              onClick={() => router.push("/")}
            >
              CreativeStudio
            </span>{" "}
          </h2>

          <form className="mt-[2rem] w-full space-y-8">
            <TextField
              id="outlined-basic"
              error={registrationError}
              label="Full Name"
              type="text"
              variant="outlined"
              className="w-full h-[2.5rem] "
              onChange={(e) =>
                setRegisterData({ ...registerData, fullName: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              error={registrationError}
              label="Username"
              type="text"
              variant="outlined"
              className="w-full h-[2.5rem] "
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              error={registrationError}
              label="Email"
              type="email"
              variant="outlined"
              className="w-full h-[2.5rem] "
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              error={registrationError}
              label="Password"
              type="password"
              variant="outlined"
              className="w-full h-[2.5rem] "
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            <p className="text-sm w-[22rem]">
              By continuing you agree to the{" "}
              <span className="text-[#175CF6] cursor-pointer ">
                Terms & Conditions
              </span>{" "}
              and
              <span className="text-[#175CF6] cursor-pointer ">
                {" "}
                Privacy Policy
              </span>
            </p>

            <ButtonSolid
              onClick={() =>
                registerNewUser(
                    registerData,
                    setSuccess,
                    setRegistrationError,
                    registerUser,
                  setErrorMessage,
                )
              }
              className="w-full h-[3rem]"
              title={"Create Account"}
            />

            <Button
              variant="outlined"
              color="inherit"
              className="w-full h-[3rem] "
              startIcon={<FcGoogle />}
            >
              <p className="normal-case font-bold">Sign up with Google</p>
            </Button>

            <p className="text-sm text-center">
              Already a memebr?{" "}
              <span
                onClick={() => router.push("/login")}
                className="font-bold cursor-pointer"
              >
                Sign in
              </span>{" "}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
