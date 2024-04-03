"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";
import React, { cache, useContext, useEffect, useState } from "react";
import { GoThumbsup } from "react-icons/go";
import { TfiSave } from "react-icons/tfi";
import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import SliderComponent from "@/components/SliderComponent";
import UserFooter from "@/components/UserFooter";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_DESIGN_BY_ID,
  GET_DESIGN_COMMENTS,
  GET_DESIGN_LIKES,
  GET_SAVED_DESIGNS,
  GET_USER_DESIGNS,
} from "@/apollo/queries/designs";
import SessionAvatar from "@/components/SessionAvatar";
import { Button, InputAdornment, Skeleton, TextField } from "@mui/material";
import { MyContext } from "@/context/Context";
import { IoTrashOutline } from "react-icons/io5";
import ActionConfirmationDialogue from "@/components/ActionConfirmationDialogue";
import {
  deleteDesignData,
  handleFollowUser,
  handleLikeDesign,
  handleSaveDesign,
} from "@/helpers/functions";
import {
  COUNT_DESIGN_VIEWS,
  CREAETE_COMMENT,
  DELETE_DESIGN,
  LIKE_DESIGN,
  SAVE_DESIGN,
  UNLIKE_DESIGN,
  UNSAVE_DESIGN,
} from "@/apollo/mutations/designs";
import { useRouter } from "next/navigation";
import { GoDownload } from "react-icons/go";
import { GoShieldCheck } from "react-icons/go";
import { FaRegFile } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import Link from "next/link";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/apollo/mutations/user";
import { GET_FOLLOWERS } from "@/apollo/queries/user";
import CommentItem from "@/components/CommentItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import CssTextField from "@/components/CSSTextField";

const DesignDetails = ({ params }: { params: any }) => {
  const designId = params?.index;

  const { appState } = useContext(MyContext);

  const { session } = appState;

  const { loading, data } = useQuery(GET_DESIGN_BY_ID, {
    variables: { designId },
  });

  const { loading: getCommentsLoading, data: commentsData } = useQuery(
    GET_DESIGN_COMMENTS,
    {
      variables: { designId },
    }
  );

  console.log("comments ?>>>>", commentsData);

  const designDetails: Design = data?.getDesignById;

  const { error, data: userDesigns } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: designDetails?.designer._id },
  });

  let filteredDesigns = userDesigns?.getUserDesigns.filter(
    (design: Design) => design._id !== designDetails?._id
  );

  const allUserDesigns = filteredDesigns?.slice(0, 4);

  const [deleteDesign] = useMutation(DELETE_DESIGN);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [countDesignViews, { data: viewCountData }] = useMutation(
    COUNT_DESIGN_VIEWS,
    { variables: { designId } }
  );

  const [saveDesign] = useMutation(SAVE_DESIGN);
  const [unsaveDesign] = useMutation(UNSAVE_DESIGN);

  const [follow, { loading: followLoading }] = useMutation(FOLLOW_USER);
  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER);
  const [createComment, { loading: commentLoading }] =
    useMutation(CREAETE_COMMENT);

  const [alreadyFollowed, setAlreadyFollowed] = useState<any>(false);

  const { data: savedDesignsData } = useQuery(GET_SAVED_DESIGNS);
  let savedDesigns = savedDesignsData?.getSavedDesigns || [];

  useEffect(() => {
    countDesignViews();
  }, []);

  const { data: followersData } = useQuery(GET_FOLLOWERS, {
    variables: { userId: designDetails?.designer._id },
  });

  let getUserFollowers = followersData?.getFollowers?.data;

  useEffect(() => {
    setAlreadyFollowed(
      getUserFollowers?.findIndex(
        (follow: any) => follow.followedBy._id === appState?.session?._id
      ) !== -1
    );
  }, [getUserFollowers]);

  const designImages: any = [
    ...(designDetails?.preview ? [designDetails.preview] : []),
    ...(designDetails?.designImages || []),
  ];

  const router = useRouter();

  const handleDeleteDesign = async () => {
    setDeleteLoading(true);
    await deleteDesignData(
      [
        designDetails?.previewImageRef,
        ...designDetails?.designImagesRef,
        designDetails?.designFileRef,
      ],
      deleteDesign,
      designDetails?._id,
      session?._id
    );
    setDeleteLoading(false);
    router.push("/");
  };

  const OpenDialogueButton = () => {
    return (
      <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
        <IoTrashOutline size={18} color="#595862" />
      </button>
    );
  };

  const { data: likesData, loading: likesLoading } = useQuery(
    GET_DESIGN_LIKES,
    {
      variables: { designId },
    }
  );
  const [likeDesign] = useMutation(LIKE_DESIGN);
  const [unlikeDesign] = useMutation(UNLIKE_DESIGN);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [comment, setComment] = useState("");

  const [alreadyLiked, setAlreadyLiked] = useState<any>(false);
  const [alreadySaved, setAlreadySaved] = useState<any>(false);

  let designLikes = likesData?.getDesignLikes?.data;

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
        (design: any) => design.design._id === designDetails?._id
      ) !== -1
    );
  }, [savedDesigns]);

  const addCommentToDesign = async () => {
    try {
      if (comment !== "") {
        await createComment({
          variables: { designId, comment },
          update: (cache, { data: { createComment } }) => {
            const existingComments = cache.readQuery<any>({
              query: GET_DESIGN_COMMENTS,
              variables: { designId },
            });

            cache.writeQuery({
              query: GET_DESIGN_COMMENTS,
              variables: { designId },
              data: {
                getDesignComments: [
                  createComment,
                  ...(existingComments?.getDesignComments || []),
                ],
              },
            });
          },
        });
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-ful">
      <Header />

      <Container>
        {loading ? (
          <div className="mt-[10rem] pb-[6rem] w-full">
            <div className="relative w-full h-[50rem] rounded-xl overflow-hidden">
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </div>
            <div className="w-full h-[2.2rem] mt-4 flex items-center justify-center space-x-4 ">
              <Skeleton variant="rectangular" width={30} height={"100%"} />
              <Skeleton variant="rectangular" width={30} height={"100%"} />
              <Skeleton variant="rectangular" width={30} height={"100%"} />
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full flex space-x-6 items-center mt-[4rem] py-[6rem] ">
              <SessionAvatar image={designDetails?.designer.avatar} size={70} />

              <div className="flex-1">
                <h3 className="font-medium text-xl">{designDetails?.title}</h3>
                <div className="flex items-center space-x-1">
                  <Link href={`/profile/${designDetails?.designer.username}`}>
                    <p className="text-[#595862] text-xs cursor-pointer ">
                      {designDetails?.designer.fullName}
                    </p>
                  </Link>
                  <p className="text-[#595862] text-xs">·</p>
                  <p
                    onClick={() =>
                      handleFollowUser(
                        alreadyFollowed,
                        unfollow,
                        designDetails?.designer._id,
                        session?._id,
                        follow
                      )
                    }
                    className="text-[#595862] text-xs cursor-pointer"
                  >
                    {alreadyFollowed ? "Unfollow" : "Follow"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {likeLoading ? (
                  <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                    <FaHeart
                      size={22}
                      className="text-pink-200 hover:scale-110 duration-200"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleLikeDesign(
                        alreadyLiked,
                        unlikeDesign,
                        designDetails?._id,
                        setLikeLoading,
                        likeDesign
                      )
                    }
                    className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center "
                  >
                    {alreadyLiked ? (
                      <FaHeart
                        size={22}
                        className="text-pink-500 hover:scale-110 duration-200"
                      />
                    ) : (
                      <FaRegHeart
                        size={22}
                        color="#595862"
                        className="hover:scale-110 duration-200"
                      />
                    )}
                  </button>
                )}

                <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                  <FaRegComment size={22} color="#595862" />
                </button>
                {designDetails?.designer._id === session?._id ? (
                  <ActionConfirmationDialogue
                    action={handleDeleteDesign}
                    actionBodyText="Are you sure you want to delete this design? This action cannot be undone."
                    actionButtonTitle="Delete"
                    actionHeaderTitle="Delete Design"
                    OpenDialogueButton={OpenDialogueButton}
                  />
                ) : (
                  <button
                    onClick={() =>
                      handleSaveDesign(
                        alreadySaved,
                        unsaveDesign,
                        designDetails?._id,
                        designDetails?.designer._id,
                        setSaveLoading,
                        saveDesign
                      )
                    }
                    className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center "
                  >
                    {saveLoading ? (
                      <FaBookmark className="text-[#9d9da1]" size={18} />
                    ) : alreadySaved ? (
                      <FaBookmark
                        className="hover:scale-110 duration-200"
                        size={18}
                        color="#000"
                      />
                    ) : (
                      <FaRegBookmark size={18} color="#595862" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <SliderComponent sliderImages={designImages} />

            <div className="w-full flex items-center justify-center mt-[6rem] space-x-4 ">
              <Button
                variant="contained"
                style={{ backgroundColor: "#000" }}
                className="h-[3.5rem] w-[12rem] rounded-lg"
                startIcon={<GoDownload color="#fff" />}
                onClick={() => router.push(designDetails?.designFile)}
              >
                <p className="normal-case font-bold text-[#fff] ">Download</p>
              </Button>

              <div className="text-[#8a8a8d] ">
                <div className="flex items-center space-x-2">
                  <GoShieldCheck className="font-medium" />
                  <p className="text-sm font-medium">Free License</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRegFile className="font-medium" />
                  <p className="text-sm font-medium">
                    File type:{" "}
                    <span className="font-normal text-black ">FIG</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="my-[8rem] ">
              <h2 className="font-medium text-[2.5rem] mb-[2rem] ">
                {designDetails?.title}
              </h2>
              <p className="text-[#595862] ">{designDetails?.description}</p>
            </div>

            {allUserDesigns?.length >= 1 && (
              <>
                <p className="font-medium text-sm mb-[2rem] ">
                  More by {designDetails?.designer.fullName}
                </p>

                <div className="w-full flex items-center space-x-4">
                  {allUserDesigns?.map((design: Design, idx: number) => (
                    <div
                      onClick={() =>
                        router.push(`/design/details/${design?._id}`)
                      }
                      className="relative cursor-pointer overflow-hidden h-[32rem] w-[22rem] rounded-xl "
                      key={design._id}
                    >
                      <Image
                        src={design.preview}
                        alt="more"
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-125 duration-500"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-[6rem]">
              <p className="font-medium">Comments</p>
              <CssTextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                color="primary"
                id="input-with-icon-textfield"
                multiline
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div
                        onClick={addCommentToDesign}
                        className="relative h-[1.8rem] w-[1.8rem] cursor-pointer "
                      >
                        {commentLoading ? (
                          <AiOutlineLoading3Quarters
                            size={25}
                            className="animate-spin"
                          />
                        ) : (
                          <Image
                            fill
                            src={"/icons/send.svg"}
                            alt=""
                            className="hover:scale-110 duration-150"
                          />
                        )}
                      </div>
                    </InputAdornment>
                  ),
                }}
                className="w-full my-4 outline-none border-none"
                label="Leave a feedback on this design"
                variant="outlined"
              />

              {commentsData?.getDesignComments.length > 0 && (
                <div className="w-full border rounded-lg mt-[2rem] p-[1.5rem] ">
                  {commentsData?.getDesignComments.map(
                    (comment: DesignComment, _: any) => (
                      <CommentItem comment={comment} key={comment._id} />
                    )
                  )}
                </div>
              )}
            </div>

            <UserFooter
              designerUsername={designDetails?.designer.username}
              image={designDetails?.designer.avatar}
              name={designDetails?.designer.fullName}
              specialization={designDetails?.designer.specialization}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default DesignDetails;
