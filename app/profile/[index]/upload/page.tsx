"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MultiImageUploader from "@/components/MultiImageUploader";
import UploadDialogue from "@/components/UploadDialogue";
import Uploader from "@/components/Uploader";
import { MyContext } from "@/context/Context";
import { uploadFileToCloudinary, uploadMultipleImagesToCloudinary } from "@/helpers/functions";
import {
  getDesignMultipleImagesReference,
  getDesignPreviewImageReference,
} from "@/helpers/imageReferences";
import React, { useContext, useState } from "react";


const UploadDesign = () => {
  const { appState } = useContext(MyContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");


  const user = appState?.session;

  const fileId = new Date().getTime();

  const selectImage = (e:any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent: any) => {
      setSelectedImage(readerEvent.target.result);
    };
  };

  const cancelUpload = () => {
    setSelectedImage(null);
    setSelectedImages([]);
    setProjectTitle("");
  };

  return (
    <main className="w-full">
      <Header />

      <Container>
        <div className="pt-[10rem] ">
          <p className="font-medium text-[.9rem] text-[#595862] ">
            What have you been working on?
          </p>

          <div className="w-full">
            <input
              type="text"
              placeholder="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full mt-6 font-medium text-[1.4rem] border-none outline-none "
            />

            <Uploader
              selectImage={(e) => selectImage(e)}
              selectedImage={selectedImage}
            />

            {selectedImage && (
              <MultiImageUploader
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            )}

            <div className="w-full mt-6 flex items-center justify-between">
              <ButtonOutlined
                onClick={cancelUpload}
                className="h-[2.8rem] w-[9rem] "
                title="Cancel"
              />

              <div className="flex items-center space-x-4">
                <ButtonSolid
                  className="h-[2.8rem] w-[9rem]"
                  title="save as draft"
                />
                <UploadDialogue
                  getDesignImagesURLs={() =>
                    // @ts-ignore
                    uploadMultipleImagesToCloudinary(
                      selectedImages,
                      getDesignMultipleImagesReference(
                        user?._id,
                        fileId.toString()
                      )
                    )
                  }
                  getPreviewImage={() =>
                    uploadFileToCloudinary(
                      selectedImage,
                      getDesignPreviewImageReference(
                        user?._id,
                        fileId.toString()
                      )
                    )
                  }
                  projectTitle={projectTitle}
                  setProjectTitle={setProjectTitle}
                  setSelectedImage={setSelectedImage}
                  setSelectedImages={setSelectedImages}
                  selectedDesignImages={selectedImages}
                  selectedImage={selectedImage}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[12rem]"></div>
        <Footer />
      </Container>
    </main>
  );
};

export default UploadDesign;
