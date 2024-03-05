import Container from "@/components/Container";
import Header from "@/components/Header";
import React from "react";
import { BsCart4 } from "react-icons/bs";

    
const ArtDetails: React.FC = () => {  
  return (
    <main>
      <Header />

      <Container>
        <div className="pt-[10rem]">
          {/* main div for the two */}
          <div className="flex justify-evenly">
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


                  <button className="bg-black w-[110px] h-[35px] text-white rounded-[7px]  flex justify-center items-center">
                    <BsCart4  className="pl- mr-2"/>
                    <p className="font-semibold text-[12px]">Add to cart</p>
                  </button>
                </div>
              </div>
              {/* beneath ends here */}
            </div>
          </div>

          <div className="flex ml-[83px] h-[120px] w-[200px] mt-10 " >
            <img src="../images/smallpic.png" className="mr-7"/>
            <img src="../images/smallpic1.png" />
          </div>

          {/* Text underneath */}
          <div className="ml-[83px]  w-[500px]">
            <h2 className="mt-[4rem] mb-3 text-[23px] font-semibold">History</h2>
            <p className="text-[13px]">
            This set of 2 miniature ballet paintings, created in oil on canvas, features textured paint strokes and gentle shades. The paintings depict gracious ballerinas in white and black tutu dresses.
            </p>
            <p className="text-[13px]">
            You can choose framed (wooden frame) or unframed (on canvas board) options.

            </p>
            <p className="text-[13px]">
I use the highest quality European-made materials. Clear, gloss coating protects your cherished fine art investment from UV light, moisture, and dust. Canvas is 100% linen.
            </p>
            <p className="text-[13px] mb-[4rem]">
            This set of miniature paintings is signed and dated by the artist, a certificate of authenticity is included.
            </p>
          </div>
          <div className="border-t">
          <p className="mt-[2rem] text-center text-[22px] font-medium">You May Also Like</p>

         
          </div>
          
        </div>
      </Container>
      
    </main>
  );
};

export default ArtDetails;
