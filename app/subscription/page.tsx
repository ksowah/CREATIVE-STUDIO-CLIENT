import React from "react";
import Header from "@/components/Header";
import Container from "@/components/Container";
import Footer from "@/components/Footer";

interface CheapSubProps {
  text: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  price: string;
}

const CheapSub: React.FC<CheapSubProps> = ({
  text,
  text1,
  text2,
  text3,
  text4,
  text5,
  price,
}) => {
  return (
    <div className=" h-[450px] w-[250px] rounded-[20px] ml-10 border border-[#aeb0b2] bg-[#f8fcff]">
      <p className=" ml-5 mt-2 mb-3">{text}</p>
      <button className="bg-[#6461f1] text-white mt-[5px] rounded-[10px] ml-6 w-[200px] h-[40px]">
        GET STARTED
      </button>
      <div className="flex ml-6 my-5">
        <img src="/icons/check.svg" width={15} />
        <p className="text-[10px] ml-[5px]">{text1}</p>
      </div>
      <div className="flex ml-6 my-5">
        <img src="/icons/check.svg" width={15} />
        <p className="text-[10px] ml-[5px]">{text2}</p>
      </div>
      <div className="flex ml-6 my-5">
        <img src="/icons/check.svg" width={15} />
        <p className="text-[10px] ml-[5px]">{text3}</p>
      </div>
      <div className="flex ml-6 my-5">
        <img src="/icons/check.svg" width={15} />
        <p className="text-[10px] ml-[5px]">{text4}</p>
      </div>
      <div className="flex ml-6 my-5">
        <img src="/icons/check.svg" width={15} />
        <p className="text-[10px] ml-[5px]">{text5}</p>
      </div>
      <p className="ml-6 text-[26px] font-medium">
        {price}<span className="text-[8px] font-light">/monthly</span>
      </p>
    </div>
  );
};

const Subscription: React.FC = () => {
  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[8rem] ">
          <h3 className="text-center text-[30px] font-semibold">
            Choose your right plan!
          </h3>
          <p className="text-center text-[14px] mt-3 w-[520px] mx-auto">
            Grow your design business with 10x more shot visibility & premium
            features to showcase your work.
          </p>

          <div className="w-[600px] h-[60px] bg-[#f4f4f4] mx-auto mt-10 rounded-[70px]  flex">
            <button className="bg-[#6461f1] text-white mt-[5px] rounded-[30px] ml-[5px] w-[300px] h-[50px]">
              Monthly
            </button>

            <p className="mx-auto flex items-center justify-center">Yearly</p>
          </div>
          <p className="text-center text-[30px] font-medium mt-20">Subscription Plan</p>

          <div className=" h-[40rem] flex items-center justify-center">
            <CheapSub
              text={"Free"}
              text1={"Basic profile with limited uploads"}
              text2={"Standard portfolio features"}
              text3={"Community engagement"}
              text4={"Access to basic resources"}
              text5={"Standard customer support"}
              price={"$0"}
            />

            <div className=" h-[550px] w-[250px] rounded-[20px] ml-10 border border-[#aeb0b2] bg-gradient-to-b from-[#212121] to-[#666]">
              <p className=" ml-5 mt-2 mb-3 text-white">Premium</p>
              <button className="bg-[#fff] text-black mt-[5px] rounded-[10px] ml-6 w-[200px] h-[40px]">
                GET STARTED
              </button>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">All Pro plan features for each member</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Choose to become a designer/artist</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Advanced portfolio customization</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Pro badge and priority support</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">High-resolution image showcase</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Collaboration opportunities</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Industry-specific resources</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Industry-specific resources</p>
              </div>
              <div className="flex ml-6 my-5">
                <img src="/icons/check1.svg" width={15} />
                <p className="text-[10px] text-white ml-[5px]">Featured artist on the homepage</p>
              </div>
              <p className="ml-6 text-[26px] text-white font-medium">
                $12<span className="text-[8px] font-light">/monthly</span>
              </p>
            </div>
            <CheapSub
              text={"Starter"}
              text1={"Basic profile with limited uploads"}
              text2={"Basic profile with limited uploads"}
              text3={"Basic profile with limited uploads"}
              text4={"Basic profile with limited uploads"}
              text5={"Basic profile with limited uploads"}
              price={"$6"}
            />   

          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
};

export default Subscription;
