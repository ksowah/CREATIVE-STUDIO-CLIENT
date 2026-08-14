"use client";

import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import CreativeCard from "@/components/CreativeCard";
import DropDown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkeletonLoader from "@/components/SkeletonLoader";
import {
  GET_ALL_DESIGNS,
  GET_DESIGNS_BY_CATEGORY,
} from "@/apollo/queries/designs";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { MyContext } from "@/context/Context";
import { isFirebaseImageUrl } from "@/helpers/functions";

export default function Home() {
  const [category, setCategory] = useState("");

  const { loading, data } = useQuery(GET_ALL_DESIGNS);

  const { data: byCategoryData, loading: byCategoryLoading } = useQuery(GET_DESIGNS_BY_CATEGORY, {
    variables: { category },
  });

  const router = useRouter();

  const { appState } = useContext(MyContext);

  const { session } = appState;

  return (
    <main className="flex-1">
      <Header />
      <div className="relative h-[30rem] lg:h-[50rem] w-screen">
        <Image
          src={"/images/designoverlay.png"}
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
              title="Become a Designer"
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

        {loading || byCategoryLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="flex items-center justify-center flex-wrap xl:grid grid-cols-4 ">
            {(
              category
                ? byCategoryData?.getDesignsByCategory
                : data?.getAllDesigns
            )
              ?.filter((item: Design) => !isFirebaseImageUrl(item.preview))
              .map((item: Design) => (
                <CreativeCard key={item._id} designDetails={item} />
              ))}
          </div>
        )}

        <Footer />
      </Container>
    </main>
  );
}
