"use client";

import { GET_USER_ARTS } from "@/apollo/queries/arts";
import { GET_USER_DESIGNS } from "@/apollo/queries/designs";
import { GET_USER_BY_USERNAME } from "@/apollo/queries/user";
import ProfilePageContainer from "@/components/ProfilePageContainer";
import ProfileWork from "@/components/ProfileWork";
import UploadButton from "@/components/UploadButton";
import ArtCard from "@/components/art/ArtCard";
import { MyContext } from "@/context/Context";
import { useQuery } from "@apollo/client";
import { ImageList, ImageListItem } from "@mui/material";
import React, { useContext } from "react";

const Profile = ({ params }: { params: any }) => {
  const username = params?.index;

  const { appState } = useContext(MyContext);

  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_BY_USERNAME,
    {
      variables: { username },
    }
  );

  const user: User = userData?.getUserByUsername;

  const { loading: artLoading, data: artData } = useQuery(GET_USER_ARTS, {
    variables: { userId: user?._id },
  });

  const { loading, data } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: user?._id },
  });

  const userDesigns = data?.getUserDesigns;

  return (
    <ProfilePageContainer username={username}>
      <div className="pt-[4rem] ">
        {user?.userType === "ARTIST" ? (
          <>
            <ImageList variant="masonry" cols={3} gap={8}>
              {appState?.session?.username === user?.username && (
                <ImageListItem>
                  <UploadButton />
                </ImageListItem>
              )}
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
            {appState?.session?.username === user?.username && <UploadButton />}
            {userDesigns?.map((design: Design, idx: number) => (
              <ProfileWork
                design={design}
                key={design._id}
                isUsersProfile={appState?.session?.username === user?.username}
              />
            ))}
          </div>
        )}
      </div>
    </ProfilePageContainer>
  );
};

export default Profile;
