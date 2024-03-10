import { Button } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";

interface Props {
  selectedImages: any;
  setSelectedImages: any;
}

const MultiImageUploader = ({ selectedImages, setSelectedImages }: Props) => {
  const filePickerRef = useRef<any>(null);

  const selectImages = (e: any) => {
    const selectedImagesArray = [...selectedImages]; // Create a copy of the existing images array

    // Loop through each selected file
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const reader = new FileReader(); // Create a new FileReader instance for each file

      // Read each file as data URL
      reader.readAsDataURL(file);

      // Push the data URL to the selected images array
      reader.onload = (readerEvent: any) => {
        selectedImagesArray.push(readerEvent.target.result);

        // When all files are read, update the state with the new array of selected images
        if (
          selectedImagesArray.length ===
          e.target.files.length + selectedImages?.length
        ) {
          setSelectedImages(selectedImagesArray);
        }
      };
    }
  };

  const init = () => {
    filePickerRef.current.click();
  };

  const removeImage = (idx: number) => {
    setSelectedImages((prevSelectedImages: any) =>
      prevSelectedImages.filter((_: any, index: number) => index !== idx)
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full my-8 md:grid grid-cols-6 flex items-center justify-center flex-wrap">
        {selectedImages?.map((image: any, idx: any) => (
          <div key={idx} className="relative w-[12rem] h-[12rem] mt-6 mr-4">
            <div
              onClick={() => removeImage(idx)}
              className="absolute z-10 h-[2rem] w-[2rem] rounded-full bg-[#D9D9D9] cursor-pointer flex items-center justify-center -right-4 -top-3 "
            >
              <LiaTimesSolid />
            </div>
            <Image src={image} alt="" fill style={{objectFit:"cover"}} />
          </div>
        ))}
      </div>

      <input
        type={"file"}
        accept=".png, .jpeg, .tiff, .jpg"
        hidden
        multiple
        onChange={selectImages}
        ref={filePickerRef}
      />

      <Button
        onClick={init}
        variant="outlined"
        color="inherit"
        className="w-[10rem] h-[3rem] mt-[2rem] rounded-full "
        startIcon={<FaPlus />}
      >
        <p className="normal-case font-medium">Add More</p>
      </Button>
    </div>
  );
};

export default MultiImageUploader;
