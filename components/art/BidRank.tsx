import React from "react";
import SessionAvatar from "../SessionAvatar";

const BidRank = ({bid, position}:{bid:any, position:number}) => {

  let rankPosition = position + 1;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SessionAvatar image={bid?.bidBy.avatar} size={50} />
        <p>{bid?.bidBy.fullName}</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-[3rem] w-[9rem] rounded-md border flex items-center justify-center ">
          <p>BID AMOUNT</p>
        </div>
        <div className="h-[3rem] px-4 rounded-md border flex items-center justify-center ">
          <p>${bid?.bidAmount}</p>
        </div>
        <div className="h-[3rem] px-4 rounded-md border flex items-center justify-center ">
          <p>{rankPosition}{`${rankPosition === 1 ? "st" : rankPosition === 2 ? "nd" : rankPosition === 3 ? "rd" : "th"}`}</p>
        </div>
      </div>
    </div>
  );
};

export default BidRank;
