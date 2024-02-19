import { Button } from "@mui/material";
import Image from "next/image";


interface Props {
  image: string;
  ref: any;
  NextBtn: () => JSX.Element;
  PrevBtn: () => JSX.Element;
}

const SlideItem = ({ image, ref, NextBtn, PrevBtn }: Props) => {
  return (
    <div className="relative w-full h-[50rem] rounded-xl overflow-hidden ">
      <Image src={image} objectFit="cover" fill alt="slide image" />
      <div className="absolute px-6 flex flex-col items-center justify-center z-50 top-0 left-0 right-0 bottom-0 ">
        <div className=" w-full flex-1 flex ">
          <div className="flex items-center w-full justify-between ">
            <PrevBtn />
            <NextBtn />
          </div>
        </div>

        <Button
          variant="contained"
          style={{ backgroundColor: "#fff" }}
          className="h-[4rem] w-[12rem] mb-[4rem] rounded-full"
        >
          <p className="normal-case font-bold text-[#000] ">Download</p>
        </Button>
      </div>
    </div>
  );
};

export default SlideItem;
