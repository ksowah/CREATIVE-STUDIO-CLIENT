"use client";

import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";
import DropDown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import ArtCard from "@/components/art/ArtCard";
import { useQuery } from "@apollo/client";
import { GET_ALL_ARTS } from "@/apollo/queries/arts";
import SkeletonLoader from "@/components/SkeletonLoader";
import { ImageList, ImageListItem } from "@mui/material";

const Art = () => {
  const { loading, error, data } = useQuery(GET_ALL_ARTS);

  console.log("data >>>", error, data);

  return (
    <main className="flex-1">
      <Header />
      <div className="relative h-[50rem] w-screen">
        <Image
          src={"/images/art-overlay.jpg"}
          fill
          style={{ objectFit: "cover" }}
          alt="backgroung image"
        />

        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 z-10 bg-overlay items-center justify-center ">
          <h2 className="text-white font-medium text-3xl mb-[4rem] ">
            Unveil your creative brilliance to the world.
          </h2>
          <ButtonSolid
            className="w-[12.6rem] h-[4rem]"
            title="Become an Artist"
          />
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

        {loading ? (
          <SkeletonLoader />
        ) : (
          <ImageList variant="masonry" cols={3} gap={8}>
            {[...(data?.getAllArtWorks || [])].map((item: ArtPiece, idx) => (
              <ImageListItem key={item._id}>
                <ArtCard art={item}  />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        <Footer />
      </Container>
    </main>
  );
};

export default Art;
