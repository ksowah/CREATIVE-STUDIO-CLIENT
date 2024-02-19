"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { HiMiniPhoto } from "react-icons/hi2";

const Uploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const filePickerRef = useRef<any>(null);

  console.log("selectedImage >>>", selectedImage);
  

  const selectImage = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent: any) => {
      setSelectedImage(readerEvent.target.result);
    };
  };

  const init = () => {
    if (!selectedImage) {
        filePickerRef.current.click()
    }
  }

  return (
    <div
      onClick={init}
      className="relative w-full h-[50rem] cursor-pointer border mt-4 flex flex-col items-center justify-center "
    >
      {selectedImage ? (
        <Image src={selectedImage} fill objectFit="cover" alt="selected image" />
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
            Drag and drop an image here or{" "}
            <span className="underline cursor-pointer">Browse</span>
          </p>
          <div className="flex items-center text-[#797979] mt-4 space-x-8">
            <div>
              <p>· High resolution images(png,jpeg,gif)</p>
              <p>· Animated Gifs</p>
            </div>

            <div>
              <p>· Videos (mp4)</p>
              <p>· Only Upload media you own the right to</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploader;
