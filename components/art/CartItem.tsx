"use client";

import { REMOVE_FROM_CART } from "@/apollo/mutations/cart";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import { useMutation } from "@apollo/client";
import Image from "next/image";

interface Props {
  artPreview: string;
  title: string;
  artist: string;
  dimension: string;
  category: string;
  price: string;
  itemId: string;
}

const CartItem = ({
  artPreview,
  artist,
  category,
  dimension,
  price,
  title,
  itemId,
}: Props) => {
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const handleRemoveFromCart = async () => {
    try {
        await removeFromCart({
          variables: { itemId },
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
        console.log("error occured >>", error)
    }
  };


  return (
    <div className="flex space-x-4 text-[#595862] mb-[2rem] ">
      <div className="relative h-[8rem] w-[8rem] rounded-lg overflow-hidden ">
        <Image
          src={artPreview}
          fill
          style={{ objectFit: "cover" }}
          alt="other images"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <p className="font-medium text-[.9rem] ">{title}</p>
        <p className="text-[.8rem] ">Artist: {artist}</p>
        <p className="text-[.8rem] ">Dimension: {dimension}</p>
        <p className="text-[.8rem] ">Category: {category}</p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p onClick={handleRemoveFromCart} className="text-[.8rem] cursor-pointer underline ">remove</p>
        <p className="text-[.8rem] ">
          Price: <span className="font-medium text-[1.1rem] ">${price}</span>
        </p>
      </div>
    </div>
  );
};

export default CartItem;
