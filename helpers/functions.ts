import { getDownloadURL, ref, uploadString } from "firebase/storage";

export const registerNewUser = async (
  registerData: any,
  setSuccess: any,
  setRegistrationError: any,
  registerUser: any,
  setErrorMessage: any,
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
    console.log(data);
  } catch (error:any) {
    setSuccess(false);
    setRegistrationError(true);
    setErrorMessage(error?.message);
  }
};

export const handleLogin = async (
  loginData: any,
  setSuccess: any,
  setRegistrationError: any,
  login: any,
  router: any,
  setAppState: any,
  setErrorMessage: any,
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
      setAppState((prev:any) => ({ ...prev, session: data?.login.user}))
      console.log(" session data >>", data);
      
      router.push("/");
    }
  } catch (error:any) {
    setSuccess(false);
    setRegistrationError(true);
    setErrorMessage(error?.message);
    console.log("This the error >>", error?.message);
  }
};

export const selectImage = (e: any, setPickedImage:any) => {
  const reader = new FileReader();
  if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
  }
  reader.onload = (readerEvent: any) => {
    setPickedImage(readerEvent.target.result);
  };
};

export const uploadImageToFB = async (
  storage: any,
  refId: string,
  userId: string,
  selectedImage: any,
) => {

  try {
    const imageRef = ref(storage, `images/${refId}/user_${userId}`);
    if (selectedImage) {
      await uploadString(imageRef, selectedImage, "data_url");
      const url = await getDownloadURL(imageRef);
      console.log("downloadable url", url);
      return url;
    }
  } catch (error) {
    console.log("Error uploading image:", error);
  }
};

export const uploadMultipleImagesToFB = async (
  storage: any,
  refId:string,
  userId: string,
  selectedImages: any,
) => {
  const uploadedImageUrls:any = [];

  try {
    for (let i = 0; i < selectedImages.length; i++) {
      const selectedImage = selectedImages[i];
      const url = await uploadImageToFB(storage, `${refId}__${i}`, userId, selectedImage);
      uploadedImageUrls.push(url);
    }
    console.log("uploadedImageUrls >>", uploadedImageUrls);
    return uploadedImageUrls;
  } catch (error) {
    console.log("Error uploading images:", error);
    return [];
  }
};


