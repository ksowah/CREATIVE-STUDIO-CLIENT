import React from "react";
import SessionAvatar from "../SessionAvatar";
import { formatAmount } from "@/helpers/functions";

const BidRank = ({bid, position}:{bid:any, position:number}) => {

  let rankPosition = position + 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-b py-[1rem] sm:mb-0 ">
      <div className="flex items-center space-x-4">
        <SessionAvatar image={bid?.bidBy.avatar} size={50} />
        <p>{bid?.bidBy.fullName}</p>
      </div>

      <div className="flex items-center mt-4 sm:mt-0 space-x-2 sm:space-x-4">
        <div className="h-[2.5rem] w-[7.5rem] sm:h-[3rem] sm:w-[9rem] rounded-md border flex items-center justify-center ">
          <p>BID AMOUNT</p>
        </div>
        <div className="h-[2.5rem] sm:h-[3rem] px-2 sm:px-4 rounded-md border flex items-center justify-center ">
          <p>${formatAmount(bid?.bidAmount)}</p>
        </div>
        <div className="h-[2.5rem] sm:h-[3rem] px-2 sm:px-4 rounded-md border flex items-center justify-center ">
          <p>{rankPosition}{`${rankPosition === 1 ? "st" : rankPosition === 2 ? "nd" : rankPosition === 3 ? "rd" : "th"}`}</p>
        </div>
      </div>
    </div>
  );
};

export default BidRank;
