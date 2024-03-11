import { appInitializer } from "@/firebase";
import { GET_ALL_DESIGNS, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { GET_ALL_ARTS, GET_USER_ARTS } from "@/apollo/queries/arts";

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

    if (data?.login) {
      localStorage.setItem("cstoken", data?.login?.token);
      setRegistrationError(false);
      setSuccess(true);
      setAppState((prev: any) => ({ ...prev, session: data?.login.user }));

      router.push("/");
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
