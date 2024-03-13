import React, { use } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import ButtonSolid from "../ButtonSolid";
import { useRouter } from "next/navigation";

const EmptyCart = () => {

  const router = useRouter();

  return (
    <div className="h-[35rem]  border border-[#bdbcco] rounded-[10px] flex flex-col items-center justify-center ">
        <div className="h-[14rem] w-[14rem] rounded-full bg-[#f4f4f4] flex items-center justify-center " >
        <MdOutlineShoppingCart size={120} />
        </div>

        <p className="text-[#5c5b66] font-medium text-[1rem] mt-5">
          Ooops! Your cart is empty
        </p>
        <p className="text-[13px] my-5 text-[#5C5B66] ">
          It’s worth every penny spent on an artwork!
        </p>
        
        <ButtonSolid onClick={() => router.push("/art")} title="START SHOPPING" />
    </div>
  );
};

export default EmptyCart;
