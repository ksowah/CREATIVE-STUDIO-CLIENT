"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MultiImageUploader from "@/components/MultiImageUploader";
import Uploader from "@/components/Uploader";
import { MyContext } from "@/context/Context";
import { selectImage } from "@/helpers/functions";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const UploadArtWork = () => {
  const [pickedImage, setPickedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [artTitle, setArtTitle] = useState("");

  const router = useRouter();

  const { appState, setAppState } = useContext(MyContext);

  const { session } = appState;

  const cancelUpload = () => {
    setPickedImage(null);
    setSelectedImages([]);
    setArtTitle("");
  };

  const continueUpload = () => {
    if (pickedImage && artTitle) {
      setAppState((prev: any) => ({
        ...prev,
        artUpload: {
          selectedImage: pickedImage,
          selectedImages,
          title: artTitle,
        },
      }));

      router.push(`/art/${session?.username}/upload/continue`);
    }
  };

  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[10rem] ">
          <p className="font-medium text-[.9rem] text-[#595862] ">
            Upload photos of your art work
          </p>

          <div className="w-full">
            <input
              type="text"
              placeholder="Art Piece Title"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
              className="w-full mt-6 font-medium text-[1.4rem] border-none outline-none "
            />

            <Uploader
              selectImage={(e) => selectImage(e, setPickedImage)}
              selectedImage={pickedImage}
              isArt
            />

            {pickedImage && (
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
                <Button
                  className="h-[2.8rem] w-[9rem]"
                  color="inherit"
                  variant="outlined"
                  sx={{
                    cursor: pickedImage && artTitle ? "pointer" : "not-allowed",
                  }}
                  onClick={continueUpload}
                >
                  <p className="normal-case font-medium">Continue</p>
                </Button>
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

export default UploadArtWork;
