"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { MyContext } from "@/context/Context";
import {
  getArtMultipleImagesReference,
  getArtPreviewImageReference,
} from "@/helpers/firebaseFileReferences";
import { uploadFileToFB, uploadMultipleImagesToFB } from "@/helpers/functions";
import { CREATE_ART } from "@/apollo/mutations/arts";
import { useMutation } from "@apollo/client";
import {
  Alert,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { GET_ALL_ARTS, GET_USER_ARTS } from "@/apollo/queries/arts";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ContinueArtUpload = () => {
  const { appState } = useContext(MyContext);

  const { artUpload, session } = appState;

  const fileId = new Date().getTime();

  const [artImages, setArtImages] = useState([...artUpload.selectedImages]);
  const [artUploadData, setArtUploadData] = useState({
    title: artUpload.title,
    story: "",
    dimensions: "",
    price: 1,
    category: "",
    artType: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dimenssionSelected, setDimenssionSelected] = useState("");
  const [auctionStartDate, setAuctionStartDate] = useState<any>("");
  const [auctionEndDate, setAuctionEndDate] = useState<any>("");

  const router = useRouter();

  console.log("auctionStartDate >>>", new Date(auctionStartDate));
  

  const [createArt] = useMutation(CREATE_ART);

  const createNewArt = async () => {
    setLoading(true);

    if (!artUpload.selectedImage) {
      setErrorOccured(true);
      setErrorMessage("Select a preview image");
      setLoading(false);
      return;
    }

    if (
      artUploadData.title.length < 1 ||
      !artUploadData.story ||
      !artUploadData.dimensions ||
      !artUploadData.category ||
      !artUploadData.artType
    ) {
      setErrorOccured(true);
      setErrorMessage("Fill in all required fields");
      setLoading(false);
      return;
    }

    if (!dimenssionSelected) {
      setErrorOccured(true);
      setErrorMessage("Select dimension unit");
      setLoading(false);
      return;
    }

    const dimensionsRegex = /^\d+\*\d+$/;

    if (!dimensionsRegex.test(artUploadData.dimensions)) {
      setErrorOccured(true);
      setErrorMessage("Dimensions should be in this format '100*150'");
      setLoading(false);
      return;
    }
    
    if (session?.userType !== "ARTIST" && session?.userType !== "CREATOR") {
      setErrorOccured(true);
      setErrorMessage("You are not authorized to publish designs");
      setLoading(false);
      return;
    }
    
    if (artUploadData.artType === "auction" && artUploadData.price < 1) {
      setErrorOccured(true);
      setErrorMessage("Set a price for the art");
      setLoading(false);
      return;
    }
    // make sure start date and end date is set if art type is auction
    if (artUploadData.artType === "auction" && !auctionStartDate) {
      setErrorOccured(true);
      setErrorMessage("Select auction start date");
      setLoading(false);
      return;
    }
    if (artUploadData.artType === "auction" && !auctionEndDate) {
      setErrorOccured(true);
      setErrorMessage("Select auction end date");
      setLoading(false);
      return;
    }
    
    if (
      artUploadData.artType === "auction" &&
      auctionStartDate > auctionEndDate
    ) {
      setErrorOccured(true);
      setErrorMessage("Auction start date cannot be greater than end date");
      setLoading(false);
      return;
    }



    try {
      setErrorOccured(false);
      let previewImage: SingleFileUpload | undefined = await uploadFileToFB(
        artUpload.selectedImage,
        getArtPreviewImageReference(session?._id, fileId.toString())
      );

      console.log("preview image", previewImage);

      let artImagesToUpload: any =
        artImages.length > 0
          ? await uploadMultipleImagesToFB(
              artImages,
              getArtMultipleImagesReference(session?._id, fileId.toString())
            )
          : [];

      let artInput = {
        title: artUploadData.title,
        description: artUploadData.story,
        artPreview: previewImage?.file,
        previewImageRef: previewImage?.reference,
        artImages: artImagesToUpload?.images,
        artImagesRef: artImagesToUpload?.references,
        category: artUploadData.category,
        dimensions: `${artUploadData.dimensions}${dimenssionSelected}`,
        price: artUploadData.price,
        artState: artUploadData.artType,
        auctionStartPrice:
          artUploadData.artType === "auction" ? artUploadData.price : 0,
        auctionStartDate:
          artUploadData.artType === "auction" ? auctionStartDate : "",
        auctionEndDate:
          artUploadData.artType === "auction" ? auctionEndDate : "",
      };

      console.log("art input >>>>", artInput);

      const { data } = await createArt({
        variables: {
          artInput,
        },
        update: (cache, { data: { createArt } }) => {
          const existingArts = cache.readQuery<any>({
            query: GET_ALL_ARTS,
          });

          cache.writeQuery({
            query: GET_ALL_ARTS,
            data: {
              getAllArtWorks: [
                createArt,
                ...(existingArts?.getAllArtWorks || []),
              ],
            },
          });

          const existingUserArts = cache.readQuery<any>({
            query: GET_USER_ARTS,
            variables: {
              userId: session?._id,
            },
          });

          cache.writeQuery({
            query: GET_USER_ARTS,
            variables: {
              userId: session?._id,
            },
            data: {
              getUserArtWorks: [
                createArt,
                ...(existingUserArts?.getUserArtWorks || []),
              ],
            },
          });
        },
      });

      console.log("uploaded art", data);
      router.push("/art");
    } catch (error: any) {
      setErrorOccured(true);
      setErrorMessage(error?.message);
      console.log("error uploading art", error);
    }
    setLoading(false);
  };

  const removeImage = (idx: number) => {
    setArtImages((prevImages) =>
      prevImages.filter((_, index) => index !== idx)
    );
  };

  const cancelUpload = () => {
    setArtImages([]);
    setArtUploadData({
      title: "",
      story: "",
      dimensions: "",
      price: 0,
      category: "",
      artType: "",
    });
    router.push("/art");
  };

  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[8rem] ">
          <h2 className="font-medium text-[1.2rem] ">
            More about your Artwork
          </h2>

          <div className="w-full flex items-start mt-8 space-x-6">
            <div className="">
              <p className="font-medium text-sm mb-2 ">Thumbnail preview</p>
              <div className="relative h-[16rem] w-[16rem] mb-6">
                <Image
                  src={
                    artUpload.selectedImage
                      ? artUpload.selectedImage
                      : "/images/slide2.jpg"
                  }
                  fill
                  alt=""
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="w-[16rem] h-5 md:grid grid-cols-3 flex flex-wrap items-center justify-center">
                {artImages.map((image: any, idx: number) => (
                  <div key={idx} className="relative h-[5rem] w-[5rem] mb-1">
                    <div
                      onClick={() => removeImage(idx)}
                      className="absolute z-10 h-[1.4rem] w-[1.4rem] rounded-full bg-white cursor-pointer flex items-center justify-center right-1 top-1 "
                    >
                      <LiaTimesSolid size={16} />
                    </div>
                    <Image
                      src={image}
                      fill
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative flex-1 border`}>
              {loading && <LinearProgress color="inherit" />}
              {loading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 z-10"></div>
              )}

              {errorOccured && (
                <Alert className={`mb-2 `} severity="error">
                  {errorMessage}
                </Alert>
              )}
              <div className={`space-y-4 pb-6 px-6 ${loading && "opacity-40"}`}>
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2"> Art Title </p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    value={artUploadData.title}
                    error={errorOccured}
                    onChange={(e) =>
                      setArtUploadData({
                        ...artUploadData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2"> Story </p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="this art is inspired by..."
                    multiline
                    rows={4}
                    value={artUploadData.story}
                    error={errorOccured}
                    onChange={(e) =>
                      setArtUploadData({
                        ...artUploadData,
                        story: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2"> Dimensions </p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="100*150"
                    value={artUploadData.dimensions}
                    error={errorOccured}
                    onChange={(e) =>
                      setArtUploadData({
                        ...artUploadData,
                        dimensions: e.target.value,
                      })
                    }
                  />
                  <div className="flex justify-end">
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={dimenssionSelected}
                      onChange={(e) => setDimenssionSelected(e.target.value)}
                    >
                      <FormControlLabel
                        value="in"
                        control={<Radio />}
                        label="in"
                      />
                      <FormControlLabel
                        value="cm"
                        control={<Radio />}
                        label="cm"
                      />
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <FormControl className="w-[20rem] mt-[1rem]">
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={artUploadData.category}
                      error={errorOccured}
                      onChange={(e) =>
                        setArtUploadData({
                          ...artUploadData,
                          category: e.target.value,
                        })
                      }
                      label="Category"
                    >
                      <MenuItem value={"painting"}>Painting</MenuItem>
                      <MenuItem value={"sculpture"}>Sculpture</MenuItem>
                      <MenuItem value={"pencilDrawing"}>
                        Pencil Drawing
                      </MenuItem>
                      <MenuItem value={"digitalArt"}>Digital Art</MenuItem>
                      <MenuItem value={"calligraphy"}>Calligraphy</MenuItem>
                      <MenuItem value={"textileArt"}>Textile Art</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className="w-[20rem] mt-[1rem]">
                    <InputLabel id="demo-simple-select-label">
                      Art Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={artUploadData.artType}
                      error={errorOccured}
                      onChange={(e) => {
                        setArtUploadData({
                          ...artUploadData,
                          artType: e.target.value,
                        })
                        setAuctionStartDate("");
                        setAuctionEndDate("");
                      }}
                      label="Art Type"
                    >
                      <MenuItem value={"onSale"}>On Sale</MenuItem>
                      <MenuItem value={"auction"}>Auction</MenuItem>
                      <MenuItem value={"showcase"}>Art Showcase</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {artUploadData.artType === "onSale" && (
                  <div>
                    <p className="text-sm font-medium mb-2"> Price </p>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      className="w-full"
                      placeholder="150.00"
                      type="number"
                      value={artUploadData.price}
                      onChange={(e) =>
                        setArtUploadData({
                          ...artUploadData,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                )}

                {artUploadData.artType === "auction" && (
                  <>
                    <div className="w-full py-[2rem]">
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">
                          Starting Price{" "}
                        </p>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          className="w-full"
                          placeholder="150.00"
                          type="number"
                          error={errorOccured}
                          value={artUploadData.price}
                          onChange={(e) =>
                            setArtUploadData({
                              ...artUploadData,
                              price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {" "}
                            Start date & time
                          </p>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              onChange={(e) => setAuctionStartDate(e.$d)}
                              value={auctionStartDate}
                            />
                          </LocalizationProvider>
                        </div>
                        <div>
                          {auctionStartDate && (
                            <>
                              <p className="text-sm font-medium mb-2">
                                End date & time
                              </p>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  onChange={(e) => setAuctionEndDate(e.$d)}
                                  value={auctionEndDate}
                                />
                              </LocalizationProvider>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-20 ">
                  <ButtonOutlined
                    onClick={cancelUpload}
                    className="w-[8rem] h-[3rem]"
                    title="Cancel"
                  />

                  <div className="flex items-center space-x-4">
                    <ButtonOutlined
                      className="w-[8rem] h-[3rem]"
                      title="Save as draft"
                    />
                    <ButtonSolid
                      onClick={createNewArt}
                      className="w-[8rem] h-[3rem]"
                      title="Publish now"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="h-[22rem] "></div>
    </main>
  );
};

export default ContinueArtUpload;
