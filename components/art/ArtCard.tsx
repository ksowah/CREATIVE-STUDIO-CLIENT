import Image from "next/image";
import React, { useState } from "react";
import SessionAvatar from "../SessionAvatar";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
import { Skeleton } from "@mui/material";

interface Props {
  art: ArtPiece;
}

const ArtCard = ({ art }: Props) => {
  const router = useRouter();

  const [imageLoading, setImageLoading] = useState(true);

  const navigateToArtDetails = () => {
    if (art?.artState === "auction") {
      router.push(`/art/auction/details/${art?._id}`);
    } else {
      router.push(`/art/details/${art?._id}`);
    }
  };

  return (
    <div
      onClick={navigateToArtDetails}
      className="relative group cursor-pointer mb-12 w-[20rem] "
    >
      {art?.artState === "onSale" ? (
        <Image
          src={"/icons/buy.svg"}
          alt=""
          height={60}
          width={60}
          style={{ objectFit: "contain" }}
          className="z-20 absolute top-0 right-0"
        />
      ) : art?.artState === "auction" ? (
        <Image
          src={"/icons/auction.svg"}
          alt=""
          height={60}
          width={60}
          style={{ objectFit: "contain" }}
          className="z-20 absolute top-0 right-0"
        />
      ) : (
        <></>
      )}
      <div className="relative w-full overflow-hidden flex flex-col items-end">
        {imageLoading && (
          <Skeleton className="absolute top-0 bottom-0 left-0 right-0" variant="rectangular" width={"100%"} height={320} />
        )}
        <Image
          onLoad={() => setImageLoading(false)}
          className="group-hover:scale-105 duration-500"
          src={art?.artPreview}
          height={288}
          width={320}
          style={{ objectFit: "contain" }}
          alt="card image"
        />
      </div>

      <div className="w-full mt-2 flex items-center justify-between">
        <div className="">
          <p className="font-medium text-[.9rem] line-clamp-1 ">
            {art?.title} | {art?.dimensions}
          </p>
          <p className="text-sm text-[#595862] line-clamp-1 ">
            {art?.artist.fullName}
          </p>

          {art?.artState === "onSale" ? (
            <p className="text-[14px] text-[#595862] ">${art?.price}</p>
          ) : art?.artState === "auction" ? (
            <div className="flex items-center space-x-1">
              <Image
                src={"/icons/hammer.svg"}
                alt=""
                height={14}
                width={14}
                style={{ objectFit: "contain" }}
              />
              <p className="text-[14px] text-[#595862] ">
                ${art?.auctionStartPrice}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <IoEyeOutline color="#595862" size={16} />
              <p className="text-[14px] text-[#595862] ">SHOWCASE</p>
            </div>
          )}
        </div>
        <SessionAvatar image={art?.artist.avatar} size={50} />
      </div>
    </div>
  );
};

export default ArtCard;
