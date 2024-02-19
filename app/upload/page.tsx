import ButtonOutlined from "@/components/ButtonOutlined";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UploadDialogue from "@/components/UploadDialogue";
import Uploader from "@/components/Uploader";
import React from "react";


const UploadDesign = () => {
  return (
    <main className="w-full">
      <Header />

      <Container>
        <div className="pt-[10rem] ">
          <p className="font-medium text-[.9rem] text-[#595862] " >What have you been working on?</p>

          <div className="w-full" >
            <input type="text" placeholder="Project Title" className="w-full mt-6 font-medium text-[1.4rem] border-none outline-none " />
          
           <Uploader />

            <div className="w-full mt-6 flex items-center justify-between" >
                <ButtonOutlined className="h-[2.8rem] w-[9rem] " title="Cancel" />

                <div className="flex items-center space-x-4" >
                    <ButtonSolid className="h-[2.8rem] w-[9rem]" title="save as draft" />
                    <UploadDialogue />
                </div>
            </div>
          </div>
        </div>

        <div className="h-[12rem]"></div>
        <Footer />
      </Container>

    </main>
  );
};

export default UploadDesign;
