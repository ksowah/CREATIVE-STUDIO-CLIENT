import { MyContext } from "@/context/Context";
import { Avatar } from "@mui/material";
import { useContext } from "react";

const SessionAvatar = ({ image, size }: { image: string; size: number; }) => {
  
  return (
    <div>
        <Avatar
          sx={{ width: size, height: size }}
          alt="User"
          src={image}
        />
    </div>
  );
};

export default SessionAvatar;
