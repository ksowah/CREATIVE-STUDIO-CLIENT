import { RiWallet3Fill } from "react-icons/ri";
import { RiCashLine } from "react-icons/ri";
import { PiHandCoinsBold } from "react-icons/pi";
import { FaShieldHalved } from "react-icons/fa6";
import Image from "next/image";
import { formatAmount } from "@/helpers/functions";

interface Props {
  children: any;
  wallet: Wallet;
}

const WalletContainer = ({ children, wallet }: Props) => {


  return (
    <div className="pt-[7rem] flex space-x-6 ">
      <div className="space-y-6 h-[27rem] ">
        <div className="border w-[16rem] flex flex-col items-center ">
          <div className="relative h-[4rem] w-full flex items-center px-3 justify-between ">
            <Image
              style={{ objectFit: "cover" }}
              fill
              src={"/images/slate.svg"}
              alt=""
            />
            <p className="z-10 text-white font-medium">STUDIO WALLET</p>

            <Image
              width={30}
              height={30}
              src={"/icons/wallet.svg"}
              alt=""
              className="z-10"
            />
          </div>

          <div className="border-b w-[70%] my-2 " />

          {wallet?.auctionBidsPlacedAmount > 0 ? (
            <>
              <div className="flex items-center justify-between w-full text-[#595862] text-[1.1rem] px-2 pb-2 ">
                <p className="text-[.9rem] " >Gross balance</p>
                <p className="font-bold">${formatAmount(wallet?.balance + wallet?.auctionBidsPlacedAmount)}</p>
              </div>
              <div className="flex items-center justify-between w-full text-[#595862] text-[1.1rem] px-2 pb-2 ">
                <p className="text-[.9rem] ">Auction bill</p>
                <p className="font-bold">${formatAmount(wallet?.auctionBidsPlacedAmount)}</p>
              </div>
              <div className="flex items-center justify-between w-full text-[#595862] text-[1.1rem] px-2 pb-2 ">
                <p className="text-[.9rem] ">Net balance</p>
                <p className="font-bold">${formatAmount(wallet?.balance)}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-[#595862] text-[1.1rem] px-2 pb-2 ">
              <p className="text-[.9rem] ">Balance</p>
              <p className="font-bold">${formatAmount(wallet?.balance)}</p>
            </div>
          )}
        </div>

        <div className="border w-[16rem] flex flex-col items-center ">
          <div className="h-[3rem] cursor-pointer w-full flex items-center px-3 space-x-4 bg-[#595862] ">
            <RiWallet3Fill size={25} color="white" />
            <p className="font-medium text-white">Deposit</p>
          </div>

          <div className="h-[3rem] cursor-pointer w-full flex items-center px-3 space-x-4 ">
            <RiCashLine size={25} color="#595862" />
            <p className="text-[#595862]">Withdraw</p>
          </div>

          <div className="h-[3rem] cursor-pointer w-full flex items-center px-3 space-x-4 ">
            <PiHandCoinsBold size={25} color="#595862" />
            <p className="text-[#595862]">Transaction</p>
          </div>

          <div className="h-[3rem] cursor-pointer w-full flex items-center px-3 space-x-4 ">
            <FaShieldHalved size={25} color="#595862" />
            <p className="text-[#595862]">Safety & Security</p>
          </div>
        </div>
      </div>

      <div className="flex-1 border p-[2rem] ">{children}</div>
    </div>
  );
};

export default WalletContainer;
