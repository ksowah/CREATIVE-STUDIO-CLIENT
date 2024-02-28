import Container from "@/components/Container";
import Header from "@/components/Header";
import React from "react";
import { BsCart4 } from "react-icons/bs";

const ArtDetails = () => {
  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[10rem]  mx-auto">
          {/* main div for the two */}
          <div className="flex	">
            <div>
              <img
                src="/images/mainpicture.png"
                className="w-[500px] h-[365px] "
              />
            </div>

            {/* div for the second writings */}
            <div className="w-[500px] ml-[6rem]">
              <p className="font-medium text-[30px]">VISIONARY 3</p>
              <p className="text-[13px]">Painting Abstract</p>

              {/* div for the size to year */}
              <div className=" mt-6 text-[13px]">
                <p>Size: 100x150cm</p>
                <p>Medium: Acryl</p>
                <p>Material: Canvas</p>
                <p>Year: 2022</p>
              </div>
              {/* size ends here */}

              {/* the div beneath */}
              <div className="w-[500px] h-[160px] mt-8 bg-[#f0f0f0] pt-2 pl-3">
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

                <div className="flex justify-between mt-8 pr-3">
                  <p className="text-[25px] font-medium">$1500</p>


                  <button className="bg-black w-[100px] h-[35px] text-white rounded-[7px] flex justify-center items-center">
                    <BsCart4  className=" mr-2"/>
                    <p className="font-semibold text-[13px]">Add to cart</p>
                  </button>
                </div>
              </div>
              {/* beneath ends here */}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ArtDetails;
