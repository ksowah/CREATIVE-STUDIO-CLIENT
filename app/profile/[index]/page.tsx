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
import { GET_USER_BY_USERNAME } from "@/apollo/queries/user";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { IoCogSharp } from "react-icons/io5";
import { GET_USER_ARTS } from "@/apollo/queries/arts";
import ArtCard from "@/components/art/ArtCard";
import { ImageList, ImageListItem } from "@mui/material";

const Profile = ({ params }: { params: any }) => {
  const { appState, setAppState } = useContext(MyContext);

  const username = params?.index;

  const { data: userData } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username },
  });

  const user: User = userData?.getUserByUsername;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: user?._id },
  });

  const { loading: artLoading, data: artData } = useQuery(GET_USER_ARTS, {
    variables: { userId: user?._id },
  });

  const userDesigns = data?.getUserDesigns;
  const userArts: [ArtPiece] = artData?.getUserArtWorks;

  console.log("user?.specialization", user);

  return (
    <main>
      <Header />

      <section className="h-[38rem] w-full pt-[6rem] ">
        <Container>
          <div className="flex items-center w-full h-full ">
            <SessionAvatar size={200} image={user?.avatar} />

            <div className="space-y-2 ml-8">
              <p className="font-medium text-3xl ">{user?.fullName}</p>
              <p className="text-sm font-medium">{user?.specialization}</p>

              <div className="flex items-center cursor-default text-sm text-[#595862] space-x-4">
                <p>200 followers</p>
                <p>10 following</p>
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
                  <ButtonSolid className="h-[3rem] w-[8rem] " title="Follow" />
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
            {loading ? (
              <div className="pt-[4rem]">
                <SkeletonLoader dontShowSubtitles />
              </div>
            ) : (
              <div className="pt-[4rem] " >
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
            )}

            <Footer />
          </Container>
        </div>
      </section>
    </main>
  );
};

export default Profile;
