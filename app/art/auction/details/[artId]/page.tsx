"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";
import PaymentCard from "@/components/PaymentCard";
import BidRank from "@/components/art/BidRank";
import Footer from "@/components/Footer";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ART_BY_ID } from "@/apollo/queries/arts";
import { PLACE_BID } from "@/apollo/mutations/auction";
import { useContext, useEffect, useState } from "react";
import { GET_ART_BIDDINGS } from "@/apollo/queries/auction";
import { Skeleton } from "@mui/material";
import { IoTrashOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import ActionConfirmationDialogue from "@/components/ActionConfirmationDialogue";
import { DELETE_ART } from "@/apollo/mutations/arts";
import { deleteArtData } from "@/helpers/functions";
import { MyContext } from "@/context/Context";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const AuctionDetails = ({ params }: { params: any }) => {
  const { artId } = params;

  const { appState } = useContext(MyContext);

  const { session } = appState;

  const router = useRouter();

  const [bidAmount, setBidAmount] = useState<any>(0);

  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuctionLive, setIsAuctionLive] = useState(false);
  const [dateStatus, setDateStatus] = useState("");
  const [timeStatus, setTimeStatus] = useState("");
  const [userAgreementOne, setUserAgreementOne] = useState(false)
  const [userAgreementTwo, setUserAgreementTwo] = useState(false)

  const { data, loading } = useQuery(GET_ART_BY_ID, {
    variables: { artId },
  });

  const { data: biddingsData, refetch: refetchArtBiddings } = useQuery(
    GET_ART_BIDDINGS,
    {
      variables: { artId },
    }
  );

  const [deleteArt] = useMutation(DELETE_ART);

  const [placeBid] = useMutation(PLACE_BID);

  const artBiddings = biddingsData?.getArtBiddings;
  let highestBid = artBiddings?.[0]?.bidAmount;

  const artDetails: ArtPiece = data?.getArtById;


  const placeidPromise = async () => {

    await placeBid({
      variables: {
        bidAmount: parseFloat(bidAmount),
        artId,
      },
    });
    refetchArtBiddings();
    setIsErrorOccured(false);
    setIsSuccess(true);
  }

  const placeBidOnArt = async () => {

    if(!userAgreementOne || !userAgreementTwo){
      toast.error("Please agree to the terms and conditions")
      return
    }
  
    if (highestBid && bidAmount <= highestBid) {
      toast.error("Bid amount must be greater than the highest bid");
      return;
    }

    try {
      toast.promise(
        placeidPromise,
        {
          pending: "Placing bid...",
          success: "Bid placed successfully",
        }
      );
    } catch (error: any) {
      setIsSuccess(false);
      setIsErrorOccured(true);
      toast.error(error.message);
    }
  };

  const auctionStartDate = new Date(parseInt(artDetails?.auctionStartDate));
  const auctionEndDate = new Date(parseInt(artDetails?.auctionEndDate));
  const currentDate = new Date();

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      // @ts-ignore
      date != "Invalid Date" ? date : currentDate
    );
  }

  function formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      // @ts-ignore
      date != "Invalid Date" ? date : currentDate
    );
  }

  useEffect(() => {
    const checkArtDateStatus = () => {
      if (auctionStartDate > currentDate) {
        setDateStatus(`STARTS AT: ${formatDate(auctionStartDate)}`);
        setTimeStatus(`TIME: ${formatTime(auctionStartDate)}`);
        setIsAuctionLive(false);
      } else {
        setDateStatus(`ENDS AT: ${formatDate(auctionEndDate)}`);
        setTimeStatus(`TIME: ${formatTime(auctionEndDate)}`);
        setIsAuctionLive(true);
      }
    };

    console.log(">>>>", auctionStartDate, auctionEndDate);

    checkArtDateStatus();
  }, [auctionStartDate, auctionEndDate]);

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

      <ToastContainer />

      <Container>
        {loading ? (
          <div className="pt-[7rem] ">
            <div className=" flex items-center justify-between">
              <Skeleton variant="rectangular" width={"45%"} height={400} />
              <Skeleton variant="rectangular" width={"40%"} height={200} />
            </div>

            <Skeleton
              className="mt-[4rem] mb-4"
              variant="rectangular"
              width={"75%"}
              height={40}
            />
            <Skeleton variant="rectangular" width={"55%"} height={40} />
          </div>
        ) : (
          <>
            <div className="mt-[6rem] flex items-end justify-end space-x-4 w-full h-[4rem]">
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

            <div className="pt-[1rem]">
              <div className="border rounded-lg w-full flex text-[#595862]">
                <div className="flex-1">
                  {/* header part */}
                  <div className="h-[4rem] border-b px-[2rem] flex items-center justify-between ">
                    <h3 className="font-medium text-[1.3rem] ">Auction</h3>

                    <p className="text-[.9rem]">{dateStatus}</p>

                    <p className="text-[.9rem]">{timeStatus}</p>
                  </div>

                  {/* content */}
                  <div className="flex items-center space-x-8 p-[1.5rem] ">
                    <div className="relative h-[18rem] w-[18rem]">
                      <Image
                        className="group-hover:scale-105 duration-500"
                        src={artDetails?.artPreview}
                        fill
                        style={{ objectFit: "contain" }}
                        alt="art image"
                      />
                    </div>

                    <div className="flex w-full items-end justify-between">
                      <div className="flex-1 flex flex-col space-y-2 ">
                        <p className="font-medium text-[1.3rem] ">
                          {artDetails?.title}
                        </p>
                        <p className="text-sm">
                          Artist: {artDetails?.artist.fullName}
                        </p>
                        <p className="text-sm">
                          Dimensions: {artDetails?.dimensions}
                        </p>
                        <p className="text-sm">Country: Ghana</p>
                      </div>

                      <div className="space-y-2 flex flex-col items-end">
                        <p className="text-sm ">
                          Starting price:{" "}
                          <span className="text-lg font-bold">{`$${
                            artDetails?.auctionStartPrice || ""
                          }`}</span>
                        </p>

                        {artBiddings?.length > 0 && (
                          <p className="text-sm ">
                            Highest Bid:{" "}
                            <span className="text-lg font-bold">{`$${highestBid}`}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <PaymentCard
                  onClick={placeBidOnArt}
                  setBidAmount={setBidAmount}
                  isAuctionLive={isAuctionLive}
                  isAuctionPage
                  checkedOne={userAgreementOne}
                  checkedTwo={userAgreementTwo}
                  setCheckedOne={setUserAgreementOne}
                  setCheckedTwo={setUserAgreementTwo}
                />
              </div>

              <div className="w-full my-[4rem] ">
                <div className="flex items-center space-x-10 ">
                  <div className="flex-1 ">
                    <div className="relative  h-[40rem] w-full">
                      <Image
                        className="group-hover:scale-105 duration-500"
                        src={artDetails?.artPreview}
                        fill
                        style={{ objectFit: "contain" }}
                        alt="art image"
                      />
                    </div>
                  </div>

                  <div className="flex-1 ">
                    <div className="flex items-center h-[2.6rem] w-[6rem] border-[#000] border-0 border-l-[4px] border-t-[4px] px-4 overflow-visible ">
                      <h2 className="font-medium text-[1.2rem] text-nowrap ">
                        {artDetails?.title}
                      </h2>
                    </div>

                    <div className="ml-[2.4rem] ">
                      <p className="text-lg">{artDetails?.description}</p>
                    </div>

                    <div className="w-full flex justify-end">
                      <div className="h-[2.6rem] w-[6rem] border-[#000] border-0 border-r-[4px] border-b-[4px] "></div>
                    </div>
                  </div>
                </div>

                <div className="md:grid grid-cols-4 flex flex-wrap mb-[4rem] w-[50%] mt-4 ">
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

              <div className="flex items-center space-x-2">
                <div className="h-[3rem] w-[9rem] rounded-md bg-black flex items-center justify-center ">
                  <p className="text-white">BIDS PLACED</p>
                </div>
                <div className="h-[3rem] px-4 rounded-md bg-black flex items-center justify-center ">
                  <p className="text-white font-medium ">
                    {artBiddings?.length}
                  </p>
                </div>
              </div>

              <div className="mt-[2rem] space-y-4 ">
                {[...(artBiddings || [])].map((bid, idx) => (
                  <BidRank position={idx} key={bid?._id} bid={bid} />
                ))}
              </div>
            </div>
            <Footer />
          </>
        )}
      </Container>
    </main>
  );
};

export default AuctionDetails;
