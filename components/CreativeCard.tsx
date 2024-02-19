"use client"

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { FaRegComment } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"
import ProfileImage from "./ProfileImage";


interface Props {
    workImage: string;
    authourImage: string;
    authourName: string;
}

const CreativeCard = ({authourImage, authourName, workImage}:Props) => {

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        // set loading to false after 3 second
        setTimeout(() => setLoading(false), 3000)
      }, []);


    if (loading)
    return (
      <div
        className={`h-[18rem] w-[20rem] mb-12 ml-auto`}>
        <Skeleton variant="rectangular" width={"100%"} height={"70%"} />
        <div className="mt-4">
          <Skeleton />
          <Skeleton width="60%" />
        </div>
      </div>
    );


  return (
    <div onClick={() => router.push("/design/details")} className="group h-[18rem] cursor-pointer w-[20rem] rounded-md border shadow-md overflow-hidden mb-12">
      <div className="relative overflow-hidden w-full h-[14rem]">
        <Image className="group-hover:scale-125 duration-500" src={workImage} fill alt="card image" />
      </div>

      <div className="w-full h-[4rem] flex items-center justify-between px-4 ">
        <div className="flex items-center space-x-2">
    
          <ProfileImage dimension="h-[2.6rem] w-[2.6rem]" image={authourImage} />

          <p className="text-sm text-[#595862]">{authourName}</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex cursor-pointer items-center space-x-1" >
            <CiHeart size={20} color="#595862" />
            <p className="text-xs text-[#595862] " >3k</p>
          </div>

          <div className="flex cursor-pointer items-center space-x-1" >
            <TfiSave size={16} color="#595862" />
            <p className="text-xs text-[#595862] " >50</p>
          </div>

          <div className="flex cursor-pointer items-center space-x-1" >
            <FaRegComment size={20} color="#595862" />
            <p className="text-xs text-[#595862] " >2k</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreativeCard;
