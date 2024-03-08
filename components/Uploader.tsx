"use client";
import Image from "next/image";
import { useRef } from "react";
import { HiMiniPhoto } from "react-icons/hi2";

interface Props {
    selectImage: (e: any) => void;
    selectedImage: any;
    isArt?: boolean;
}

const Uploader = ({selectImage, selectedImage, isArt}:Props) => {
  const filePickerRef = useRef<any>(null);

  const init = () => {
    if (!selectedImage) {
        filePickerRef.current.click()
    }
  }


  return (
    <>
    <div
      onClick={init}
      className="relative w-full h-[50rem] cursor-pointer border mt-4 flex flex-col items-center justify-center "
    >
      {selectedImage ? (
        <Image src={selectedImage} fill style={{objectFit:`${isArt ? "contain":"cover"}`}} alt="selected image" />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <HiMiniPhoto size={80} color="#85B6FF" />
          <input
            type={"file"}
            accept=".png, .jpeg, .tiff, .jpg"
            hidden
            onChange={selectImage}
            ref={filePickerRef}
          />
          <p className="text-[#797979] ">
            <span className="underline cursor-pointer">click </span>
            to selcect a display image
          </p>
          <div className="flex items-center text-[#797979] mt-4 space-x-8">
            <div>
              <p>· High resolution images(png,jpeg,gif)</p>
            </div>

            <div>
              <p>· Only Upload media you own the right to</p>
            </div>
          </div>
        </div>
      )}
    </div>

    
    </>
  );
};

export default Uploader;
