"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import { GoThumbsup } from "react-icons/go";
import { TfiSave } from "react-icons/tfi";
import { FaRegComment } from "react-icons/fa";
import SliderComponent from "@/components/SliderComponent";
import UserFooter from "@/components/UserFooter";
import ProfileImage from "@/components/ProfileImage";
import { useQuery } from "@apollo/client";
import { GET_DESIGN_BY_ID } from "@/queries/designs";
import SessionAvatar from "@/components/SessionAvatar";

const DesignDetails = ({ params }: { params: any }) => {

  const designId = params?.index;

  const { loading, error, data } = useQuery(GET_DESIGN_BY_ID, {
    variables: { designId },
  });

  const designDetails = data?.getDesignById;

  const designImages: any = [
    ...(designDetails?.preview ? [designDetails.preview] : []),
    ...(designDetails?.designImages || [])
  ];

  console.log("designImages >>>", designImages);

  return (
    <div className="w-ful">
      <Header />

      <Container>
        <div className="w-full flex space-x-6 items-center mt-[4rem] py-[6rem] ">
            
          <SessionAvatar image={designDetails?.designer.avatar} size={70} />

          <div className="flex-1">
            <h3 className="font-medium text-xl">{designDetails?.title}</h3>
            <p className="text-[#595862] text-xs cursor-pointer ">
              {designDetails?.designer.fullName} · Follow{" "}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
              <GoThumbsup size={22} color="#595862" />
            </button>

            <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
              <TfiSave size={18} color="#595862" />
            </button>

            <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
              <FaRegComment size={22} color="#595862" />
            </button>
          </div>
        </div>

        <SliderComponent sliderImages={designImages} />

        <div className="my-[8rem] ">
          <h2 className="font-medium text-[2.5rem] mb-[2rem] ">
            {designDetails?.title}
          </h2>
          <p className="text-[#595862] ">
            {designDetails?.description}
          </p>
        </div>

        <p className="font-medium text-sm mb-[2rem] ">More by {designDetails?.designer.fullName}</p>

        <div className="w-full flex items-center space-x-4">
          <div className="relative cursor-pointer overflow-hidden h-[32rem] w-[24rem] rounded-xl ">
            <Image
              src={"/images/more1.jpg"}
              alt="more"
              fill
              objectFit="cover"
              className="hover:scale-125 duration-500"
            />
          </div>
          <div className="relative cursor-pointer overflow-hidden h-[32rem] w-[24rem] rounded-xl ">
            <Image
              src={"/images/more2.jpg"}
              alt="more"
              fill
              objectFit="cover"
              className="hover:scale-125 duration-500"
            />
          </div>
          <div className="relative cursor-pointer overflow-hidden h-[32rem] w-[24rem] rounded-xl ">
            <Image
              src={"/images/slide1.jpg"}
              alt="more"
              fill
              objectFit="cover"
              className="hover:scale-125 duration-500"
            />
          </div>
          <div className="relative cursor-pointer overflow-hidden h-[32rem] w-[24rem] rounded-xl ">
            <Image
              src={"/images/slide2.jpg"}
              alt="more"
              fill
              objectFit="cover"
              className="hover:scale-125 duration-500"
            />
          </div>
        </div>

        <UserFooter designerUsername={designDetails?.designer.username} image={designDetails?.designer.avatar} name={designDetails?.designer.fullName} />
      </Container>

    </div>
  );
};

export default DesignDetails;
