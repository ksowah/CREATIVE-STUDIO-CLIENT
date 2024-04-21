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
import {
  deleteImageFromFB,
  uploadFileToFB,
  uploadMultipleImagesToFB,
} from "@/helpers/functions";
import { CREATE_ART, EDIT_ART } from "@/apollo/mutations/arts";
import { useMutation, useQuery } from "@apollo/client";
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
import { useContext, useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import {
  GET_ALL_ARTS,
  GET_ART_BY_ID,
  GET_USER_ARTS,
} from "@/apollo/queries/arts";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CssTextField from "@/components/CSSTextField";
import dayjs, { Dayjs } from 'dayjs';


const ContinueArtEdit = ({ params }: { params: any }) => {
  const { index: artId } = params;

  const { data, loading: artLoading } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const [updateArt] = useMutation(EDIT_ART);

  const artDetails: ArtPiece = data?.getArtById;

  const { appState } = useContext(MyContext);

  const { artUpload, session, artEdit } = appState;

  const fileId = new Date().getTime();

  const [artImages, setArtImages] = useState([...artUpload.selectedImages]);
  const [artUploadData, setArtUploadData] = useState({
    title: artUpload?.title,
    story: artDetails?.description,
    dimensions: artDetails?.dimensions,
    price: artDetails?.price,
    category: artDetails?.category,
    artType: artDetails?.artState,
  });

  const [loading, setLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dimenssionSelected, setDimenssionSelected] = useState("");
  const [auctionStartDate, setAuctionStartDate] = useState<any>("");
  const [auctionEndDate, setAuctionEndDate] = useState<any>("");

  useEffect(() => {

    const getDimensions = (dimension:any) => {
      const regex = /\d+\*\d+/; 
      const match = dimension?.match(regex);
      if (match) { return match[0] } else { return null }
    };
    setArtUploadData({
      title: artUpload?.title,
      story: artDetails?.description,
      dimensions: getDimensions(artDetails?.dimensions),
      price: artDetails?.price,
      category: artDetails?.category,
      artType: artDetails?.artState,
    });

    const artDimentioinRegex = /[a-zA-Z]+$/;
    const match = artDetails?.dimensions.match(artDimentioinRegex);

    if (match) { setDimenssionSelected(match[0]) }

    setAuctionStartDate(dayjs(new Date(parseInt(artDetails?.auctionStartDate))));
    setAuctionEndDate(dayjs(new Date(parseInt(artDetails?.auctionEndDate))));
  }, [data]);
  

  const router = useRouter();

  console.log("art imagess>>>>", artImages)

  const UPDATE_ART = async () => {
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
      let newArtPreviewImage = "";
      let newArtPreviewImageRef = "";
      if (artUpload.selectedImage.startsWith("data:image")) {
        const newPreviewImage: SingleFileUpload | undefined =
          await uploadFileToFB(
            artUpload.selectedImage,
            getArtPreviewImageReference(session?._id, fileId.toString())
          );

        await deleteImageFromFB([artDetails?.previewImageRef]);
        console.log("database preview imagee deleted from fb!!...");
        newArtPreviewImage = newPreviewImage?.file;
        newArtPreviewImageRef = newPreviewImage?.reference;
      }

      const remainingImageRefFromArtDetails = [...artEdit.imageRefs];
      let artDetailsImageRef: any = [...artDetails?.artImagesRef];
      let newImagesUploaded: any = [];
      let allArtimagesAlreadyUploaded = [...artImages].filter((image: string) =>
        image.startsWith("https://" || "localhost:")
      );

      if (remainingImageRefFromArtDetails.length < artDetailsImageRef.length) {
        let allArtImagesToUpload = [...artImages].filter((image: string) =>
          image.startsWith("data:image")
        );
        if (allArtImagesToUpload.length > 0) {
          newImagesUploaded = await uploadMultipleImagesToFB(
            allArtImagesToUpload,
            getArtMultipleImagesReference(session?._id, fileId.toString())
          );
          console.log("new images added  and uploaded!!...");
        }
        artDetailsImageRef = artDetailsImageRef.filter(
          (ref: string) => !remainingImageRefFromArtDetails.includes(ref)
        );
        if (artDetailsImageRef.length > 0) {
          await deleteImageFromFB(artDetailsImageRef);
        }
        console.log("database art image deleted!!...");
      }

      const finalImagesTobePublished = [
        ...allArtimagesAlreadyUploaded,
        ...(newImagesUploaded?.images || []),
      ];
      const finalImagesRefs = [
        ...artEdit.imageRefs,
        ...(newImagesUploaded?.references || []),
      ];
      console.log("finalImagesTobePublished >>>", finalImagesTobePublished);

      let artInput = {
        artId,
        title: artUploadData.title,
        description: artUploadData.story,
        artPreview: newArtPreviewImage || artDetails?.artPreview,
        previewImageRef: newArtPreviewImageRef || artDetails?.previewImageRef,
        artImages: finalImagesTobePublished,
        artImagesRef: finalImagesRefs,
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

      const { data: artEditData } = await updateArt({
        variables: { artInput },
        update: (cache, { data: { updateArt } }) => {
          const existingArtDetails = cache.readQuery<any>({
            query: GET_ART_BY_ID,
            variables: {artId}
          })

          cache.writeQuery({
            query: GET_ART_BY_ID,
            variables: {artId},
            data: {
              getArtById: updateArt
            }
          })
        }
      });
      

      if (artUploadData.artType === "auction") {
        router.push(`/art/auction/details/${artDetails?._id}`);
      } else {
        router.push(`/art/details/${artDetails?._id}`);
      }
    } catch (error: any) {
      setErrorOccured(true);
      setErrorMessage(error?.message);
      console.log("error updating art", error);
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

          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start mt-8 lg:space-x-6">
            <div className="w-full lg:w-fit flex flex-col items-center">
              <p className="font-medium text-sm mb-2 ">Thumbnail preview</p>
              <div className="relative h-[20rem] w-full lg:h-[16rem] lg:w-[16rem] mb-6">
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

              <div className="w-fit md:grid md:grid-cols-4 lg:grid-cols-3 flex flex-wrap items-center justify-center mb-[1rem]">
                {artImages.map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative h-[5rem] w-[5rem] mb-1 mr-2"
                  >
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

            <div className={`relative w-full flex-1 border`}>
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
                  <CssTextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    value={artUploadData.title}
                    error={errorOccured}
                    onChange={(e: any) =>
                      setArtUploadData({
                        ...artUploadData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2"> Story </p>
                  <CssTextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="this art is inspired by..."
                    multiline
                    rows={4}
                    value={artUploadData.story}
                    error={errorOccured}
                    onChange={(e: any) =>
                      setArtUploadData({
                        ...artUploadData,
                        story: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2"> Dimensions </p>
                  <CssTextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="100*150"
                    value={artUploadData.dimensions}
                    error={errorOccured}
                    onChange={(e: any) =>
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

                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <FormControl className="w-full lg:w-[20rem] mt-[1rem]">
                    <InputLabel id="select-filter-by-field">
                      <p className="text-black">Category</p>
                    </InputLabel>
                    <Select
                      labelId="select-filter-by-field-labe;"
                      id="select-filter-by-field"
                      sx={{
                        color: "#000",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#A6A6A6",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#808080",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#797979",
                        },
                      }}
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
                  <FormControl className="w-full lg:w-[20rem] mt-[1rem]">
                    <InputLabel id="demo-simple-select-label">
                      <p className="text-black">Art Type</p>
                    </InputLabel>
                    <Select
                      labelId="select-filter-by-field-labe;"
                      id="select-filter-by-field"
                      sx={{
                        color: "#000",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "#A6A6A6",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#808080",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#797979",
                        },
                      }}
                      value={artUploadData.artType}
                      error={errorOccured}
                      onChange={(e) => {
                        setArtUploadData({
                          ...artUploadData,
                          artType: e.target.value,
                        });
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
                    <CssTextField
                      id="outlined-basic"
                      variant="outlined"
                      className="w-full"
                      placeholder="150.00"
                      type="number"
                      value={artUploadData.price}
                      onChange={(e: any) =>
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
                        <CssTextField
                          id="outlined-basic"
                          variant="outlined"
                          className="w-full"
                          placeholder="150.00"
                          type="number"
                          error={errorOccured}
                          value={artUploadData.price}
                          onChange={(e: any) =>
                            setArtUploadData({
                              ...artUploadData,
                              price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between">
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

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-20 ">
                  <ButtonOutlined
                    onClick={cancelUpload}
                    className="sm:w-[8rem] sm:h-[3rem]"
                    title="Cancel"
                  />

                  <div className="flex flex-col-reverse sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0">
                    <ButtonOutlined
                      className="sm:w-[8rem] sm:h-[3rem]"
                      title="Save as draft"
                    />
                    <ButtonSolid
                      onClick={UPDATE_ART}
                      className="sm:w-[8rem] sm:h-[3rem] mb-4 sm:mb-0"
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

export default ContinueArtEdit;
