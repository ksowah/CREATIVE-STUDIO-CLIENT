import { IoCloudUploadSharp } from "react-icons/io5";
import ButtonSolid from "./ButtonSolid";
import Link from "next/link";
import { useContext } from "react";
import { MyContext } from "@/context/Context";
import { LiaPaintBrushSolid } from "react-icons/lia";


const UploadButton = () => {
  const { appState } = useContext(MyContext);

  const user: User = appState?.session;
  const username = user?.username;


  return (
    <div className="flex flex-col items-center justify-center h-[16rem] w-[18rem] border mb-6 rounded-lg p-6">
      <IoCloudUploadSharp size={50} color="#85B6FF" />

      <p className="font-bold text-[.8rem] mt-4 ">
        upload your masterpiece
      </p>
      <p className="text-xs text-[#595862] text-center mt-2">
        Showcase your talents, receive feedback and join our expanding community
      </p>
      {user?.userType === "ARTIST" ? (
        <Link href={`/art/${username}/upload`}>
          <ButtonSolid Icon={<LiaPaintBrushSolid />} title={"Upload Art"} className="w-[8rem] h-[2rem] mt-4 " />
        </Link>
      ) : (
        <Link href={`${username}/upload`}>
          <ButtonSolid title={"Upload"} className="w-[8rem] h-[2rem] mt-4 " />
        </Link>
      )}
    </div>
  );
};

export default UploadButton;
