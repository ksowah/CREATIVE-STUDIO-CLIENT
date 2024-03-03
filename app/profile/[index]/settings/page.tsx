"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import CoverLoader from "@/components/CoverLoader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SessionAvatar from "@/components/SessionAvatar";
import SettingsContainer from "@/components/SettingsContainer";
import { MyContext } from "@/context/Context";
import { appInitializer } from "@/firebase";
import { selectImage, uploadFileToFB } from "@/helpers/functions";
import { getProfileImageReference } from "@/helpers/firebaseFileReferences";
import { EDIT_PROFILE, GET_ME, GET_USER_BY_USERNAME } from "@/apollo/queries/user";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, TextField } from "@mui/material";
import { getStorage } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const Settings = () => {
  const { data: session } = useQuery(GET_ME);
  const currentUserData:User = session?.getMe?.user;

  const storage = getStorage(appInitializer);
  const imageId = new Date().getTime();

  const [editProfileData, setEditProfileData] = useState({
    fullName: "",
    bio: "",
    specialization: "",
    phoneNumber: "",
    website: "",
  });

  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pickedImage, setPickedImage] = useState(null);

  const filePickerRef = useRef<any>(null);

  useEffect(() => {
    setEditProfileData({
      fullName: currentUserData?.fullName,
      bio: currentUserData?.bio,
      specialization: currentUserData?.specialization,
      phoneNumber: currentUserData?.phoneNumber,
      website: currentUserData?.website,
    });
  }, [currentUserData]);

  const [editProfile] = useMutation(EDIT_PROFILE);

  const scroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditProfile = async () => {
    setUpdateLoading(true)
    scroll();

    let profileImageURL = currentUserData?.avatar

    if (pickedImage) {
      const imageURL = await uploadFileToFB(
        pickedImage,
        getProfileImageReference(currentUserData?._id, imageId.toString())
      ); 

      if(imageURL) profileImageURL = imageURL?.file
    }

    try {
      const { data } = await editProfile({
        variables: {
          editProfileInput: {
            fullName: editProfileData.fullName,
            avatar: profileImageURL,
            bio: editProfileData.bio,
            specialization: editProfileData.specialization,
            phoneNumber: editProfileData.phoneNumber,
            website: editProfileData.website,
          },
        },
        // Update cache for GET_ME query after the mutation is completed
        update: (cache, { data: { editProfile: user } }) => {
          cache.writeQuery({
            query: GET_ME,
            data: { getMe: user },
          });

          cache.writeQuery({
            query: GET_USER_BY_USERNAME,
            variables: { username: user.username },
            data: { getUserByUsername: user }, // Update the cache with the updated user data
          });
        },
      });

      localStorage.setItem("cstoken", data?.editProfile.token);
      setIsSuccessful(true);
      setIsErrorOccured(false);
      setPickedImage(null)
    } catch (error: any) {
      setErrorMessage(error?.message);
      setIsErrorOccured(true);
      setIsSuccessful(false);
      console.error("Edit profile error:", error);
    }
    setUpdateLoading(false)
  }

  return (
    <div className="bg-[#F3F3F3] ">
      <Header />
      <Container>
        <SettingsContainer>
          {isSuccessful && (
            <Alert severity="success" className="mb-6">
              Profile updated successfully!
            </Alert>
          )}
          {isErrorOccured && (
            <Alert severity="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}
          <div className="relative">
            {updateLoading && <CoverLoader />}
            <div className=" p-[2rem]">
              <h2 className="font-medium text-[1.6rem] ">Edit Profile</h2>

              <div className="flex items-center mt-6 space-x-8 ">
                <SessionAvatar
                  image={pickedImage ? pickedImage : currentUserData?.avatar}
                  size={170}
                />

                <div className="flex items-center space-x-4">
                  <input
                    type={"file"}
                    accept=".png, .jpeg, .tiff, .jpg"
                    hidden
                    onChange={(event) => selectImage(event, setPickedImage)}
                    ref={filePickerRef}
                  />
                  <ButtonSolid
                    onClick={() => filePickerRef.current.click()}
                    className="w-[8rem] "
                    title="Change Photo"
                  />

                  <ButtonOutlined className="w-[8rem]" title="Delete" />
                </div>
              </div>

              <div className="py-[4rem] space-y-6 ">
                <div>
                  <p className="text-md font-medium mb-2 "> Full Name </p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    error={isErrorOccured}
                    className="w-full"
                    placeholder="Kelvin Sowah"
                    value={editProfileData?.fullName || ""}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-md font-medium mb-2">Specialization</p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="Product Designer"
                    value={editProfileData?.specialization || ""}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <p className="text-md font-medium mb-2 text-[#B1B1B1] ">
                    Username
                  </p>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className="w-full"
                    placeholder="Ksowah"
                    value={currentUserData?.username || ""}
                    disabled
                  />
                </div>
                <div>
                  <p className="text-md font-medium mb-2">Bio</p>
                  <TextField
                    id="outlined-basic"
                    multiline
                    rows={5}
                    variant="outlined"
                    className="w-full"
                    placeholder="I am a..."
                    value={editProfileData?.bio || ""}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        bio: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="pt-10 space-y-6">
                  <h3 className="font-medium text-[1.2rem] ">Contact Info</h3>

                  <div>
                    <p className="text-md font-medium mb-2">Phone Number</p>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      className="w-full"
                      type="tel"
                      value={editProfileData?.phoneNumber || ""}
                      onChange={(e) =>
                        setEditProfileData({
                          ...editProfileData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <p className="text-md font-medium mb-2 text-[#B1B1B1]">
                      Email
                    </p>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      className="w-full"
                      type="email"
                      value={currentUserData?.email || ""}
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-10 space-y-6">
                  <h3 className="font-medium text-[1.2rem] ">Links</h3>

                  <div>
                    <p className="text-md font-medium mb-2">
                      Portfolio Website
                    </p>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      className="w-full"
                      type="url"
                      value={editProfileData?.website || ""}
                      onChange={(e) =>
                        setEditProfileData({
                          ...editProfileData,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-end pb-6 ">
                <ButtonSolid onClick={handleEditProfile} title="Save Changes" />
              </div>
            </div>
          </div>
        </SettingsContainer>

        <Footer />
      </Container>
    </div>
  );
};

export default Settings;
