"use client";
import Image from "next/image";
import Slider from "react-slick";
import SlideItem from "./SlideItem";
import { useRef } from "react";
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";

const SliderComponent = ({ sliderImages }: { sliderImages: [string] }) => {
  const ref: any = useRef(null);

  const NextBtn = () => {
    return (
      <div
        className={`text-xl z-50 bg-white h-[3.1rem] w-[3.1rem] rounded-full cursor-pointer shadow-xl flex items-center justify-center`}
        onClick={() => ref?.current?.slickNext()}
      >
        <IoChevronForward />
      </div>
    );
  };

  const PrevBtn = () => {
    return (
      <div
        className={` text-xl bg-white h-[3.1rem] w-[3.1rem] rounded-full cursor-pointer shadow-2xl flex items-center justify-center`}
        onClick={() => ref?.current?.slickPrev()}
      >
        <IoChevronBack />
      </div>
    );
  };

  const SliderDot = ({ image }: { image: string }) => {
    return (
      <div className="relative top-7 cursor-pointer h-[2.2rem] mt-4 w-[1.7rem] border-2 border-[#949494] mr-8 rounded-md overflow-hidden">
        <Image src={image} fill style={{objectFit:"cover"}} alt="slider dot" />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots slick-thumb",
    customPaging: function (i: any) {
      return (
        <>
          <SliderDot image={sliderImages[i]} />
        </>
      );
    },
  };

  return (
    <div className="slider-container">
      <Slider ref={ref} {...settings}>
        {sliderImages.map((image, idx) => (
          <SlideItem
            ref={ref}
            NextBtn={NextBtn}
            PrevBtn={PrevBtn}
            image={image}
            key={idx}
          />
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
