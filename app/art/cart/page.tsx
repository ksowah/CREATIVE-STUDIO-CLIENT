"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EmptyCart from "@/components/art/EmptyCart";
import PaymentCard from "@/components/PaymentCard";
import CartItem from "@/components/art/CartItem";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@mui/material";

const CartPage = () => {
  const { data, loading } = useQuery(GET_CART_ITEMS);

  const cartItems = data?.getCartItems;

  const numberOfCartItems = data?.getCartItems.length

  // get the subtotal price of all items in the cart
  const subTotal = cartItems?.reduce((acc: number, item: any) => {
    return acc + item.item.price;
  }, 0);

  return (
    <main>
      <Header />
      <Container>
        {loading ? (
          <div className="pt-[7rem] flex space-x-6 " >
            <div className="flex-1" >
              <Skeleton className="mb-[1rem] " variant="rectangular" width={"100%"} height={200} />
              <Skeleton className="mb-[1rem] " variant="rectangular" width={"100%"} height={200} />
            </div>
            <Skeleton className="" variant="rectangular" width={400} height={320} />
          </div>
        ) : (
          <>
            <div className="pt-[7rem] ">
              {cartItems?.length > 0 ? (
                <div className="w-full border rounded-lg flex ">
                  <div className="flex-1 text-[#595862] ">
                    {/* Header */}
                    <div className="h-[4rem] w-full border-b flex items-center justify-between px-[1rem] ">
                      <div className="flex items-center space-x-8">
                        <h3 className="text-[1.2rem] font-medium ">
                          Your Gallery
                        </h3>
                        <p className="text-sm">{numberOfCartItems} ITEMS</p>
                      </div>

                      <p className="font-medium text-sm">Keep Shopping</p>
                    </div>

                    <div className="w-full p-[1rem]">
                      {cartItems?.map((art: any, idx: any) => (
                        <CartItem
                          key={art?.item._id}
                          artPreview={art?.item.artPreview}
                          artist={art?.artist.fullName}
                          category={art?.item.category}
                          dimension={art?.item.dimensions}
                          price={art?.item.price}
                          title={art?.item.title}
                          itemId={art?.item._id}
                        />
                      ))}
                    </div>
                  </div>

                  <PaymentCard subtotal={subTotal} />
                </div>
              ) : (
                <EmptyCart />
              )}
            </div>
            <Footer />
          </>
        )}
      </Container>
    </main>
  );
};

export default CartPage;
