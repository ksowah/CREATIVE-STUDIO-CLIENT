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

  const navigateToArtDetails = () => {
    if(art?.artState === "auction") {
      router.push(`/art/auction/details/${art?._id}`)
    } else {
      router.push(`/art/details/${art?._id}`)
    }
  }

  return (
    <div
      onClick={navigateToArtDetails}
      className="relative group cursor-pointer mb-12 w-[20rem] h-[26rem]"
    >
      <div className="relative w-full h-[18rem]">
        <Image
          className="group-hover:scale-105 duration-500"
          src={art?.artPreview}
          fill
          style={{ objectFit: "contain" }}
          alt="card image"
        />
      </div>

      <div className="w-full mt-2 flex items-center justify-between">
        <div className="" >
          <p className="font-medium text-[1.2rem] line-clamp-1 ">
            {art?.title}
          </p>
          <p className="text-sm text-[#595862] line-clamp-1 ">
            {art?.artist.fullName}
          </p>

          <div className={`px-2 py-[2px] ${art?.artState === "auction" ? "bg-[#FF0000]" : art?.artState === "onSale" ? "bg-[#254AA5]" : "bg-[#343434]" } w-fit`} >
            <p className="text-white" >{art?.artState === "auction" ? "Auction" : art?.artState === "onSale" ? `₵${art?.price}` : "Gallery"}</p>
          </div>
        </div>
          <SessionAvatar image={art?.artist.avatar} size={50} />
      </div>
    </div>
  );
};

export default ArtCard;
