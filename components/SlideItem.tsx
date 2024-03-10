"use client";

import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface Props {
  image: string;
  ref: any;
  NextBtn: () => JSX.Element;
  PrevBtn: () => JSX.Element;
}

const SlideItem = ({ image, ref, NextBtn, PrevBtn }: Props) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative w-full h-[50rem] rounded-xl overflow-hidden ">
      {imageLoading && (
        <Skeleton className="z-10" variant="rectangular" width={"100%"} height={"100%"} />
      )}

      <Image
        onLoad={() => setImageLoading(false)}
        src={image}
        style={{objectFit:"cover"}}
        fill
        alt="slide image"
      />
      <div className="absolute px-6 flex flex-col items-center justify-center z-50 top-0 left-0 right-0 bottom-0 ">
        <div className=" w-full flex-1 flex ">
          <div className="flex items-center w-full justify-between ">
            <PrevBtn />
            <NextBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideItem;
