import { appInitializer } from "@/firebase";
import { GET_ALL_DESIGNS, GET_USER_DESIGNS } from "@/queries/designs";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

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

export const uploadImageToFB = async (
  storage: any,
  selectedImage: any,
  imageReference: any
) => {
  try {
    const imageRef = ref(storage, imageReference);
    if (selectedImage) {
      await uploadString(imageRef, selectedImage, "data_url");
      const url = await getDownloadURL(imageRef);

      const data: SingleImageUpload = {
        reference: imageReference,
        image: url,
      };
      return data;
    }
  } catch (error) {
    console.log("Error uploading image:", error);
  }
}

export const uploadMultipleImagesToFB = async (
  storage: any,
  selectedImages: any,
  imageReference: string
) => {
  const uploadedImageUrls: any = [];
  const imageReferences: any = [];

  try {
    for (let i = 0; i < selectedImages.length; i++) {
      const selectedImage = selectedImages[i];
      const storedImageReference = `${imageReference}__${i}`;
      const url = await uploadImageToFB(
        storage,
        selectedImage,
        storedImageReference
      );
      uploadedImageUrls.push(url?.image);
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
