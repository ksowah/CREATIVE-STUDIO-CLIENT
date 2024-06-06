"use client";

import { REMOVE_FROM_CART } from "@/apollo/mutations/cart";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import { formatAmount } from "@/helpers/functions";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import ArtImage from "./ArtImage";



const CartItem = ({ cartItem, removable }: {cartItem: ArtPiece, removable:boolean}) => {
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const router = useRouter();

  const handleRemoveFromCart = async () => {
    try {
      await removeFromCart({
        variables: { itemId: cartItem?._id },
        update(cache, { data: { removeFromCart } }) {
          const { getCartItems } = cache.readQuery<any>({
            query: GET_CART_ITEMS,
          });

          const updatedCartItems = getCartItems.filter(
            (item: any) => item.item._id !== removeFromCart.item
          );

          cache.writeQuery({
            query: GET_CART_ITEMS,
            data: { getCartItems: updatedCartItems },
          });
        },
      });
    } catch (error) {
      console.log("error occured >>", error);
    }
  };

  return (
    <div className="flex space-x-2 sm:space-x-4 text-[#595862] mb-[2rem] ">
      <div
        onClick={() => router.push(`/art/details/${cartItem?._id}`)}
        className="relative h-[5rem] w-[5rem] md:h-[8rem] md:w-[8rem] rounded-lg overflow-hidden cursor-pointer "
      >
        <ArtImage
          src={cartItem?.artPreview}
          fill
          style={{ objectFit: "cover" }}
          alt="other images"
        />
      </div>
      <div className="flex flex-col sm:flex-row flex-1" >
        <div className="flex-1 flex flex-col justify-between sm:py-2">
          <p className="font-medium text-[.8rem] lg:text-[.9rem] ">{cartItem?.title}</p>
          <div className="">
            <p className="text-[.7rem] lg:text-[.8rem] ">Artist: {cartItem?.artist?.fullName}</p>
            <p className="text-[.7rem] lg:text-[.8rem] ">
              Dimension: {cartItem?.dimensions}
            </p>
            <p className="text-[.7rem] lg:text-[.8rem] ">
              Category: {cartItem?.category}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between flex-1">
          {removable && (
          <p onClick={handleRemoveFromCart} className="text-[.8rem] cursor-pointer underline">
            remove
          </p>
          )}
          <p className="text-[.8rem] ">
            Price: <span className="font-medium text-[.9rem] sm:text-[1.1rem] ">${formatAmount(cartItem?.price)}</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default CartItem;
