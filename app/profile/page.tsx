import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileImage from "@/components/ProfileImage";
import ProfileWork from "@/components/ProfileWork";
import UploadButton from "@/components/UploadButton";
import React from "react";

const Profile = () => {
  const data = [
    "/images/work1.jpg",
    "/images/work2.jpg",
    "/images/work3.jpg",
    "/images/card1.png",
    "/images/card2.png",
    "/images/card3.png",
    "/images/card4.png",
    "/images/slide1.jpg",
    "/images/slide2.jpg",
  ];

  return (
    <main>
      <Header />

      <section className="h-[38rem] w-full pt-[6rem] ">
        <Container>
          <div className="flex items-center w-full h-full ">
            <ProfileImage
              image="/images/kev.jpg"
              dimension="w-[14rem] h-[14rem]"
            />

            <div className="space-y-2 ml-8">
              <p className="font-medium text-3xl ">Kelvin Sowah</p>
              <p className="text-sm font-medium">Product Designer</p>

              <div className="flex items-center cursor-default text-sm text-[#595862] space-x-4">
                <p>200 followers</p>
                <p>10 following</p>
              </div>

              <div className="flex items-center space-x-4">
                <ButtonSolid className="h-[3rem] w-[8rem] " title="Follow" />
                <ButtonOutlined className="h-[3rem] w-[8rem] " title="Email" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="w-full">
        <Container>
          <ul className="flex items-center space-x-8 ">
            <li className="text-sm font-medium h-[2rem] px-3 bg-[#F8F7F5] flex items-center justify-center cursor-pointer mb-4 ">
              Design
            </li>
            <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
              Projects
            </li>
            <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
              Liked Shots
            </li>
            <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
              About
            </li>
          </ul>
        </Container>
        <div className="w-full border-t">
          <Container>
            <div className="pt-[4rem] grid grid-cols-4 ">
                <UploadButton />
              {data.map((image, idx) => (
                <ProfileWork image={image} key={idx} />
              ))}
            </div>

            <Footer />
          </Container>
        </div>
      </section>
    </main>
  );
};

export default Profile;
