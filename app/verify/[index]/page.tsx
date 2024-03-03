"use client";

import { VERIFY_USER } from "@/apollo/mutations/user";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useEffect } from "react";

const VerifyUser = ({ params }: { params: any }) => {
  const [verifyUser, { loading, error }] = useMutation(VERIFY_USER);

  const userId = params?.index;


  const handleVerifyUser = async () => {
    try {
      const { data } = await verifyUser({
        variables: {
          userId,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, [params]);

  if (loading)
    return (
      <div className="flex flex-col items-center pt-[2rem] ">
        <p className="font-medium text-2xl cursor-pointer">CreativeStudio</p>

        <p className="mt-6">Your account is being verified...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center pt-[2rem] ">
      <p className="font-medium text-2xl cursor-pointer">CreativeStudio</p>

      <p className="mt-6">
        Your account has been verified successfully. Proceed to{" "}
        <Link href={"/login"}>
          <span className="cursor-pointer text-[#175CF6]">sign in</span>
        </Link>
      </p>
    </div>
  );
};

export default VerifyUser;
