"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { GoThumbsup } from "react-icons/go";
import { TfiSave } from "react-icons/tfi";
import { FaRegComment } from "react-icons/fa";
import SliderComponent from "@/components/SliderComponent";
import UserFooter from "@/components/UserFooter";
import { useMutation, useQuery } from "@apollo/client";
import { GET_DESIGN_BY_ID, GET_USER_DESIGNS } from "@/apollo/queries/designs";
import SessionAvatar from "@/components/SessionAvatar";
import { Button, Skeleton } from "@mui/material";
import { MyContext } from "@/context/Context";
import { IoTrashOutline } from "react-icons/io5";
import ActionConfirmationDialogue from "@/components/ActionConfirmationDialogue";
import { deleteDesignData } from "@/helpers/functions";
import { DELETE_DESIGN } from "@/apollo/mutations/designs";
import { useRouter } from "next/navigation";
import { GoDownload } from "react-icons/go";
import { GoShieldCheck } from "react-icons/go";
import { FaRegFile } from "react-icons/fa";

const DesignDetails = ({ params }: { params: any }) => {
  const designId = params?.index;

  const { appState, setAppState } = useContext(MyContext);

  const { session } = appState;

  const { loading, data } = useQuery(GET_DESIGN_BY_ID, {
    variables: { designId },
  });

  const designDetails: Design = data?.getDesignById;

  const { error, data: userDesigns } = useQuery(GET_USER_DESIGNS, {
    variables: { userId: designDetails?.designer._id },
  });

  let filteredDesigns = userDesigns?.getUserDesigns.filter(
    (design: Design) => design._id !== designDetails?._id
  );

  const allUserDesigns = filteredDesigns?.slice(0, 4);

  const [deleteDesign] = useMutation(DELETE_DESIGN);

  const [deleteLoading, setDeleteLoading] = useState(false);

  console.log("design details", designDetails);

  const designImages: any = [
    ...(designDetails?.preview ? [designDetails.preview] : []),
    ...(designDetails?.designImages || []),
  ];

  const router = useRouter();

  const handleDeleteDesign = async () => {
    setDeleteLoading(true);
    await deleteDesignData(
      [
        designDetails?.previewImageRef,
        ...designDetails?.designImagesRef,
        designDetails?.designFileRef,
      ],
      deleteDesign,
      designDetails?._id,
      session?._id
    );
    setDeleteLoading(false);
    router.push("/");
  };

  const OpenDialogueButton = () => {
    return (
      <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
        <IoTrashOutline size={18} color="#595862" />
      </button>
    );
  };

  return (
    <div className="w-ful">
      <Header />

      <Container>
        {loading ? (
          <div className="mt-[10rem] pb-[6rem] w-full">
            <div className="relative w-full h-[50rem] rounded-xl overflow-hidden">
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </div>
            <div className="w-full h-[2.2rem] mt-4 flex items-center justify-center space-x-4 ">
              <Skeleton variant="rectangular" width={30} height={"100%"} />
              <Skeleton variant="rectangular" width={30} height={"100%"} />
              <Skeleton variant="rectangular" width={30} height={"100%"} />
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full flex space-x-6 items-center mt-[4rem] py-[6rem] ">
              <SessionAvatar image={designDetails?.designer.avatar} size={70} />

              <div className="flex-1">
                <h3 className="font-medium text-xl">{designDetails?.title}</h3>
                <p className="text-[#595862] text-xs cursor-pointer ">
                  {designDetails?.designer.fullName} · Follow{" "}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                  <GoThumbsup size={22} color="#595862" />
                </button>

                <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                  <FaRegComment size={22} color="#595862" />
                </button>
                {designDetails?.designer._id === session?._id ? (
                  <ActionConfirmationDialogue
                    action={handleDeleteDesign}
                    actionBodyText="Are you sure you want to delete this design? This action cannot be undone."
                    actionButtonTitle="Delete"
                    actionHeaderTitle="Delete Design"
                    OpenDialogueButton={OpenDialogueButton}
                  />
                ) : (
                  <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                    <TfiSave size={18} color="#595862" />
                  </button>
                )}
              </div>
            </div>

            <SliderComponent sliderImages={designImages} />

            <div className="w-full flex items-center justify-center mt-[6rem] space-x-4 ">
              <Button
                variant="contained"
                style={{ backgroundColor: "#000" }}
                className="h-[3.5rem] w-[12rem] rounded-lg"
                startIcon={<GoDownload color="#fff" />}
                onClick={() => router.push(designDetails?.designFile)}
              >
                <p className="normal-case font-bold text-[#fff] ">Download</p>
              </Button>

              <div className="text-[#8a8a8d] ">
                <div className="flex items-center space-x-2">
                  <GoShieldCheck className="font-medium" />
                  <p className="text-sm font-medium">Free License</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRegFile className="font-medium" />
                  <p className="text-sm font-medium">
                    File type:{" "}
                    <span className="font-normal text-black ">FIG</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="my-[8rem] ">
              <h2 className="font-medium text-[2.5rem] mb-[2rem] ">
                {designDetails?.title}
              </h2>
              <p className="text-[#595862] ">{designDetails?.description}</p>
            </div>

            {allUserDesigns?.length > 1 && (
              <>
                <p className="font-medium text-sm mb-[2rem] ">
                  More by {designDetails?.designer.fullName}
                </p>

                <div className="w-full flex items-center space-x-4">
                  {allUserDesigns?.map((design: Design, idx: number) => (
                    <div
                      onClick={() =>
                        router.push(`/design/details/${design?._id}`)
                      }
                      className="relative cursor-pointer overflow-hidden h-[32rem] w-[22rem] rounded-xl "
                      key={design._id}
                    >
                      <Image
                        src={design.preview}
                        alt="more"
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-125 duration-500"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <UserFooter
              designerUsername={designDetails?.designer.username}
              image={designDetails?.designer.avatar}
              name={designDetails?.designer.fullName}
              specialization={designDetails?.designer.specialization}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default DesignDetails;
