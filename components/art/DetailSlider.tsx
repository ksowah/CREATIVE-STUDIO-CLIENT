"use client";
import Image from "next/image";
import Slider from "react-slick";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import Container from "../Container";
import { useRef, useState } from "react";
import { IoMdPlay } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import ArtImage from "./ArtImage";

const DetailSlider = ({
  artDetails,
  initialSlide,
  setShowArtImage,
}: {
  artDetails: ArtPiece;
  initialSlide: number;
  setShowArtImage: any;
}) => {
  const ref: any = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[70] bg-blackRgba">
      <div className="flex justify-end items-center w-full px-4">
        <div
          onClick={() => setShowArtImage(false)}
          className="h-[3rem] px-4 bg-gray-900 cursor-pointer flex items-center justify-center"
        >
          <LiaTimesSolid color="white" size={22} />
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center py-[5rem]">
        <div
          onClick={() => ref?.current?.slickPrev()}
          className="h-[3rem] w-[3rem] cursor-pointer bg-black ml-4 flex items-center justify-center "
        >
          <IoIosArrowRoundBack color="white" size={22} />
        </div>
        <Container>
          <Slider
            initialSlide={initialSlide}
            className="h-full w-full"
            ref={ref}
            {...settings}
          >
            {[artDetails?.artPreview, ...(artDetails?.artImages || [])].map(
              (image, idx) => (
                <div key={idx} className="relative h-[45rem] w-[45rem] ">
                  <ArtImage
                    src={image}
                    layout="fill"
                    style={{ objectFit: "contain" }}
                    alt="art images"
                  />
                </div>
              )
            )}
          </Slider>
        </Container>

        <div
          onClick={() => ref?.current?.slickNext()}
          className="h-[3rem] w-[3rem] cursor-pointer bg-black mr-4 flex items-center justify-center "
        >
          <IoIosArrowRoundForward color="white" size={22} />
        </div>
      </div>
    </div>
  );
};

export default DetailSlider;
