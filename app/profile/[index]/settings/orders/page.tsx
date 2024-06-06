"use client";

import { GET_USER_ORDERS } from "@/apollo/queries/cart";
import Container from "@/components/Container";
import Header from "@/components/Header";
import SettingsContainer from "@/components/SettingsContainer";
import CartItem from "@/components/art/CartItem";
import { useQuery } from "@apollo/client";

const UserOrders = () => {
  const { data } = useQuery(GET_USER_ORDERS);

  const orders = data?.getOrders

  return (
    <div className="bg-[#F3F3F3] min-h-screen ">
      <Header />
      <Container>
        <SettingsContainer>
          <div className="p-[2rem] ">
            <h2 className="font-medium text-[1.6rem] ">Orders</h2>
          </div>

          <div className="w-full px-[2rem]">
            {orders?.map((order:any)=> (
              <CartItem key={order?._id} removable={false} cartItem={order} />
            ))}
          </div>
        </SettingsContainer>
      </Container>
    </div>
  );
};

export default UserOrders;
