"use client";

import { CONFIRM_ORDER } from "@/apollo/mutations/cart";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import { GET_DELIVERY_ADDRESS } from "@/apollo/queries/user";
import ButtonSolid from "@/components/ButtonSolid";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CartItem from "@/components/art/CartItem";
import { MyContext } from "@/context/Context";
import { formatAmount } from "@/helpers/functions";
import { useMutation, useQuery } from "@apollo/client";
import { Radio, RadioGroup } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { GoChevronRight } from "react-icons/go";

const ConfirmOrder = () => {
  const { appState } = useContext(MyContext);
  const router = useRouter();

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState("Door delivery");

  const user: User = appState?.session;

  const { data, loading } = useQuery(GET_CART_ITEMS);
  const { data: deliveryData, error } = useQuery(GET_DELIVERY_ADDRESS, {
    variables: { userId: user?._id },
  });
  
  
  const address: Address = deliveryData?.getDeliveryAddress;
  
  const cartItems = data?.getCartItems;
  
  const itemIds = cartItems?.map((item:any) => item.item._id);

  const [confirmOrder, {data:connfirmData, loading:confirmLoading}] = useMutation(CONFIRM_ORDER, {
    variables: {items:itemIds}
  })
  
  const numberOfCartItems = data?.getCartItems.length;

  // get the subtotal price of all items in the cart
  const subTotal = cartItems?.reduce((acc: number, item: any) => {
    return acc + item.item.price;
  }, 0);

  const deliveryFees = 10;

  const confirmUserOrders = async ()=> {
    try {
      await confirmOrder()
      console.log("doneeee!!")
      router.push(`/profile/${user?.username}/settings/orders`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main>
      <Header />

      <Container>
        <div className="w-full mt-[7rem] my-[2rem] rounded-xl  border ">
          <div className="px-4 flex items-center justify-between h-[4rem] border-b ">
            <p className="text-[#595862] font-medium text-[1.4rem] ">Address</p>
            <div onClick={() => router.push(`/profile/${user?.username}/settings/address`) }
              className="group flex items-center cursor-pointer">
              <p className="text-sm group-hover:scale-110 duration-300">
                Change
              </p>
              <GoChevronRight />
            </div>
          </div>

          <div className="w-full p-4 py-6 ">
            {address ? (
              <>
                <p className="font-medium mb-1">{user?.fullName}</p>
                <p className="text-xs text-[#595959] ">
                  {`${address?.street}, ${address?.houseNumber}`}
                </p>
                <p className="text-xs text-[#595959] ">{address?.city}</p>
                <p className="text-xs text-[#595959] ">{address?.telephone}</p>
              </>
            ) : (
              <div className="w-full flex flex-col items-center justify-center space-y-2">
                <p>Please add your delivery address</p>
                <ButtonSolid
                  onClick={() =>
                    router.push(`/profile/${user?.username}/settings/address`)
                  }
                  title="Add address"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full my-[2rem] rounded-xl  border ">
          <div className="px-4 flex items-center justify-between h-[4rem] border-b ">
            <p className="text-[#595862] font-medium text-[1.4rem] ">
              Delivery
            </p>
          </div>
          <div className="w-full px-4 py-6">
            <RadioGroup
              value={selectedDeliveryMethod}
              onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
            >
              <div className="flex items-center">
                <p className="font-medium">Door Delivery</p>
                <Radio
                  value="Door delivery"
                  size="small"
                  style={{ color: "#666666" }}
                />
              </div>
              <p className="text-xs text-[#595959] mb-4">
                Delivery between 10th June to 15th June
              </p>
              <div className="flex items-center">
                <p className="font-medium">Self Pickup</p>
                <Radio
                  value="Self pickup"
                  size="small"
                  style={{ color: "#666666" }}
                />
              </div>
              <p className="text-xs text-[#595959]">
                Delivery between 10th June to 15th June
              </p>
            </RadioGroup>
          </div>
        </div>

        <div className="w-full my-[2rem] rounded-xl  border ">
          <div className="px-4 flex items-center justify-between h-[4rem] border-b ">
            <p className="text-[#595862] font-medium text-[1.4rem] ">
              Review and confirm your order ({numberOfCartItems} items)
            </p>
          </div>

          <div className="w-full px-4 py-6">
            {cartItems?.map((art: any, idx: any) => (
              <CartItem
                removable={false}
                cartItem={art?.item}
                key={art?.item._id}
              />
            ))}
          </div>
        </div>

        <div className="w-full my-[2rem] rounded-xl  border ">
          <div className="px-4 flex items-center justify-between h-[4rem] border-b ">
            <p className="text-[#595862] font-medium text-[1.4rem] ">
              Order Summary
            </p>
          </div>

          <div className="w-full px-4 py-6">
            <div className="flex items-center justify-between text-sm font-light">
              <p>Items Total</p>
              <p>${formatAmount(subTotal)}</p>
            </div>
            <div className="flex items-center justify-between text-sm font-light">
              <p>Delivery fees</p>
              <p>${formatAmount(deliveryFees)}</p>
            </div>
            <div className="flex items-center justify-between font-medium">
              <p>Total</p>
              <p>${formatAmount(subTotal + deliveryFees)}</p>
            </div>
          </div>
        </div>

        <ButtonSolid
          className="w-[8rem] flex self-end "
          title="Confirm Order"
          onClick={confirmUserOrders}
        />

        <Footer />
      </Container>
    </main>
  );
};

export default ConfirmOrder;
