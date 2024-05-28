import { appInitializer } from "@/firebase";
import { GET_ALL_DESIGNS, GET_DESIGN_LIKES, GET_SAVED_DESIGNS, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { GET_ALL_ARTS, GET_USER_ARTS } from "@/apollo/queries/arts";
import { GET_FOLLOWERS } from "@/apollo/queries/user";

const storage = getStorage(appInitializer);

export const registerNewUser = async (
  registerData: any,
  setSuccess: any,
  setRegistrationError: any,
  registerUser: any,
  setErrorMessage: any
) => {
  try {
    const { data } = await registerUser({
      variables: {
        registerInput: registerData,
      },
    });

    if (data?.register) {
      setRegistrationError(false);
      setSuccess(true);
    }
  } catch (error: any) {
    setSuccess(false);
    setRegistrationError(true);
    setErrorMessage(error?.message);
  }
}

export const handleLogin = async (
  loginData: any,
  setSuccess: any,
  setRegistrationError: any,
  login: any,
  router: any,
  setAppState: any,
  setErrorMessage: any
) => {
  try {
    const { data } = await login({
      variables: {
        loginInput: loginData,
      },
    });

    const session = data?.login

    if (session) {
      localStorage.setItem("cstoken", data?.login?.token);
      setRegistrationError(false);
      setSuccess(true);
      setAppState((prev: any) => ({ ...prev, session: session.user }));

      if (session.user?.userType === "ARTIST"){
        router.push("/art");
      } else {
        router.push("/")
      }
    }
  } catch (error: any) {
    setSuccess(false);
    setRegistrationError(true);
    setErrorMessage(error?.message);
    console.log("This the error >>", error?.message);
  }
}

export const selectImage = (e: any, setPickedImage: any) => {
  const reader = new FileReader();
  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
  }
  reader.onload = (readerEvent: any) => {
    setPickedImage(readerEvent.target.result);
  };
}

export const uploadFileToFB = async (
  selectedFile: any,
  imageReference: any
) => {
  try {
    const fileRef = ref(storage, imageReference);
    if (selectedFile) {
      await uploadString(fileRef, selectedFile, "data_url");
      const url = await getDownloadURL(fileRef);

      const data: SingleFileUpload = {
        reference: imageReference,
        file: url,
      };
      return data;
    }
  } catch (error) {
    console.log("Error uploading image:", error);
  }
}

export const uploadMultipleImagesToFB = async (
  selectedImages: any,
  imageReference: string
) => {
  const uploadedImageUrls: any = [];
  const imageReferences: any = [];

  try {
    for (let i = 0; i < selectedImages.length; i++) {
      const selectedImage = selectedImages[i];
      const storedImageReference = `${imageReference}__${i}`;
      const url = await uploadFileToFB(
        selectedImage,
        storedImageReference
      );
      uploadedImageUrls.push(url?.file);
      imageReferences.push(storedImageReference);
    }

    const data: MultipleImageUpload = {
      references: imageReferences,
      images: uploadedImageUrls,
    };
    return data;
  } catch (error) {
    console.log("Error uploading images:", error);
    return [];
  }
}

export const deleteImageFromFB = async (imgReferences: [string]) => {
  try {
    for (let i = 0; i < imgReferences.length; i++) {
      let imageRef = ref(storage, imgReferences[i]);
      await deleteObject(imageRef);
      console.log("File deleted successfully", i);
    }
  } catch (e) {
    console.log("Error deleting file", e);
  }
}

export const deleteDesignData = async (
  designImagesRefs: any,
  deleteDesign: any,
  designId: string,
  userId: string
) => {
  try {
    await deleteImageFromFB(designImagesRefs)

    await deleteDesign({
      variables: { designId },
      update: (cache: any) => {
        // update the cache to remove the deleted design from the list of all designs
        const existingDesigns: any = cache.readQuery({
          query: GET_ALL_DESIGNS,
        });

        const updatedDesigns = existingDesigns?.getAllDesigns.filter(
          (design: Design) => design._id !== designId
        );

        cache.writeQuery({
          query: GET_ALL_DESIGNS,
          data: {
            getAllDesigns: updatedDesigns,
          },
        });

        // update the cache to remove the deleted design from the list of user designs
        const existingUserDesigns: any = cache.readQuery({
          query: GET_USER_DESIGNS,
          variables: { userId },
        });

        if (existingUserDesigns) {
          const updatedUserDesigns = existingUserDesigns.getUserDesigns.filter(
            (designItem: Design) => designItem._id !== designId
          );
          cache.writeQuery({
            query: GET_USER_DESIGNS,
            variables: { userId },
            data: {
              getUserDesigns: updatedUserDesigns,
            },
          });
        }
      },
    });
  } catch (error) {
    console.error("Error deleting design:", error);
  }
};

export const deleteArtData = async (
  artImagesRefs: any,
  deleteArtFunc: any,
  artId: string,
  userId: string
) => {
  try {
    await deleteImageFromFB(artImagesRefs)

    await deleteArtFunc({
      variables: { artId },
      update: (cache: any) => {
        // update the cache to remove the deleted design from the list of all designs
        const existingArts: any = cache.readQuery({
          query: GET_ALL_ARTS,
        });

        const updatedArts = existingArts?.getAllArtWorks.filter(
          (art: ArtPiece) => art._id !== artId
        );

        cache.writeQuery({
          query: GET_ALL_ARTS,
          data: {
            getAllArtWorks: updatedArts,
          },
        });

        // update the cache to remove the deleted design from the list of user designs
        const existingUserArts: any = cache.readQuery({
          query: GET_USER_ARTS,
          variables: { userId },
        });

        if (existingUserArts) {
          const updatedUserArts = existingUserArts.getUserArtWorks.filter(
            (art: ArtPiece) => art._id !== artId
          );
          cache.writeQuery({
            query: GET_USER_ARTS,
            variables: { userId },
            data: {
              getUserArtWorks: updatedUserArts,
            },
          });
        }
      },
    });
  } catch (error) {
    console.error("Error deleting design:", error);
  }
};

export  const handleSaveDesign = async (
  alreadySaved:boolean,
  unsaveDesign: any,
  designID: string,
  designerID: string,
  setSaveLoading: any,
  saveDesign: any,
) => {
  try {
    if (alreadySaved) {
      await unsaveDesign({
        variables: { designId: designID },
        update: (cache:any) => {
          const existingSavedDesigns:any = cache.readQuery({
            query: GET_SAVED_DESIGNS,
          });

          if (existingSavedDesigns) {
            const updatedSavedDesigns =
              existingSavedDesigns.getSavedDesigns.filter(
                (design: any) => design.design._id !== designID
              );

            cache.writeQuery({
              query: GET_SAVED_DESIGNS,
              data: {
                getSavedDesigns: updatedSavedDesigns,
              },
            });
          }
        },
      });
    } else {
      setSaveLoading(true);
      await saveDesign({
        variables: {
          designId: designID,
          designer: designerID,
        },
        update: (cache:any, { data: { saveDesign } }:any) => {
          const existingSavedDesigns = cache.readQuery({
            query: GET_SAVED_DESIGNS,
          });

          cache.writeQuery({
            query: GET_SAVED_DESIGNS,
            data: {
              getSavedDesigns: [
                saveDesign,
                ...(existingSavedDesigns?.getSavedDesigns || []),
              ],
            },
          });
        },
      });

      setTimeout(() => {
        setSaveLoading(false);
      }, 1500);
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleLikeDesign = async (
  alreadyLiked: boolean,
  unlikeDesign: any,
  designId: string,
  setLikeLoading: any,
  likeDesign: any,
) => {
  try {
    if (alreadyLiked) {
      await unlikeDesign({
        variables: { designId },
        update: (cache:any) => {
          const existingLikes = cache.readQuery({
            query: GET_DESIGN_LIKES,
            variables: { designId },
          });

          if (existingLikes) {
            const updatedLikes = existingLikes.getDesignLikes.data.filter(
              (like: any) => like._id !== designId
            );

            cache.writeQuery({
              query: GET_DESIGN_LIKES,
              variables: { designId },
              data: {
                getDesignLikes: updatedLikes,
              },
            });
          }
        },
      });
    } else {
      setLikeLoading(true);
      await likeDesign({
        variables: { designId },
        update: (cache:any, { data: { likeDesign }}:any) => {
          const existingLikes = cache.readQuery({
            query: GET_DESIGN_LIKES,
            variables: { designId },
          });

          cache.writeQuery({
            query: GET_DESIGN_LIKES,
            variables: { designId },
            data: {
              getDesignLikes: [
                likeDesign,
                ...(existingLikes?.getDesignLikes.data || []),
              ],
            },
          });
        },
      });

      setTimeout(() => {
        setLikeLoading(false);
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleFollowUser = async (
  alreadyFollowed: boolean,
  unfollow: any,
  followedUser: string,
  sessionId: string,
  follow: any,
) => {
  try {
    if (alreadyFollowed) {
      await unfollow({
        variables: { followedUser },
        update: (cache:any) => {
          const existingFollowers = cache.readQuery({
            query: GET_FOLLOWERS,
            variables: { userId: followedUser },
          });

          if (existingFollowers) {
            const updatedFollowers =
              existingFollowers.getFollowers.data.filter(
                (follower: any) =>
                  follower.followedBy !== sessionId
              );

            cache.writeQuery({
              query: GET_FOLLOWERS,
              variables: { userId: followedUser },
              data: {
                getFollowers: updatedFollowers,
              },
            });
          }
        },
      });
    } else {
      await follow({
        variables: { followedUser },
        update: (cache:any, { data: { follow }}:any) => {
          const existingFollowers = cache.readQuery({
            query: GET_FOLLOWERS,
            variables: { userId: followedUser },
          });

          cache.writeQuery({
            query: GET_FOLLOWERS,
            variables: { userId: followedUser },
            data: {
              getFollowers: [
                follow,
                ...(existingFollowers?.getFollowers.data || []),
              ],
            },
          });
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const formatAmount = (amount: number) => {
  // Convert amount to a number
  const numericAmount = Number(amount);

  // Check if the amount is a valid number
  if (isNaN(numericAmount)) {
    return "Invalid amount";
  }

  if (numericAmount === 0) {
    return "0.00";
  }
  // Check if the number has decimal places
  const hasDecimalPlaces = numericAmount % 1 !== 0;

  // Use toLocaleString() to add commas and format the number
  let formattedAmount = numericAmount.toLocaleString();

  // If the number has decimal places, format it with exactly 2 decimal places
  if (hasDecimalPlaces) {
    formattedAmount = numericAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return formattedAmount;
};
