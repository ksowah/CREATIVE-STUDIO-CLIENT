"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
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
import ButtonOutlined from "./ButtonOutlined";
import ButtonSolid from "./ButtonSolid";
import { useMutation } from "@apollo/client";
import { CREATE_DESIGN } from "@/apollo/mutations/designs";
import { LiaTimesSolid } from "react-icons/lia";
import { GET_ALL_DESIGNS, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/Context";
import { uploadFileToFB } from "@/helpers/functions";
import { getDesignFileReference } from "@/helpers/firebaseFileReferences";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  selectedImage: any;
  selectedDesignImages: any;
  setSelectedImages: any;
  setSelectedImage: any;
  getPreviewImage: () => Promise<SingleFileUpload | undefined>;
  getDesignImagesURLs: () => Promise<MultipleImageUpload>;
  getDesignFile: () => Promise<SingleFileUpload | undefined>;
  selectDesignFile: (e: any) => void;
  designFilePickerRef: any;
  designFileSelected: any;
  selectedDesignFileName: string;
  projectTitle: string;
  setProjectTitle: any;
}

export default function UploadDialogue({
  selectedImage,
  selectedDesignImages,
  setSelectedImages,
  setSelectedImage,
  getPreviewImage,
  getDesignImagesURLs,
  getDesignFile,
  selectDesignFile,
  designFilePickerRef,
  designFileSelected,
  selectedDesignFileName,
  projectTitle,
  setProjectTitle,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [publishLoading, setPublishLoading] = React.useState(false);
  const [isErrorOccured, setIsErrorOccured] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  
  const [designUploadData, setDesignUploadData] = React.useState({
    tags: "",
    description: "",
    category: "",
    subscription: "",
  });
  const [designUploadDataEmptyState, setDesignUploadDataEmptyState] =
    React.useState({
      tags: false,
      description: false,
      category: false,
      subscription: false,
    });

  const { appState, setAppState } = React.useContext(MyContext);
  const user:User = appState.session;

  const router = useRouter();

  const handleClickOpen = () => {
    if (selectedImage && projectTitle) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeImage = (idx: number) => {
    setSelectedImages((prevSelectedImages: any) =>
      prevSelectedImages.filter((_: any, index: number) => index !== idx)
    );
  };

  const cancelUpload = () => {
    setSelectedImage(null);
    setSelectedImages([]);
    setDesignUploadData({
      tags: "",
      description: "",
      category: "",
      subscription: "",
    });
    setProjectTitle("");
    handleClose();
  };

  const [createDesign, { error }] = useMutation(CREATE_DESIGN);


  const filloutDesignData = async (
    designImages: MultipleImageUpload,
    preview: SingleFileUpload | undefined,
    designFile: SingleFileUpload | undefined
  ) => {
    let designTags = designUploadData.tags.split(",");

    try {
      const { data } = await createDesign({
        variables: {
          createDesignInput: {
            tags: designTags,
            description: designUploadData.description,
            category: designUploadData.category,
            designSubscription: designUploadData.subscription,
            designFile: designFile?.file,
            designFileRef: designFile?.reference,
            designImages: designImages?.images,
            designImagesRef: designImages?.references,
            preview: preview?.file,
            previewImageRef: preview?.reference,
            title: projectTitle,
          },
        },
        update: (cache, { data: { createDesign } }) => {
          // Read the existing designs from the cache
          const existingDesigns = cache.readQuery<any>({
            query: GET_ALL_DESIGNS,
          });

          // Update the cache with the new design added to the beginning of the list
          cache.writeQuery({
            query: GET_ALL_DESIGNS,
            data: {
              getAllDesigns: [
                createDesign,
                ...(existingDesigns?.getAllDesigns || []),
              ],
            },
          });

          const existingUserDesigns = cache.readQuery<any>({
            query: GET_USER_DESIGNS,
            variables: { userId: user?._id },
          });

          cache.writeQuery({
            query: GET_USER_DESIGNS,
            variables: { userId: user?._id },
            data: {
              getUserDesigns: [
                createDesign,
                ...(existingUserDesigns?.getUserDesigns || []),
              ],
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const CREATE_NEW_DESIGN = async () => {
    setPublishLoading(true);

    if (designUploadData.tags.length === 0) {
      setDesignUploadDataEmptyState({
        ...designUploadDataEmptyState,
        tags: true,
      });
      setPublishLoading(false);
      return;
    }

    if (designUploadData.description.length === 0) {
      setDesignUploadDataEmptyState({
        ...designUploadDataEmptyState,
        description: true,
      });
      setPublishLoading(false);
      return;
    }

    if (designUploadData.category.length === 0) {
      setDesignUploadDataEmptyState({
        ...designUploadDataEmptyState,
        category: true,
      });
      setPublishLoading(false);
      return;
    }
    if (designUploadData.subscription.length === 0) {
      setDesignUploadDataEmptyState({
        ...designUploadDataEmptyState,
        subscription: true,
      });
      setPublishLoading(false);
      return;
    }

    if (!designFileSelected) {
      setErrorMessage("Please select a design file");
      setPublishLoading(false);
      setIsErrorOccured(true);
      return;
    }

    if (user?.userType !== "DESIGNER" && user?.userType !== "CREATOR") {
      setErrorMessage("You are not authorized to publish designs");
      setPublishLoading(false);
      setIsErrorOccured(true);
      return;
    }

    try {
      const designImages = await getDesignImagesURLs();
      const preview = await getPreviewImage();
      const designFile = await getDesignFile();

      await filloutDesignData(designImages, preview, designFile);
      cancelUpload();
      setPublishLoading(false);
      setErrorMessage("");
      setIsErrorOccured(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occured while publishing your design");
      setIsErrorOccured(true);
      setPublishLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        className="h-[2.8rem] w-[9rem]"
        color="inherit"
        variant="outlined"
        sx={{
          cursor: selectedImage && projectTitle ? "pointer" : "not-allowed",
        }}
        onClick={handleClickOpen}
      >
        <p className="normal-case font-medium">Continue</p>
      </Button>
      <Dialog
        maxWidth={false}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {publishLoading && <LinearProgress color="inherit" />}
        <div className="relative">
          {publishLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-midDrakRgba z-50"></div>
          )}

          {isErrorOccured && (
            <Alert className={`mb-2 `} severity="error">
              {errorMessage}
            </Alert>
          )}
          <DialogTitle>{"Final Touches"}</DialogTitle>
          <DialogContent className="w-[60rem] pb-[2rem] ">
            <div className="w-full flex items-start space-x-4">
              <div className="">
            <p className="font-medium text-sm mb-2">Thumbnail preview</p>
                <div className="relative h-[16rem] w-[16rem] mb-6">
                  <Image
                    src={selectedImage ? selectedImage : "/images/slide2.jpg"}
                    fill
                    alt=""
                    style={{objectFit:"cover"}}
                  />
                </div>

                <div className="w-[16rem] h-5 md:grid grid-cols-3 flex flex-wrap items-center justify-center">
                  {selectedDesignImages?.map((image: any, idx: number) => (
                    <div key={idx} className="relative h-[5rem] w-[5rem] mb-1">
                      <div
                        onClick={() => removeImage(idx)}
                        className="absolute z-10 h-[1.4rem] w-[1.4rem] rounded-full bg-white cursor-pointer flex items-center justify-center right-1 top-1 "
                      >
                        <LiaTimesSolid size={16} />
                      </div>
                      <Image src={image} fill alt="" style={{objectFit:"cover"}} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    Tag{" "}
                    <span className="text-xs font-normal text-[#797979]">
                      separate each tag with a comma &quot;,&quot; (maximum 20)
                    </span>
                  </p>
                  <TextField
                    id="outlined-basic"
                    label="Add tags..."
                    variant="outlined"
                    className="w-full"
                    error={designUploadDataEmptyState.tags}
                    value={designUploadData.tags}
                    onChange={(e) =>
                      setDesignUploadData({
                        ...designUploadData,
                        tags: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm font-medium my-1">
                    Suggested:{" "}
                    <span className="text-xs font-normal text-[#797979]">
                      design, illustration, ui, branding, logo, graphic, vector
                      , ux, typography, app, art
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2"> Description </p>
                  <TextField
                    id="outlined-basic"
                    multiline
                    rows={4}
                    label="description"
                    variant="outlined"
                    className="w-full"
                    error={designUploadDataEmptyState.description}
                    value={designUploadData.description}
                    onChange={(e) =>
                      setDesignUploadData({
                        ...designUploadData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FormControl fullWidth>
                    <p className="text-sm font-medium mb-2"> Category </p>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                      className="flex flex-row justify-between"
                      value={designUploadData.category}
                      onChange={(e) =>
                        setDesignUploadData({
                          ...designUploadData,
                          category: e.target.value,
                        })
                      }
                    >
                      <div className="flex flex-col">
                        <FormControlLabel
                          value="Mobile"
                          control={<Radio />}
                          label="Mobile"
                        />
                        <FormControlLabel
                          value="Web"
                          control={<Radio />}
                          label="Web"
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormControlLabel
                          value="Typography"
                          control={<Radio />}
                          label="Typography"
                        />
                        <FormControlLabel
                          value="Photography"
                          control={<Radio />}
                          label="Photography"
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormControlLabel
                          value="Illustration"
                          control={<Radio />}
                          label="Illustration"
                        />
                        <FormControlLabel
                          value="Animation"
                          control={<Radio />}
                          label="Animation"
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>

                <FormControl className="w-[20rem] ">
                  <InputLabel id="demo-simple-select-label">
                    Design Subscription
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    error={designUploadDataEmptyState.subscription}
                    value={designUploadData.subscription}
                    label="Design Subscription"
                    onChange={(e) =>
                      setDesignUploadData({
                        ...designUploadData,
                        subscription: e.target.value,
                      })
                    }
                  >
                    <MenuItem value={"FREE"}>FREE</MenuItem>
                    <MenuItem value={"PAID"}>PAID</MenuItem>
                  </Select>
                </FormControl>

                <div className="pt-4 flex-1 flex items-center justify-between ">
                  <input
                    type={"file"}
                    accept=".fig, .jam, .psd"
                    hidden
                    onChange={selectDesignFile}
                    ref={designFilePickerRef}
                  />
                  <ButtonSolid
                    onClick={() => designFilePickerRef.current.click()}
                    title="Select design file"
                  />

                  {designFileSelected && (
                    <div className="flex items-center space-x-3 ">
                      <div className="relative h-[3rem] w-[3rem] rounded-lg overflow-hidden">
                        <Image
                          src={"/images/figma_logo.png"}
                          alt="file logo"
                          fill
                          style={{objectFit:"cover"}}
                        />
                      </div>
                      <p className="font-medium text-sm ">
                        {selectedDesignFileName}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 ">
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
                      onClick={CREATE_NEW_DESIGN}
                      className="w-[8rem] h-[3rem]"
                      title="Publish now"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
