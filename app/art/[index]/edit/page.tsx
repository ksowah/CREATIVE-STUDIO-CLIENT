"use client";

import { GET_ART_BY_ID } from "@/apollo/queries/arts";
import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MultiImageUploader from "@/components/MultiImageUploader";
import Uploader from "@/components/Uploader";
import { MyContext } from "@/context/Context";
import { selectImage } from "@/helpers/functions";
import { useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const EditArtWork = ({ params }: { params: any }) => {
  const { index: artId } = params;

  const { data, loading } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const artDetails: ArtPiece = data?.getArtById;

  const [pickedImage, setPickedImage] = useState<any>(
    artDetails?.artPreview || null
  );
  const [selectedImages, setSelectedImages] = useState<any>(
    artDetails?.artImages || []
  );
  const [artTitle, setArtTitle] = useState(artDetails?.title || "");

  const router = useRouter();

  const [imagesRef, setImagesRef] = useState<any>([])

  
  useEffect(() => {
    setPickedImage(artDetails?.artPreview);
    setSelectedImages(artDetails?.artImages);
    setArtTitle(artDetails?.title);
    setImagesRef(artDetails?.artImagesRef)
  }, [data, loading]);


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
        artEdit: {
          imageRefs: imagesRef
        }
      }));

      router.push(`/art/${artId}/edit/continue`);
    }
  };

  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[10rem] ">
          <p className="font-medium text-[.9rem] text-[#595862] ">
            Update details of your art work
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
                setImagesRef={setImagesRef}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            )}

            <div className="w-full mt-6 flex flex-col-reverse md:flex-row items-center justify-between">
              <ButtonOutlined
                onClick={cancelUpload}
                className="md:h-[2.8rem] md:w-[9rem] "
                title="Cancel"
              />

              <div className="flex items-center mb-4 md:mb-0 space-x-4">
                <ButtonSolid
                  className="md:h-[2.8rem] md:w-[9rem]"
                  title="save as draft"
                />
                <Button
                  className="md:h-[2.8rem] md:w-[9rem]"
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

export default EditArtWork;
