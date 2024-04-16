"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import React, { useContext, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ART_BY_ID } from "@/apollo/queries/arts";
import { Skeleton } from "@mui/material";
import { MyContext } from "@/context/Context";
import ActionConfirmationDialogue from "@/components/ActionConfirmationDialogue";
import { deleteArtData } from "@/helpers/functions";
import { DELETE_ART } from "@/apollo/mutations/arts";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import ButtonSolid from "@/components/ButtonSolid";
import { ADD_TO_CART } from "@/apollo/mutations/cart";
import { ToastContainer, toast } from "react-toastify";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";

interface MeetingProps {
  picture: string;
  name: string;
  description: string;
  price: string;
}

const Meeting: React.FC<MeetingProps> = ({
  picture,
  name,
  description,
  price,
}) => {
  return (
    <div className="cursor-pointer w-[16rem] sm:w-[20rem] mb-10 sm:mr-6">
      <div className="relative w-full overflow-hidden ">
        <Image
          height={288}
          width={320}
          style={{ objectFit: "contain" }}
          src={picture}
          alt="profile picture"
        />
      </div>
      <p className="text-[18px] font-semibold py-2">{name}</p>
      <p className="">{description}</p>
      <p>{price}</p>
    </div>
  );
};

const ArtDetails = ({ params }: { params: any }) => {
  let artId = params?.artId;

  const { appState } = useContext(MyContext);

  const { session } = appState;

  const { loading, data } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const [deleteArt] = useMutation(DELETE_ART);

  const artDetails: ArtPiece = data?.getArtById;

  const [addToCart] = useMutation(ADD_TO_CART, {});

  const router = useRouter();

  const addArtToCart = async () => {
    try {
      await addToCart({
        variables: { itemId: artId, artist: artDetails?.artist._id },
        update: (cache, { data: { addToCart } }) => {
          const existingItemsInCart = cache.readQuery<any>({
            query: GET_CART_ITEMS,
          });

          cache.writeQuery({
            query: GET_CART_ITEMS,
            data: {
              getCartItems: [
                addToCart,
                ...(existingItemsInCart?.getCartItems || []),
              ],
            },
          });
        },
      });
      toast.success(`${artDetails?.title} added to cart`);
    } catch (error: any) {
      console.error("error", error);
    }
  };

  const handleDeleteArt = async () => {
    try {
      await deleteArtData(
        [artDetails?.previewImageRef, ...artDetails?.artImagesRef],
        deleteArt,
        artId,
        session?._id
      );
      router.push("/art");
    } catch (error) {
      console.error("error", error);
    }
  };

  const OpenDialogueButton = () => {
    return (
      <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
        <IoTrashOutline size={18} color="#595862" />
      </button>
    );
  };

  return (
    <main>
      <Header />

      <Container>
        <ToastContainer />

        {loading ? (
          <div className="mt-[7rem] flex space-x-8 justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative flex justify-start w-[700px] h-[500px]">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="md:grid grid-cols-4 flex flex-wrap mt-10 ">
                <Skeleton
                  className="mr-4"
                  variant="rectangular"
                  width={160}
                  height={160}
                />
                <Skeleton
                  className="mr-4"
                  variant="rectangular"
                  width={160}
                  height={160}
                />
                <Skeleton
                  className="mr-4"
                  variant="rectangular"
                  width={160}
                  height={160}
                />
                <Skeleton
                  className="mr-4"
                  variant="rectangular"
                  width={160}
                  height={160}
                />
              </div>
            </div>

            <div className="flex-1 flex">
              <Skeleton
                className="mt-[6rem] "
                variant="rectangular"
                width={"100%"}
                height={300}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-[5rem] flex justify-end space-x-4 w-full h-[4rem]">
              {session?._id === artDetails?.artist._id && (
                <>
                  <ActionConfirmationDialogue
                    action={handleDeleteArt}
                    actionBodyText="Are you sure you want to delete this Art Piece? This action cannot be undone."
                    actionButtonTitle="Delete"
                    actionHeaderTitle="Delete Art"
                    OpenDialogueButton={OpenDialogueButton}
                  />

                  <button className="h-[3rem] w-[3rem] rounded-full border flex items-center justify-center ">
                    <CiEdit size={22} color="#595862" />
                  </button>
                </>
              )}
            </div>
            <div className="pt-[1rem] ">
              <div className="flex flex-col justify-center lg:flex-row lg:justify-between">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative flex justify-start w-full lg:w-[700px] h-[500px]">
                    <Image
                      src={artDetails?.artPreview}
                      fill
                      style={{ objectFit: "contain" }}
                      alt="main art preview"
                    />
                  </div>
                  <div className="md:grid grid-cols-4 flex flex-wrap mt-10 ">
                    {[...(artDetails?.artImages || [])].map((image, idx) => (
                      <div
                        key={idx}
                        className="relative h-[10rem] w-[10rem] mr-4 "
                      >
                        <Image
                          src={image}
                          fill
                          style={{ objectFit: "contain" }}
                          alt="other images"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 w-full lg:pl-[2rem] mt-6">
                  <p className="font-medium text-[20px] md:text-[30px]">
                    {artDetails?.title}
                  </p>

                  <div className=" mt-6 text-[13px]">
                    <p>Size: {artDetails?.dimensions}</p>
                    <p>Medium: Acryl</p>
                    <p>Material: Canvas</p>
                    <p>Year: 2022</p>
                  </div>

                  <div className="w-full lg:w-[80%] p-[1rem] mt-8 bg-[#f0f0f0]">
                    <div className="text-[13px] flex justify-between">
                      <div>
                        <p>Get to know the artist :</p>
                        <p className="my-2">Availability:</p>
                        <p>Delivery Time:</p>
                      </div>

                      <div className="text-[13px] text-right pr-3">
                        <p>Anna Ovsiankina</p>
                        <p className="my-2 ">In Stock</p>
                        <p>Up to 14 days after purchase</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pr-3">
                      <p className="text-[1rem] md:text-[25px] font-medium">
                        ${artDetails?.price}
                      </p>

                      <ButtonSolid
                        onClick={addArtToCart}
                        Icon={<BsCart4 />}
                        title="Add to cart"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text underneath */}
              <div className="w-full lg:w-[40rem] my-[4rem] ">
                <h2 className=" mb-3 text-[18px] md:text-[23px] font-medium">
                  Story
                </h2>
                <p className="text-[14px] md:text-[1rem]">
                  {artDetails?.description}
                </p>
              </div>

              <div className="border-t flex flex-col items-center justify-center ">
                <p className="mt-[2rem] text-center text-[18px] md:text-[22px] font-medium">
                  You May Also Like
                </p>

                <div className="mt-[3rem] w-fit flex items-center justify-center flex-wrap lg:grid grid-cols-3">
                  <Meeting
                    picture="/images/drawings.png"
                    name="Amber Haze"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />
                  <Meeting
                    picture="/images/drawings2.png"
                    name="Little ballerina"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />
                  <Meeting
                    picture="/images/drawings.png"
                    name="Amber Haze"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />

                  <Meeting
                    picture="/images/drawings2.png"
                    name="Little ballerina"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />
                  <Meeting
                    picture="/images/drawings.png"
                    name="Amber Haze"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />
                  <Meeting
                    picture="/images/drawings2.png"
                    name="Little ballerina"
                    description="Annet Loginova | Paintings"
                    price="$350"
                  />
                </div>
              </div>
            </div>

            <Footer />
          </>
        )}
      </Container>
    </main>
  );
};

export default ArtDetails;
