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
import {
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/Context";
import PromptSigninPopup from "@/components/PromptSigninPopup";

const Art = () => {
  const { loading, error, data } = useQuery(GET_ALL_ARTS);

  const theme = useTheme();
  const [category, setCategory] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [cols, setCols] = useState(3);

  useEffect(() => {
    if (isMobile) {
      setCols(1);
    } else if (isTablet) {
      setCols(2);
    } else {
      setCols(3);
    }
  }, [isMobile, isTablet]);

  const router = useRouter();

  const { appState } = useContext(MyContext);

  const { session } = appState;

  return (
    <main className="flex-1">
      <Header />
      <div className="relative h-[30rem] lg:h-[50rem] w-screen">
        <Image
          src={"/images/art-overlay.jpg"}
          fill
          style={{ objectFit: "cover" }}
          alt="backgroung image"
        />

        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 z-10 bg-overlay items-center justify-center ">
          <h2 className="text-white font-medium text-xl lg:text-3xl mb-[4rem] text-center">
            Unveil your creative brilliance to the world.
          </h2>
            <ButtonSolid
              className="w-[11rem] h-[3rem] lg:w-[12.6rem] lg:h-[4rem]"
              title="Become an Artist"
              onClick={() => router.push("/subscription")}
            />
        </div>
      </div>

      <Container>
        <div className="w-full flex flex-col items-center justify-center xl:flex-row xl:justify-between py-[4rem] ">
          {session && (
            <DropDown selected={category} setSelected={setCategory} />
          )}

          <ul className="flex w-full items-center md:justify-center mt-4 space-x-4 xl:space-x-8 xl:flex-1 xl:justify-end xl:mt-0 whitespace-nowrap overflow-x-scroll scrollbar-hide">
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
          <ImageList variant="masonry" cols={cols} gap={8}>
            {[...(data?.getAllArtWorks || [])].map((item: ArtPiece, idx) => (
              <ImageListItem
                key={item._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArtCard art={item} />
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
