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
import { appInitializer } from "@/firebase";
import { uploadFileToFB, uploadMultipleImagesToFB } from "@/helpers/functions";
import {
  getDesignFileReference,
  getDesignMultipleImagesReference,
  getDesignPreviewImageReference,
} from "@/helpers/firebaseFileReferences";
import { getStorage } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";


const UploadDesign = () => {
  const { appState, setAppState } = useContext(MyContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");

  const [designFileSelected, setDesignFileSelected] = React.useState(null);
  const [selectedDesignFileName, setSelectedDesignFileName] = useState("");
  const [selectedFileExtension, setselectedFileExtension] = React.useState("");

  const designFilePickerRef: any = React.useRef(null);

  const user = appState?.session;

  const storage = getStorage(appInitializer);

  const fileId = new Date().getTime();

  const selectImage = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent: any) => {
      setSelectedImage(readerEvent.target.result);
    };
  };

  const selectDesignFile = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      console.log("file name", e.target.files[0].name);
      setSelectedDesignFileName(e.target.files[0].name);
      setselectedFileExtension(e.target.files[0].name.split(".").pop());
      console.log("extension >>", e.target.files[0].name.split(".").pop());
    }
    reader.onload = (readerEvent: any) => {
      setDesignFileSelected(readerEvent.target.result);
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
                    uploadMultipleImagesToFB(
                      selectedImages,
                      getDesignMultipleImagesReference(
                        user?._id,
                        fileId.toString()
                      )
                    )
                  }
                  getPreviewImage={() =>
                    uploadFileToFB(
                      selectedImage,
                      getDesignPreviewImageReference(
                        user?._id,
                        fileId.toString()
                      )
                    )
                  }
                  getDesignFile={() =>
                    uploadFileToFB(
                      designFileSelected,
                      getDesignFileReference(
                        user?._id,
                        fileId.toString(),
                        selectedDesignFileName,
                        selectedFileExtension
                      )
                    )
                  }
                  projectTitle={projectTitle}
                  setProjectTitle={setProjectTitle}
                  setSelectedImage={setSelectedImage}
                  setSelectedImages={setSelectedImages}
                  selectedDesignImages={selectedImages}
                  selectedImage={selectedImage}
                  designFilePickerRef={designFilePickerRef}
                  designFileSelected={designFileSelected}
                  selectDesignFile={selectDesignFile}
                  selectedDesignFileName={selectedDesignFileName}
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
