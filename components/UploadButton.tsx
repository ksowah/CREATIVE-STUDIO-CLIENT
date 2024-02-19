import { IoCloudUploadSharp } from "react-icons/io5";
import ButtonSolid from "./ButtonSolid";


const UploadButton = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[16rem] w-[18rem] border rounded-lg p-6' >
        <IoCloudUploadSharp size={50} color="#85B6FF" />

        <p className="font-bold text-[.8rem] mt-4 " >upload your first masterpiece</p>
        <p className="text-xs text-[#595862] text-center mt-2" >Showcase your talents, receive feedback and join our expanding community</p>

        <ButtonSolid title="Upload" className="w-[8rem] h-[2rem] mt-4 " />
    </div>
  )
}

export default UploadButton