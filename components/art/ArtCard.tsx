import Image from "next/image";
import React from "react";
import SessionAvatar from "../SessionAvatar";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { FaRegComment } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {
  art: ArtPiece;
}

const ArtCard = ({ art }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/art/details/${art?._id}`)}
      className="relative group cursor-pointer mb-12 w-[20rem] h-[26rem]"
    >

      <div className="relative w-full h-[18rem]">
        {/* {imageLoading && (
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        )} */}
        <Image
          //   onLoad={() => setImageLoading(false)}
          className="group-hover:scale-105 duration-500"
          src={art?.artPreview}
          fill
          style={{ objectFit: "contain" }}
          alt="card image"
        />
      </div>

      <div className="w-full mt-4 flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <SessionAvatar image={art?.artist.avatar} size={40} />

          <p className="text-sm text-[#595862] line-clamp-1 ">
            {art?.artist.fullName}
          </p>
        </div>

        <div className="flex items-center justify-between" >
          <p className="font-medium text-[1.3rem] line-clamp-1 ">{art?.title}</p>
          <p>{art?.price} ₵</p>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
