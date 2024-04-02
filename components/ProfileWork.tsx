import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_DESIGN,
  LIKE_DESIGN,
  SAVE_DESIGN,
  UNLIKE_DESIGN,
  UNSAVE_DESIGN,
} from "@/apollo/mutations/designs";
import {
  GET_ALL_DESIGNS,
  GET_DESIGN_LIKES,
  GET_SAVED_DESIGNS,
  GET_USER_DESIGNS,
} from "@/apollo/queries/designs";
import { MyContext } from "@/context/Context";
import { useRouter } from "next/navigation";
import ActionConfirmationDialogue from "./ActionConfirmationDialogue";
import {
  deleteDesignData,
  deleteImageFromFB,
  handleLikeDesign,
  handleSaveDesign,
} from "@/helpers/functions";
import { LuEye } from "react-icons/lu";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";

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

  const { data } = useQuery(GET_DESIGN_LIKES, {
    variables: { designId: design?._id },
  });
  const [likeDesign] = useMutation(LIKE_DESIGN);
  const [unlikeDesign] = useMutation(UNLIKE_DESIGN);
  const [saveDesign] = useMutation(SAVE_DESIGN);
  const [unsaveDesign] = useMutation(UNSAVE_DESIGN);

  const [likeLoading, setLikeLoading] = useState(false);

  const { data: savedDesignsData } = useQuery(GET_SAVED_DESIGNS);
  let savedDesigns = savedDesignsData?.getSavedDesigns || [];

  const [alreadyLiked, setAlreadyLiked] = useState<any>(false);
  const [alreadySaved, setAlreadySaved] = useState<any>(false);
  const [saveLoading, setSaveLoading] = useState(false);

  let designLikes = data?.getDesignLikes?.data;

  useEffect(() => {
    setAlreadyLiked(
      designLikes?.findIndex(
        (like: any) => like.likedBy._id === session?._id
      ) !== -1
    );
  }, [designLikes]);

  useEffect(() => {
    setAlreadySaved(
      savedDesigns?.findIndex(
        (saved: any) => saved.design._id === design?._id
      ) !== -1
    );
  }, [savedDesigns]);

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
          style={{ objectFit: "cover" }}
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
          {likeLoading ? (
            <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
              <FaHeart className="text-pink-200" size={18} />
            </div>
          ) : (
            <div
              onClick={() =>
                handleLikeDesign(
                  alreadyLiked,
                  unlikeDesign,
                  design?._id,
                  setLikeLoading,
                  likeDesign
                )
              }
              className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md "
            >
              {alreadyLiked ? (
                <FaHeart className="text-pink-500" size={18} />
              ) : (
                <FaRegHeart size={18} color="#fff" />
              )}
            </div>
          )}

          {isUsersProfile ? (
            <ActionConfirmationDialogue
              action={handleDeleteDesign}
              actionButtonTitle="Delete"
              actionHeaderTitle="Delete Design"
              actionBodyText="Are you sure you want to delete this design? This action cannot be undone."
              OpenDialogueButton={OpenDialogueButton}
            />
          ) : (
            <div onClick={()=>handleSaveDesign(
              alreadySaved,
              unsaveDesign,
              design?._id,
              design?.designer._id,
              setSaveLoading,
              saveDesign,
            )} className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
              {saveLoading ? (
                <FaBookmark
                  size={16}
                  className="text-[#dddde1]"
                />
              ) : (
                <>
                  {alreadySaved ? (
                    <FaBookmark
                      size={16}
                      color="#fff"
                    />
                  ) : (
                    <FaRegBookmark size={16} color="#fff" />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-white py-2 line-clamp-1 ">{design?.title}</p>
      </div>
    </div>
  );
};

export default ProfileWork;
