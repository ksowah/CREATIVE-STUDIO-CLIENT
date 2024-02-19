import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import CreativeCard from "@/components/CreativeCard";
import DropDown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { creativeWorkdata } from "@/utils/fake-db";
import { Button } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1">
      <Header />
      <div className="relative h-[50rem] w-screen">
        <Image src={"/images/designoverlay.png"} fill objectFit="cover" alt="backgroung image" />

        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 z-10 bg-overlay items-center justify-center ">
          <h2 className="text-white font-medium text-3xl mb-[4rem] ">
            Unveil your creative brilliance to the world.
          </h2>
          <ButtonSolid className="w-[12.6rem] h-[4rem]" title="Become a Designer"  />
        </div>
      </div>

      <Container>
        <div className="flex-1 flex justify-between w-full py-[4rem] ">
          <DropDown />

          <ul className="flex items-center space-x-8">
            <li className="text-sm text-[#5C5B66] cursor-pointer">
              3D Designs
            </li>
            <li className="text-sm text-[#5C5B66] cursor-pointer">
              Graphic Designs
            </li>
            <li className="text-sm text-[#5C5B66] cursor-pointer ">
              Animation
            </li>
            <li className="text-sm text-[#5C5B66] cursor-pointer ">
              Photoshop
            </li>
            <li className="text-sm text-[#5C5B66] cursor-pointer ">Branding</li>
            <li className="text-sm text-[#5C5B66] cursor-pointer ">
              UX|UI Designs
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-4 ">
          {creativeWorkdata.map((work, idx) => (
            <CreativeCard
              key={idx}
              authourImage={work.authourImage}
              authourName={work.authourName}
              workImage={work.workImage}
            />
          ))}
        </div>

        <Footer />
      </Container>

    </main>
  );
}
