"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileWork from "@/components/ProfileWork";
import SessionAvatar from "@/components/SessionAvatar";
import SkeletonLoader from "@/components/SkeletonLoader";
import UploadButton from "@/components/UploadButton";
import { MyContext } from "@/context/Context";
import { GET_USER_DESIGNS } from "@/apollo/queries/designs";
import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
  GET_USER_BY_USERNAME,
} from "@/apollo/queries/user";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { IoCogSharp } from "react-icons/io5";
import { GET_USER_ARTS } from "@/apollo/queries/arts";
import ArtCard from "@/components/art/ArtCard";
import { ImageList, ImageListItem, Skeleton } from "@mui/material";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/apollo/mutations/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { handleFollowUser } from "@/helpers/functions";

const Profile = ({ params }: { params: any }) => {
  const { appState } = useContext(MyContext);

  const [alreadyFollowed, setAlreadyFollowed] = useState<any>(false);

  const username = params?.index;

  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_BY_USERNAME,
    {
      variables: { username },
    }
  );

  const [follow, { loading: followLoading }] = useMutation(FOLLOW_USER);
  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW_USER);

  const user: User = userData?.getUserByUsername;


  const { loading, data } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: user?._id },
  });

  const { data: followersData } = useQuery(GET_FOLLOWERS, {
    variables: { userId: user?._id },
  });

  let getUserFollowers = followersData?.getFollowers?.data;

  useEffect(() => {
    setAlreadyFollowed(
      getUserFollowers?.findIndex(
        (follow: any) => follow.followedBy._id === appState?.session?._id
      ) !== -1
    );
  }, [getUserFollowers]);

  const { loading: artLoading, data: artData } = useQuery(GET_USER_ARTS, {
    variables: { userId: user?._id },
  });

  const { data: followingData } = useQuery(GET_FOLLOWING, {
    variables: { userId: user?._id },
  });

  let userFollowing = followingData?.getFollowing?.data;

  const userDesigns = data?.getUserDesigns;

  return (
    <main>
      <Header />

      {userLoading ? (
        <Container>
          <div className="flex items-center w-full h-full pt-[10rem] ">
            <Skeleton variant="circular" width={200} height={200} />

            <div className="space-y-2 ml-8">
              <Skeleton variant="rectangular" width={200} height={20} />
              <Skeleton variant="rectangular" width={250} height={20} />

              <div className="flex items-center space-x-4">
                <Skeleton variant="rectangular" width={150} height={50} />
                <Skeleton variant="rectangular" width={150} height={50} />
              </div>
            </div>
          </div>

          <div className="mt-[6rem] pt-[4rem]">
            <SkeletonLoader dontShowSubtitles />
          </div>
        </Container>
      ) : (
        <>
          <section className="h-[38rem] w-full pt-[6rem] ">
            <Container>
              <div className="flex items-center w-full h-full ">
                <SessionAvatar size={200} image={user?.avatar} />

                <div className="space-y-2 ml-8">
                  <p className="font-medium text-3xl ">{user?.fullName}</p>
                  <p className="text-sm font-medium">{user?.specialization}</p>

                  <div className="flex items-center cursor-default text-sm text-[#595862] space-x-4">
                    <p>{getUserFollowers?.length} followers</p>
                    <p>{userFollowing?.length} following</p>
                  </div>

                  {appState?.session?.username === username ? (
                    <div className="flex items-center space-x-4">
                      <Link href={`${appState?.session?.username}/settings`}>
                        <ButtonSolid
                          className="h-[3rem] w-[8rem] "
                          title="Settings"
                          Icon={<IoCogSharp />}
                        />
                      </Link>
                      <ButtonOutlined
                        className="h-[3rem] w-[8rem] "
                        title="Go Premium"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <ButtonSolid
                        Icon={
                          followLoading ? (
                            <AiOutlineLoading3Quarters
                              className="animate-spin"
                              color="white"
                              size={16}
                            />
                          ) : unfollowLoading ? (
                            <AiOutlineLoading3Quarters
                              className="animate-spin"
                              color="white"
                              size={16}
                            />
                          ) : null
                        }
                        onClick={()=>handleFollowUser(
                          alreadyFollowed,
                          unfollow,
                          user?._id,
                          appState?.session._id,
                          follow,
                        )}
                        className="h-[3rem] w-[8rem] "
                        title={`${alreadyFollowed ? "Unfollow" : "Follow"}`}
                      />
                      <ButtonOutlined
                        className="h-[3rem] w-[8rem] "
                        title="Email"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>

          <section className="w-full">
            <Container>
              <ul className="flex items-center space-x-8 ">
                <li className="text-sm font-medium h-[2rem] px-3 bg-[#F8F7F5] flex items-center justify-center cursor-pointer mb-4 ">
                  {user?.userType === "ARTIST" ? "Art works" : "Designs"}
                </li>
                <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
                  Projects
                </li>
                <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
                  Liked Shots
                </li>
                <li className="text-sm font-medium h-[2rem] px-3 flex items-center justify-center cursor-pointer mb-4 ">
                  About
                </li>
              </ul>
            </Container>
            <div className="w-full border-t">
              <Container>
                <div className="pt-[4rem] ">
                  {user?.userType === "ARTIST" ? (
                    <>
                      {appState?.session?.username === user?.username && (
                        <UploadButton />
                      )}
                      <ImageList variant="masonry" cols={3} gap={8}>
                        {[...(artData?.getUserArtWorks || [])].map(
                          (item: ArtPiece, idx) => (
                            <ImageListItem key={item._id}>
                              <ArtCard art={item} />
                            </ImageListItem>
                          )
                        )}
                      </ImageList>
                    </>
                  ) : (
                    <div className={`grid grid-cols-4`}>
                      {appState?.session?.username === user?.username && (
                        <UploadButton />
                      )}
                      {userDesigns?.map((design: Design, idx: number) => (
                        <ProfileWork
                          design={design}
                          key={design._id}
                          isUsersProfile={
                            appState?.session?.username === user?.username
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <Footer />
              </Container>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Profile;
