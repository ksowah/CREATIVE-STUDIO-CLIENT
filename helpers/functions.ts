import { getDownloadURL, ref, uploadString } from "firebase/storage";

export const registerNewUser = async (
  registerData: any,
  setFormEmptyState: any,
  formEmptyState: any,
  setSuccess: any,
  setRegistrationError: any,
  registerUser: any
) => {
  if (registerData.fullName.length === 0) {
    setFormEmptyState({ ...formEmptyState, fullName: true });
  }

  if (registerData.username.length === 0) {
    setFormEmptyState({ ...formEmptyState, username: true });
  }

  if (registerData.email.length === 0) {
    setFormEmptyState({ ...formEmptyState, email: true });
  }

  if (registerData.password.length === 0) {
    setFormEmptyState({ ...formEmptyState, password: true });
  }

  if (
    registerData.fullName === null ||
    registerData.username === null ||
    registerData.email === null ||
    registerData.password === null
  ) {
    setSuccess(false);
    setRegistrationError(true);
    return;
  }

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
  } catch (error) {
    setSuccess(false);
    setRegistrationError(true);
    console.log("This the error >>", error);
  }
};

export const handleLogin = async (
  loginData: any,
  setFormEmptyState: any,
  formEmptyState: any,
  setSuccess: any,
  setRegistrationError: any,
  setLoading: any,
  login: any,
  router: any,
  setAppState: any,
) => {
  setLoading(true);

  if (loginData.email.length === 0) {
    setFormEmptyState({ ...formEmptyState, email: true });
  }

  if (loginData.password.length === 0) {
    setFormEmptyState({ ...formEmptyState, password: true });
  }

  if (loginData.email === null || loginData.password === null) {
    setSuccess(false);
    setRegistrationError(true);
    return;
  }

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
  } catch (error) {
    setSuccess(false);
    setRegistrationError(true);
    console.log("This the error >>", error);
  }
  setLoading(false);
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
