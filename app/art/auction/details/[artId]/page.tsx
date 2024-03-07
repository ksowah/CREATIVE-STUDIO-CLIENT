import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Header from "@/components/Header";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { RiVisaLine } from "react-icons/ri";
import { ImHammer2 } from "react-icons/im";
import PaymentCard from "@/components/PaymentCard";
import SessionAvatar from "@/components/SessionAvatar";
import BidRank from "@/components/art/BidRank";
import Footer from "@/components/Footer";

const AuctionDetails = () => {
  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[7rem]">
          <div className="border rounded-lg w-full flex text-[#595862]">
            <div className="flex-1">
              {/* header part */}
              <div className="h-[4rem] border-b px-[2rem] flex items-center justify-between ">
                <h3 className="font-medium text-[1.3rem] ">Auction</h3>

                <p className="text-[.9rem]">DATE: 15th March, 2024</p>

                <p className="text-[.9rem]">TIME: 3h 54m 50s</p>
              </div>

              {/* content */}
              <div className="flex items-center space-x-8 p-[1.5rem] ">
                <div>
                  <div className="relative h-[18rem] w-[18rem]">
                    <Image
                      className="group-hover:scale-105 duration-500"
                      src={"/images/mainpicture.png"}
                      fill
                      style={{ objectFit: "contain" }}
                      alt="art image"
                    />
                  </div>
                </div>

                <div className="flex w-full items-end justify-between">
                  <div className="flex-1 flex flex-col space-y-2 ">
                    <p className="font-medium text-[1.3rem] ">
                      BLACK IS BEAUTIFUL
                    </p>
                    <p className="text-sm">Artist: Kelvin Sowah</p>
                    <p className="text-sm">Age: 22</p>
                    <p className="text-sm">Country: Ghana</p>
                  </div>

                  <p className="text-sm">Starting price: $40</p>
                </div>
              </div>
            </div>

            <PaymentCard />
          </div>

          <div className="mt-[2rem] flex items-center space-x-10 ">
            <div className="relative h-[40rem] w-[40rem]">
              <Image
                className="group-hover:scale-105 duration-500"
                src={"/images/mainpicture.png"}
                fill
                style={{ objectFit: "contain" }}
                alt="art image"
              />
            </div>

            <div className="flex-1 ">
              <div className="flex items-center h-[2.6rem] w-[6rem] border-[#000] border-0 border-l-[4px] border-t-[4px] px-4 overflow-visible ">
                <h2 className="font-medium text-[1.2rem] text-nowrap ">
                  BLACK IS BEAUTIFUL
                </h2>
              </div>

              <div className="ml-[2.4rem] ">
                <p className="text-lg">
                  Black is powerful. There is so much power that comes with
                  being black. And that includes beauty. The power that this
                  lady holds is captured in this image. This image represents
                  the beauty that is inherent in the nature of blacks.
                </p>
              </div>

              <div className="w-full flex justify-end">
                <div className="h-[2.6rem] w-[6rem] border-[#000] border-0 border-r-[4px] border-b-[4px] "></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-[3rem] w-[9rem] rounded-md bg-black flex items-center justify-center ">
              <p className="text-white">BIDS PLACED</p>
            </div>
            <div className="h-[3rem] px-4 rounded-md bg-black flex items-center justify-center ">
              <p className="text-white font-medium ">2</p>
            </div>
          </div>

          <div className="mt-[2rem] space-y-4 ">
            <BidRank />
            <BidRank />
          </div>
        </div>

        <Footer />
      </Container>
    </main>
  );
};

export default AuctionDetails;
