"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import React from "react";
import { BsCart4 } from "react-icons/bs";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GET_ART_BY_ID } from "@/apollo/queries/arts";

interface MeetingProps {
  picture: string;
  name: string;
  description: string;
  price: string;
}

const Meeting: React.FC<MeetingProps> = ({
  picture,
  name,
  description,
  price,
}) => {
  return (
    <div className="w-[280px] h-[450px]">
      <img src={picture} alt="profile picture" />
      <p className="text-[18px] font-semibold py-2">{name}</p>
      <p className="">{description}</p>
      <p>{price}</p>
    </div>
  );
};

const ArtDetails = ({ params }: { params: any }) => {
  let artId = params?.artId;

  const { loading, data } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const artDetails: ArtPiece = data?.getArtById;

  console.log("artDetails", artDetails);

  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[10rem]">
          <div className="flex justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative flex justify-start w-[700px] h-[500px]">
                <Image
                  src={artDetails?.artPreview}
                  fill
                  style={{ objectFit: "contain" }}
                  alt="main art preview"
                />
              </div>
              <div className="md:grid grid-cols-4  flex flex-wrap mt-10 ">
                {[...(artDetails?.artImages || [])].map((image, idx) => (
                  <div key={idx} className="relative h-[10rem] w-[10rem] mr-4 ">
                    <Image
                      src={image}
                      fill
                      style={{ objectFit: "contain" }}
                      alt="other images"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="">
              <p className="font-medium text-[30px]">{artDetails?.title}</p>

              <div className=" mt-6 text-[13px]">
                <p>Size: {artDetails?.dimensions}</p>
                <p>Medium: Acryl</p>
                <p>Material: Canvas</p>
                <p>Year: 2022</p>
              </div>

              <div className="w-[500px] h-[160px] mt-8 bg-[#f0f0f0] pt-2 pl-3">
                <div className="text-[13px] flex justify-between">
                  <div>
                    <p>Get to know the artist :</p>
                    <p className="my-2">Availability:</p>
                    <p>Delivery Time:</p>
                  </div>

                  <div className="text-[13px] text-right pr-3">
                    <p>Anna Ovsiankina</p>
                    <p className="my-2 ">In Stock</p>
                    <p>Up to 14 days after purchase</p>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pr-3">
                  <p className="text-[25px] font-medium">₵{artDetails?.price}</p>

                  <button className="bg-black w-[110px] h-[35px] text-white rounded-[7px]  flex justify-center items-center">
                    <BsCart4 className="pl- mr-2" />
                    <p className="font-semibold text-[12px]">Add to cart</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text underneath */}
          <div className="w-[500px] py-[2rem] ">
            <h2 className="mt-[4rem] mb-3 text-[23px] font-semibold">
              Story
            </h2>
            <p className="text-[13px]">
              {artDetails?.description}
            </p>
          </div>

          <div className="border-t">
            <p className="mt-[2rem] text-center text-[22px] font-medium">
              You May Also Like
            </p>

            <div className=" mx-[83px] mt-[3rem] flex justify-between">
              <Meeting
                picture="/images/drawings.png"
                name="Amber Haze"
                description="Annet Loginova | Paintings"
                price="$350"
              />
              <Meeting
                picture="/images/drawings2.png"
                name="Little ballerina"
                description="Annet Loginova | Paintings"
                price="$350"
              />
              <Meeting
                picture="/images/drawings.png"
                name="Amber Haze"
                description="Annet Loginova | Paintings"
                price="$350"
              />
            </div>

            <div className="flex justify-between mx-[83px] mt-[3.5rem]">
              <Meeting
                picture="/images/drawings2.png"
                name="Little ballerina"
                description="Annet Loginova | Paintings"
                price="$350"
              />
              <Meeting
                picture="/images/drawings.png"
                name="Amber Haze"
                description="Annet Loginova | Paintings"
                price="$350"
              />
              <Meeting
                picture="/images/drawings2.png"
                name="Little ballerina"
                description="Annet Loginova | Paintings"
                price="$350"
              />
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
};

export default ArtDetails;
