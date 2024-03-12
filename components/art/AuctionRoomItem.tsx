"use client";

import Image from "next/image";
import { FaRegCalendar } from "react-icons/fa";
import SessionAvatar from "../SessionAvatar";
import { useRouter } from "next/navigation";

const AuctionRoomItem = ({ group }: { group: any }) => {
  const router = useRouter();

  const Item = ({ art }: { art: ArtPiece }) => {
    return (
      <div className="p-6 pt-0 ">
        <div className="px-[1rem]">
          <div className="h-[10rem] flex overflow-hidden rounded-2xl flex-1 bg-white ">
            <div className="relative h-full w-[10rem] ">
              <Image
                src={art?.artPreview}
                fill
                style={{ objectFit: "cover" }}
                alt=""
              />
            </div>

            <div className="flex flex-1 h-full px-[1rem] py-[.6rem] ">
              <div className="h-full flex-1 flex flex-col text-sm justify-around">
                <p className="text-[#5C5B66] text-[1rem] font-medium">
                  {art?.title}
                </p>

                <p className="text-[#5C5B66] ">Dimention: {art?.dimensions}</p>

                <div className="flex items-center space-x-6">
                  <p className="text-[#5C5B66]">Starting at: </p>
                  <div className="h-[2rem] flex items-center justify-center px-4 rounded-md bg-[#DEDDDF] ">
                    <p className="text-sm">${art?.auctionStartPrice}</p>
                  </div>
                </div>
              </div>

              <div className="h-full flex flex-col items-end justify-around ">
                <div className="flex items-center space-x-2">
                  <SessionAvatar image={art?.artist.avatar} size={30} />
                  <p className="text-[#5C5B66] text-sm">
                    {art?.artist.fullName}
                  </p>
                </div>

                <div
                  onClick={() =>
                    router.push(`/art/auction/details/${art?._id}`)
                  }
                  className="h-[3rem] cursor-pointer flex items-center justify-center px-4 rounded-md bg-[#DEDDDF] hover:bg-[#cccad1] "
                >
                  <Image
                    src={"/icons/hammer.svg"}
                    alt=""
                    height={20}
                    width={20}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="flex items-center space-x-6 w-[16rem] mt-[2rem] h-[4rem] bg-[#dedddf] rounded-l-lg overflow-hidden ">
        <div className="h-full w-[5rem] flex items-center justify-center bg-black ">
          <FaRegCalendar color="#fff" size={30} />
        </div>

        <p className="font-medium text-[1.2rem] ">
          {group[0] === "active"
            ? "LIVE"
            : group[0] === "today"
            ? "TODAY"
            : group[0] === "tomorrow"
            ? "TOMORROW"
            : group[0]}
        </p>
      </div>

      <div className="flex-1 py-[2rem] bg-[#dedddf] ">
        {group[1].map((item: ArtPiece, idx: number) => (
          <Item art={item} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default AuctionRoomItem;
