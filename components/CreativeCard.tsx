"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FaBookmark, FaRegComment } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { cache, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionAvatar from "./SessionAvatar";
import { IoEyeOutline } from "react-icons/io5";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_DESIGN_LIKES, GET_SAVED_DESIGNS } from "@/apollo/queries/designs";
import {
  LIKE_DESIGN,
  SAVE_DESIGN,
  UNLIKE_DESIGN,
  UNSAVE_DESIGN,
} from "@/apollo/mutations/designs";
import { NEW_LIKE_SUBSCRIPTION } from "@/apollo/subscriptions";
import { MyContext } from "@/context/Context";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { handleLikeDesign, handleSaveDesign } from "@/helpers/functions";
import PromptSigninPopup from "./PromptSigninPopup";

const CreativeCard = ({ designDetails }: { designDetails: Design }) => {
  const router = useRouter();

  const [imageLoading, setImageLoading] = useState(true);

  const { data, loading } = useQuery(GET_DESIGN_LIKES, {
    variables: { designId: designDetails?._id },
  });
  const [likeDesign] = useMutation(LIKE_DESIGN);
  const [unlikeDesign] = useMutation(UNLIKE_DESIGN);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [saveDesign] = useMutation(SAVE_DESIGN);
  const [unsaveDesign] = useMutation(UNSAVE_DESIGN);

  const { data: savedDesignsData } = useQuery(GET_SAVED_DESIGNS);
  let savedDesigns = savedDesignsData?.getSavedDesigns || [];

  const [alreadyLiked, setAlreadyLiked] = useState<any>(false);
  const [alreadySaved, setAlreadySaved] = useState<any>(false);
  const [saveCount, setSaveCount] = useState<any>(designDetails?.saves);

  const { appState } = useContext(MyContext);

  const user: User = appState?.session;

  let designLikes = data?.getDesignLikes?.data;

  useEffect(() => {
    setAlreadyLiked(
      designLikes?.findIndex((like: any) => like.likedBy._id === user?._id) !==
        -1
    );
  }, [designLikes]);

  useEffect(() => {
    setAlreadySaved(
      savedDesigns?.findIndex(
        (design: any) => design.design._id === designDetails?._id
      ) !== -1
    );
  }, [savedDesigns]);

  const saveDesignToCollection = async () => {
    await handleSaveDesign(
      alreadySaved,
      unsaveDesign,
      designDetails?._id,
      designDetails?.designer._id,
      setSaveLoading,
      saveDesign
    );

    if (alreadySaved) {
      setSaveCount(saveCount - 1);
    } else {
      setSaveCount(saveCount + 1);
    }
  };

  const LikeButNotLoggedIn = () => {
    return (
      <div className="flex cursor-pointer items-center space-x-1">
        <FaRegHeart
          size={16}
          color="#595862"
          className="hover:scale-110 duration-200"
        />

        <p className={`text-[10px] text-[#595862]`}>
          {designLikes?.length.toString()}
        </p>
      </div>
    );
  };

  const BookmarkButNotLoggedIn = () => {
    return (
      <div className="flex cursor-pointer items-center space-x-1">
        <FaRegBookmark size={16} color="#595862" />

        <p className="text-[10px] text-[#595862] ">{saveCount.toString()}</p>
      </div>
    );
  };

  return (
    <div className="group h-[18rem] md:mr-[1rem] cursor-pointer w-[20rem] rounded-md border shadow-md overflow-hidden mb-12">
      <div
        onClick={() => router.push(`/design/details/${designDetails?._id}`)}
        className="relative overflow-hidden w-full h-[14rem]"
      >
        {imageLoading && (
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        )}
        <Image
          onLoad={() => setImageLoading(false)}
          className="group-hover:scale-125 duration-500"
          src={designDetails?.preview}
          style={{ objectFit: "cover" }}
          fill
          alt="card image"
        />
      </div>

      <div className="w-full h-[4rem] flex items-center justify-between px-4 ">
        <div
          onClick={() =>
            router.push(`/profile/${designDetails?.designer.username}`)
          }
          className="flex items-center space-x-2"
        >
          <SessionAvatar image={designDetails?.designer.avatar} size={40} />

          <p className="text-[11px] lg:text-[13px] text-[#595862] line-clamp-1 ">
            {designDetails?.designer.fullName}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {user ? (
            <div
              onClick={() =>
                handleLikeDesign(
                  alreadyLiked,
                  unlikeDesign,
                  designDetails?._id,
                  setLikeLoading,
                  likeDesign
                )
              }
              className="flex cursor-pointer items-center space-x-1"
            >
              {likeLoading ? (
                <>
                  <FaHeart size={16} className="text-pink-200" />
                  <p className="text-[10px] text-[#595862] ">
                    {designLikes?.length.toString()}
                  </p>
                </>
              ) : (
                <>
                  {alreadyLiked ? (
                    <FaHeart
                      size={16}
                      className="text-pink-500 hover:scale-110 duration-200"
                    />
                  ) : (
                    <FaRegHeart
                      size={16}
                      color="#595862"
                      className="hover:scale-110 duration-200"
                    />
                  )}
                  <p
                    className={`text-[10px] ${
                      alreadyLiked ? "text-pink-500" : "text-[#595862]"
                    }`}
                  >
                    {designLikes?.length.toString()}
                  </p>
                </>
              )}
            </div>
          ) : (
            <PromptSigninPopup ActionButton={LikeButNotLoggedIn} />
          )}

          <div className="flex cursor-pointer items-center space-x-1">
            <FaRegEye size={16} color="#595862" />
            <p className="text-[10px] text-[#595862] ">
              {designDetails?.views.toString()}
            </p>
          </div>

          {user ? (
            <div
              onClick={saveDesignToCollection}
              className="flex cursor-pointer items-center space-x-1"
            >
              {saveLoading ? (
                <FaBookmark className="text-[#9d9da1]" size={16} />
              ) : (
                <>
                  {alreadySaved ? (
                    <FaBookmark
                      className="hover:scale-110 duration-200"
                      size={16}
                      color="#595862"
                    />
                  ) : (
                    <FaRegBookmark size={16} color="#595862" />
                  )}
                </>
              )}

              <p className="text-[10px] text-[#595862] ">
                {saveCount.toString()}
              </p>
            </div>
          ) : (
            <PromptSigninPopup ActionButton={BookmarkButNotLoggedIn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeCard;
