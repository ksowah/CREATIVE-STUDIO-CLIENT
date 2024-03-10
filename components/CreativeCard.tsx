"use client"

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { FaRegComment } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"
import ProfileImage from "./ProfileImage";
import SessionAvatar from "./SessionAvatar";


interface Props {
    workImage: string;
    authourImage: string;
    authourName: string;
    designId: string;
}

const CreativeCard = ({authourImage, authourName, workImage, designId}:Props) => {

    const router = useRouter();

    const [imageLoading, setImageLoading] = useState(true)

  return (
    <div onClick={() => router.push(`/design/details/${designId}`)} className="group h-[18rem] cursor-pointer w-[20rem] rounded-md border shadow-md overflow-hidden mb-12">
      <div className="relative overflow-hidden w-full h-[14rem]">
        {
            imageLoading && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        }
        <Image onLoad={() => setImageLoading(false)} className="group-hover:scale-125 duration-500" src={workImage} style={{objectFit:"cover"}} fill alt="card image" />
      </div>

      <div className="w-full h-[4rem] flex items-center justify-between px-4 ">
        <div className="flex items-center space-x-2">
    
          <SessionAvatar image={authourImage} size={40}  />

          <p className="text-sm text-[#595862] line-clamp-1 ">{authourName}</p>
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
