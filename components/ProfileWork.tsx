import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import { DELETE_DESIGN } from "@/mutations/designs";
import { GET_ALL_DESIGNS, GET_USER_DESIGNS } from "@/queries/designs";
import { MyContext } from "@/context/Context";
import { useRouter } from "next/navigation";
import ActionConfirmationDialogue from "./ActionConfirmationDialogue";
import { deleteImageFromFB } from "@/helpers/functions";



const ProfileWork = ({ design, isUsersProfile }: {design:Design, isUsersProfile:boolean}) => {
  const [deleteDesign, { loading, error }] = useMutation(DELETE_DESIGN);

  const [deleteLoading, setDeleteLoading] = useState(false)

  const { appState, setAppState } = useContext(MyContext);

  const { session } = appState;

  const router = useRouter();

  // GET_USER_DESIGNS
  
  
  const handleDeleteDesign = async () => {
    setDeleteLoading(true)
    let designImagesRefs:any = [design?.previewImageRef, ...design?.designImagesRef]
    
    try {

      await deleteImageFromFB(designImagesRefs);

      await deleteDesign({
        variables: { designId: design?._id },
        update: (cache) => {
          // update the cache to remove the deleted design from the list of all designs
          const existingDesigns: any = cache.readQuery({
            query: GET_ALL_DESIGNS,
          });

          const updatedDesigns = existingDesigns?.getAllDesigns.filter(
            (design: Design) => design._id !== design?._id
          );

          cache.writeQuery({
            query: GET_ALL_DESIGNS,
            data: {
              getAllDesigns: updatedDesigns,
            },
          });

          // update the cache to remove the deleted design from the list of user designs
          const existingUserDesigns: any = cache.readQuery({
            query: GET_USER_DESIGNS,
            variables: { userId: session?._id },
          });

          if (existingUserDesigns) {
            const updatedUserDesigns =
              existingUserDesigns.getUserDesigns.filter(
                (designItem: Design) => designItem._id !== design?._id
              );
            cache.writeQuery({
              query: GET_USER_DESIGNS,
              variables: { userId: session?._id },
              data: {
                getUserDesigns: updatedUserDesigns,
              },
            });
          }
        },
      });
      console.log("Design deleted successfully");
      // Perform any additional actions after deletion if needed
    } catch (error) {
      console.error("Error deleting design:", error);
      // Handle error accordingly
    }
    setDeleteLoading(false)
  };

  return (
    <div className={`group ${deleteLoading && "opacity-60"} relative h-[16rem] w-[18rem]`}>
      {deleteLoading && <div className="absolute top-0 left-0 right-0 bottom-0 z-30" ></div>}
      
      <div
        onClick={() => router.push(`/design/details/${design?._id}`)}
        className="relative cursor-pointer h-[16rem] w-[18rem] mb-8 rounded-lg overflow-hidden "
      >
        <Image
          src={design?.preview}
          className="group-hover:scale-125 duration-500"
          fill
          objectFit="cover"
          alt="work"
        />
      </div>

      <div className="absolute opacity-0 z-10 group-hover:opacity-90 duration-500 bottom-0 w-full h-[4rem] flex items-center justify-between px-2 bg-gradient-to-t from-blackRgba to-transparent ">
        <p className="text-xs text-white line-clamp-1 ">{design?.title}</p>

        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
            <CiHeart size={20} color="#fff" />
          </div>
          {isUsersProfile ? (
            <ActionConfirmationDialogue
              action={handleDeleteDesign}
              actionButtonTitle="Delete"
              actionHeaderTitle="Delete Design"
              actionBodyText="Are you sure you want to delete this design? This action cannot be undone."
            />
          ) : (
            <div className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ">
              <TfiSave size={16} color="#fff" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileWork;
