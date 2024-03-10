import { Checkbox, FormGroup } from "@mui/material";
import Image from "next/image";
import { ImHammer2 } from "react-icons/im";
import { RiVisaLine } from "react-icons/ri";
import ButtonSolid from "./ButtonSolid";
import { FaRegClock } from "react-icons/fa6";


const PaymentCard = ({
  setBidAmount,
  onClick,
  isAuctionLive,
}: {
  setBidAmount?: any;
  onClick?: any;
  isAuctionLive?: boolean;
}) => {
  return (
    <div className="w-[24rem] border rounded-lg">
      {/* header part */}
      <div className="h-[3.95rem] border-b flex items-center justify-end px-[1rem] space-x-2 ">
        {isAuctionLive ? (
          <>
            <p>LIVE</p>
            <div className="h-[1.2rem] w-[1.2rem] rounded-full bg-[#D9D9D9] animate-pulse flex items-center justify-center ">
              <div className="h-[.75rem] w-[.75rem] rounded-full bg-[#000000] "></div>
            </div>
          </>
        ) : (
          <>
            <p>Upcoming</p>
            <FaRegClock size={16} />
          </>
        )}
      </div>

      <div className="w-full flex flex-col items-center p-[1rem]">
        <div className="h-[4rem] w-[4rem] -mt-[3rem] mb-4 z-10 rounded-full bg-[#f4f4f4] flex items-center justify-center ">
          <ImHammer2 size={30} />
        </div>
        <p className="text-center text-[.85rem] w-[18rem] ">
          By placing the order, you agree to the{" "}
          <span className="font-bold cursor-pointer">Delivery terms</span>
        </p>

        <div className="flex items-center justify-start space-x-2 w-full my-[1rem] ">
          <div className="h-[2rem]  w-[2.6rem] border flex items-center justify-center ">
            <RiVisaLine color="#222357" size={30} />
          </div>
          <div className="relative h-[2rem]  w-[2.6rem] border ">
            <Image
              src={"/images/master.png"}
              fill
              style={{ objectFit: "contain" }}
              alt="mastercard"
            />
          </div>
          <div className="relative h-[2rem]  w-[2.6rem] border ">
            <Image
              src={"/images/paypal.png"}
              fill
              style={{ objectFit: "contain" }}
              alt="mastercard"
            />
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <p>BID AMOUNT</p>

          <div className="h-[2rem] w-[8rem] border flex items-center px-1 ">
            <input
              onChange={(e) => setBidAmount(e.target.value)}
              type="number"
              className="w-full border-none outline-none"
            />
          </div>
        </div>

        <FormGroup className="w-full flex flex-col items-start my-4">
          <div className="flex items-center">
            <Checkbox />
            <p className="text-sm">
              I have read and agreed to the Privacy Policy
            </p>
          </div>
          <div className="flex ">
            <Checkbox />
            <p className="text-sm">
              I have read and agreed to the Refund and Cancellation policy
            </p>
          </div>
        </FormGroup>

        <ButtonSolid onClick={onClick} className="my-4" title="PLACE BID" />
      </div>
    </div>
  );
};

export default PaymentCard;
