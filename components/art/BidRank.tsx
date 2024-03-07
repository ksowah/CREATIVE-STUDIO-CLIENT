import React from "react";
import SessionAvatar from "../SessionAvatar";

const BidRank = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <SessionAvatar image="/images/kev.jpg" size={50} />
        <p>Kelvin Sowah</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-[3rem] w-[9rem] rounded-md border flex items-center justify-center ">
          <p>BID AMOUNT</p>
        </div>
        <div className="h-[3rem] px-4 rounded-md border flex items-center justify-center ">
          <p>$200</p>
        </div>
        <div className="h-[3rem] px-4 rounded-md border flex items-center justify-center ">
          <p>1st</p>
        </div>
      </div>
    </div>
  );
};

export default BidRank;
