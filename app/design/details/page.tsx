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

const DesignDetails = () => {
  return (
    <div className="w-ful">
      <Header />

      <Container>
        <div className="w-full flex space-x-6 items-center mt-[4rem] py-[6rem] ">
            
          <ProfileImage dimension="h-[4.5rem] w-[4.5rem]" image={"/images/kev.jpg"} />

          <div className="flex-1">
            <h3 className="font-medium text-xl">UI for educational website</h3>
            <p className="text-[#595862] text-xs cursor-pointer ">
              Paul Dunyo · Follow{" "}
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

        <SliderComponent />

        <div className="my-[8rem] ">
          <h2 className="font-medium text-[2.5rem] mb-[2rem] ">
            Illustration for educational website
          </h2>
          <p className="text-[#595862] ">
            Our UI design focuses on intuitive navigation, clean layouts, and
            user-friendly interactions. Experience seamless browsing with a
            minimalist design, allowing easy access to a wealth of educational
            resources. Enjoy a responsive interface that adapts to your device,
            ensuring a consistent and enjoyable learning experience. Engage
            effortlessly with interactive elements designed for enhanced
            comprehension and retention. Elevate your learning journey with our
            thoughtfully crafted UI.
          </p>
        </div>

        <p className="font-medium text-sm mb-[2rem] ">More by Paul Dunyo</p>

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

        <UserFooter />
      </Container>

    </div>
  );
};

export default DesignDetails;
