"use client";

import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileImage from "@/components/ProfileImage";
import ProfileWork from "@/components/ProfileWork";
import SessionAvatar from "@/components/SessionAvatar";
import SkeletonLoader from "@/components/SkeletonLoader";
import UploadButton from "@/components/UploadButton";
import { MyContext } from "@/context/Context";
import { GET_USER_DESIGNS } from "@/queries/designs";
import { GET_USER_BY_USERNAME } from "@/queries/user";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const Profile = ({ params }: { params: any }) => {
  const { appState, setAppState } = useContext(MyContext);

  const username = params?.index;

  const { data: userData } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username },
  });

  const user = userData?.getUserByUsername;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: user?._id },
  });

  const userDesigns = data?.getUserDesigns;

  console.log("userDesigns >>>", userDesigns);



  return (
    <main>
      <Header />

      <section className="h-[38rem] w-full pt-[6rem] ">
        <Container>
          <div className="flex items-center w-full h-full ">
            <SessionAvatar size={200} image={user?.avatar} />

            <div className="space-y-2 ml-8">
              <p className="font-medium text-3xl ">{user?.fullName}</p>
              <p className="text-sm font-medium">Product Designer</p>

              <div className="flex items-center cursor-default text-sm text-[#595862] space-x-4">
                <p>200 followers</p>
                <p>10 following</p>
              </div>

              {appState?.session?.username === username ? (
                <div className="flex items-center space-x-4">
                  <Link href={`${appState?.session?.username}/settings`} >
                    <ButtonSolid
                      className="h-[3rem] w-[8rem] "
                      title="Settings"
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
              Design
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
              <div className="pt-[4rem] grid grid-cols-4 ">
                <>
                  {appState?.session?.username === user?.username && (
                    <UploadButton />
                  )}
                  {userDesigns?.map((design: any, idx: number) => (
                    <ProfileWork
                      id={design._id}
                      title={design.title}
                      image={design.preview}
                      key={idx}
                    />
                  ))}
                </>
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
