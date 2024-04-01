"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { Skeleton } from "@mui/material";
import { cache, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionAvatar from "./SessionAvatar";
import { IoEyeOutline } from "react-icons/io5";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_DESIGN_LIKES } from "@/apollo/queries/designs";
import { LIKE_DESIGN, UNLIKE_DESIGN } from "@/apollo/mutations/designs";
import { NEW_LIKE_SUBSCRIPTION } from "@/apollo/subscriptions";
import { MyContext } from "@/context/Context";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface Props {
  workImage: string;
  authourImage: string;
  authourName: string;
  designId: string;
  views: Number;
  authourUsername: string
}

const CreativeCard = ({
  authourImage,
  authourName,
  authourUsername,
  workImage,
  designId,
  views,
}: Props) => {
  const router = useRouter();

  const [imageLoading, setImageLoading] = useState(true);

  const { data, loading } = useQuery(GET_DESIGN_LIKES, {
    variables: { designId },
  });
  const [likeDesign] = useMutation(LIKE_DESIGN);
  const [unlikeDesign] = useMutation(UNLIKE_DESIGN);
  const [likeLoading, setLikeLoading] = useState(false)

  const [alreadyLiked, setAlreadyLiked] = useState<any>(false);

  const { appState } = useContext(MyContext);

  const user: User = appState?.session;

  let designLikes = data?.getDesignLikes?.data;

  useEffect(() => {
    setAlreadyLiked(
      designLikes?.findIndex((like: any) => like.likedBy._id === user?._id) !==
        -1
    );
  }, [designLikes]);

  const handleLikeDesign = async () => {
    try {
      if (alreadyLiked) {
        await unlikeDesign({
          variables: { designId },
          update: (cache) => {
            const existingLikes = cache.readQuery<any>({
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
        setLikeLoading(true)
        await likeDesign({
          variables: { designId },
          update: (cache, { data: { likeDesign } }) => {
            const existingLikes = cache.readQuery<any>({
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
          setLikeLoading(false)
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group h-[18rem] cursor-pointer w-[20rem] rounded-md border shadow-md overflow-hidden mb-12">
      <div
        onClick={() => router.push(`/design/details/${designId}`)}
        className="relative overflow-hidden w-full h-[14rem]"
      >
        {imageLoading && (
          <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
        )}
        <Image
          onLoad={() => setImageLoading(false)}
          className="group-hover:scale-125 duration-500"
          src={workImage}
          style={{ objectFit: "cover" }}
          fill
          alt="card image"
        />
      </div>

      <div className="w-full h-[4rem] flex items-center justify-between px-4 ">
        <div onClick={()=> router.push(`/profile/${authourUsername}`)} className="flex items-center space-x-2">
          <SessionAvatar image={authourImage} size={40} />

          <p className="text-[13px] text-[#595862] line-clamp-1 ">
            {authourName}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            onClick={handleLikeDesign}
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
                  <FaHeart size={16} className="text-pink-500 hover:scale-110 duration-200" />
                ) : (
                  <FaRegHeart size={16} color="#595862" className="hover:scale-110 duration-200" />
                )}
                <p className="text-[10px] text-[#595862] ">
                  {designLikes?.length.toString()}
                </p>
              </>
            
            )}
          </div>

          <div className="flex cursor-pointer items-center space-x-1">
            <IoEyeOutline size={18} color="#595862" />
            <p className="text-[10px] text-[#595862] ">{views.toString()}</p>
          </div>

          <div className="flex cursor-pointer items-center space-x-1">
            <FaRegComment size={16} color="#595862" />
            <p className="text-[10px] text-[#595862] ">2k</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeCard;
