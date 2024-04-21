"use client";

import { REMOVE_FROM_CART } from "@/apollo/mutations/cart";
import { GET_CART_ITEMS } from "@/apollo/queries/cart";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  artPreview: string;
  title: string;
  artist: string;
  dimension: string;
  category: string;
  price: string;
  itemId: string;
  id: string;
}

const CartItem = ({
  artPreview,
  artist,
  category,
  dimension,
  price,
  title,
  itemId,
  id,
}: Props) => {
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const router = useRouter();

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
      console.log("error occured >>", error);
    }
  };

  return (
    <div className="flex space-x-2 sm:space-x-4 text-[#595862] mb-[2rem] ">
      <div
        onClick={() => router.push(`/art/details/${id}`)}
        className="relative h-[5rem] w-[5rem] md:h-[8rem] md:w-[8rem] rounded-lg overflow-hidden cursor-pointer "
      >
        <Image
          src={artPreview}
          fill
          style={{ objectFit: "cover" }}
          alt="other images"
        />
      </div>
      <div className="flex flex-col sm:flex-row flex-1" >
        <div className="flex-1 flex flex-col justify-between sm:py-2">
          <p className="font-medium text-[.8rem] lg:text-[.9rem] ">{title}</p>
          <div className="">
            <p className="text-[.7rem] lg:text-[.8rem] ">Artist: {artist}</p>
            <p className="text-[.7rem] lg:text-[.8rem] ">
              Dimension: {dimension}
            </p>
            <p className="text-[.7rem] lg:text-[.8rem] ">
              Category: {category}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between flex-1">
          <p
            onClick={handleRemoveFromCart}
            className="text-[.8rem] cursor-pointer underline "
          >
            remove
          </p>
          <p className="text-[.8rem] ">
            Price: <span className="font-medium text-[.9rem] sm:text-[1.1rem] ">${price}</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default CartItem;
