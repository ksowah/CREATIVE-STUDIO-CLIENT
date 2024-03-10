import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import { DELETE_DESIGN } from "@/apollo/mutations/designs";
import { GET_ALL_DESIGNS, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import { MyContext } from "@/context/Context";
import { useRouter } from "next/navigation";
import ActionConfirmationDialogue from "./ActionConfirmationDialogue";
import { deleteDesignData, deleteImageFromFB } from "@/helpers/functions";
import { LuEye } from "react-icons/lu";

const ProfileWork = ({
  design,
  isUsersProfile,
}: {
  design: Design;
  isUsersProfile: boolean;
}) => {
  const [deleteDesign, { loading, error }] = useMutation(DELETE_DESIGN);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const { appState, setAppState } = useContext(MyContext);

  const { session } = appState;

  const router = useRouter();

  const handleDeleteDesign = async () => {
    setDeleteLoading(true);
    await deleteDesignData(
      [
        design?.previewImageRef,
        ...design?.designImagesRef,
        design?.designFileRef,
      ],
      deleteDesign,
      design?._id,
      session?._id
    );
    setDeleteLoading(false);
  };

  const OpenDialogueButton = () => {
    return (
      <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
        <IoTrashOutline size={16} color="#fff" />
      </div>
    );
  };

  return (
    <div
      className={`group ${
        deleteLoading && "opacity-60"
      } relative h-[16rem] w-[18rem] mb-6`}
    >
      {deleteLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-30"></div>
      )}

      <div className="relative cursor-pointer h-[16rem] w-[18rem] mb-8 rounded-lg overflow-hidden ">
        <Image
          src={design?.preview}
          className="group-hover:scale-125 duration-500"
          fill
          style={{objectFit:"cover"}}
          alt="work"
        />
      </div>

      <div className="absolute opacity-0 z-10 group-hover:opacity-90 duration-500 bottom-0 w-full h-full flex flex-col  px-2 bg-gradient-to-t from-blackRgba to-transparent ">
        <div className="flex flex-1 items-center justify-center space-x-2">
          <div
            onClick={() => router.push(`/design/details/${design?._id}`)}
            className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md "
          >
            <LuEye size={20} color="#fff" />
          </div>
          <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
            <CiHeart size={20} color="#fff" />
          </div>
          {isUsersProfile ? (
            <ActionConfirmationDialogue
              action={handleDeleteDesign}
              actionButtonTitle="Delete"
              actionHeaderTitle="Delete Design"
              actionBodyText="Are you sure you want to delete this design? This action cannot be undone."
              OpenDialogueButton={OpenDialogueButton}
            />
          ) : (
            <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
              <TfiSave size={16} color="#fff" />
            </div>
          )}
        </div>
        <p className="text-xs text-white py-2 line-clamp-1 ">{design?.title}</p>
      </div>
    </div>
  );
};

export default ProfileWork;
