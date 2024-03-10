"use client";

import { GET_ACTIVE_AND_UPCOMING_AUCTIONS } from "@/apollo/queries/auction";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuctionRoomItem from "@/components/art/AuctionRoomItem";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@mui/material";
import React from "react";

const AuctionRoom = () => {
  const { data, loading } = useQuery(GET_ACTIVE_AND_UPCOMING_AUCTIONS);

  const openedAuctions = data?.getActiveAndUpcomingAuctions;

  const today = new Date().setHours(0, 0, 0, 0);

  const rearrangedAuctions = openedAuctions?.reduce(
    (acc: any, auction: ArtPiece) => {
      const auctionStartDate = parseInt(auction.auctionStartDate);

      if (auctionStartDate >= today && auctionStartDate < today + 86400000) {
        acc.today.push(auction);
      } else if (
        auctionStartDate >= today + 86400000 &&
        auctionStartDate < today + 172800000
      ) {
        // 86400000 milliseconds = 1 day
        acc.tomorrow.push(auction);
      } else if (auctionStartDate >= today + 172800000) {
        const auctionDateKey = new Date(parseInt(auction.auctionStartDate))
          .toISOString()
          .split("T")[0];
        if (!acc[auctionDateKey]) {
          acc[auctionDateKey] = [];
        }
        acc[auctionDateKey].push(auction);
      } else {
        acc.active.push(auction);
      }

      return acc;
    },
    { active: [], today: [], tomorrow: [] }
  );

  const auctionGroups = Object.entries(
    rearrangedAuctions ? rearrangedAuctions : {}
  );
  console.log("auctionGroups >>>", auctionGroups);

  return (
    <main>
      <Header />

      <Container>
        {loading ? (
          <>
            <div className="flex pt-[7rem]">
              <div className="w-[16rem] mt-[2rem] h-[4rem] rounded-l-lg overflow-hidden ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="flex-1 h-[12rem] ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
            </div>
            <div className="flex pt-[7rem]">
              <div className="w-[16rem] mt-[2rem] h-[4rem] rounded-l-lg overflow-hidden ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
              <div className="flex-1 h-[12rem] ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pt-[7rem] ">
              {auctionGroups?.map(
                (group, idx) =>
                  // @ts-ignore
                  group[1].length > 0 && (
                    <AuctionRoomItem key={idx} group={group} />
                  )
              )}
            </div>

            <div className="mt-[6rem] border-t flex flex-col items-center justify-center ">
              <div className="w-[50%] mt-[4rem]  ">
                <div className="flex items-center h-[2.6rem] w-[6rem] border-[#000] border-0 border-l-[4px] border-t-[4px] px-4 overflow-visible ">
                  <h2 className="font-medium text-[1.2rem] text-[#5C5B66] text-nowrap ">
                    What’s an Auction?
                  </h2>
                </div>

                <div className="ml-[2.4rem] ">
                  <p className="text-lg text-[#5C5B66] ">
                    An Auction is a public sale where goods or services are sold
                    to the highest bidder. In an auction, the item being sold
                    (referred to as the &quot;lot&quot;) is presented to potential buyers,
                    who then place bids on the item. The auctioneer oversees the
                    process, announcing each bid and facilitating the sale.
                  </p>
                </div>

                <div className="w-full flex justify-end">
                  <div className="h-[2.6rem] w-[6rem] border-[#000] border-0 border-r-[4px] border-b-[4px] "></div>
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

export default AuctionRoom;
