"use client";

import { GET_USER_ARTS } from "@/apollo/queries/arts";
import { GET_SAVED_DESIGNS, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import { GET_USER_BY_USERNAME } from "@/apollo/queries/user";
import ProfilePageContainer from "@/components/ProfilePageContainer";
import ProfileWork from "@/components/ProfileWork";
import UploadButton from "@/components/UploadButton";
import ArtCard from "@/components/art/ArtCard";
import { MyContext } from "@/context/Context";
import { useQuery } from "@apollo/client";
import { ImageList, ImageListItem } from "@mui/material";
import React, { useContext } from "react";

const Bookmarks = ({ params }: { params: any }) => {
  const username = params?.index;

  const { appState } = useContext(MyContext);

  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_BY_USERNAME,
    {
      variables: { username },
    }
  );

  const user: User = userData?.getUserByUsername;


  const { data: savedData } = useQuery(GET_SAVED_DESIGNS);

  const { loading, data } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: user?._id },
  });

  const savedDesigns = savedData?.getSavedDesigns

  console.log("saved desigsns?? >>", savedDesigns)

  const userDesigns = data?.getUserDesigns;

  return (
    <ProfilePageContainer username={username}>
      <div className="pt-[4rem]">
        <div className={`grid grid-cols-4`}>
          {savedDesigns?.map((design:any, idx: number) => (
            <ProfileWork
              design={design.design}
              key={design._id}
              isUsersProfile={false}
            />
          ))}
        </div>
      </div>
    </ProfilePageContainer>
  );
};

export default Bookmarks;
