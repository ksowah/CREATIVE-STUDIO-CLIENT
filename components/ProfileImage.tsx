import Image from "next/image";
import React from "react";

interface Props {
    image: string;
    dimension: string;
}

const ProfileImage = ({dimension, image}:Props) => {
  return (
    <div className={`relative ${dimension} overflow-hidden rounded-full`}>
      <Image src={image} style={{objectFit:"cover"}} fill alt={"author"} />
    </div>
  );
};

export default ProfileImage;
