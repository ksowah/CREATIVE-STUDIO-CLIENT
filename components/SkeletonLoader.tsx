import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoader = ({
  dontShowSubtitles,
}: {
  dontShowSubtitles?: boolean;
}) => {
  const array = Array.from({ length: 8 }, (_, index) => index + 1);

  return (
    <div className="grid grid-cols-4 w-full ">
      {array.map((_, idx) => (
        <div key={idx} className={`h-[18rem] w-[20rem] mb-12 ml-auto`}>
          <Skeleton variant="rectangular" width={"100%"} height={"70%"} />
          {dontShowSubtitles ? (
            <div></div>
          ) : (
            <div className="mt-4">
              <Skeleton />
              <Skeleton width="60%" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
