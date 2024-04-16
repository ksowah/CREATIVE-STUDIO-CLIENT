import { MdStorefront } from "react-icons/md";
import { ImRoad } from "react-icons/im";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { MyContext } from "@/context/Context";
import { RiWallet3Line } from "react-icons/ri";

interface Props {
  isOpen: boolean;
  setIsOpen: any;
}

const SideMenu = ({ isOpen, setIsOpen }: Props) => {
  const sidebarClasses = isOpen ? "translate-y-0" : "-translate-y-full";

  const router = useRouter();
  const pathname = usePathname();
  const { appState } = useContext(MyContext);

  const navigate = (route: string) => {
    router.push(route);
  };

  const user = appState.session;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className={`xl:hidden fixed z-30 top-0 bottom-0 w-full bg-black bg-opacity-40 transform transition-transform ease-in-out duration-500 ${sidebarClasses}`}
    >
      <div className="w-full bg-white h-[80%] pt-[5.1rem]">
        <div className="w-full h-full border-t ">
          <div
            onClick={() => navigate("/art")}
            className={`flex py-4 items-center space-x-2 justify-center border-b ${
              pathname === "/art" && "bg-gray-100"
            }`}
          >
            <p className="text-lg font-medium">Art Store</p>
            <MdStorefront size={20} />
          </div>
          <div className="flex py-4 items-center space-x-2 justify-center border-b">
            <p className="text-lg font-medium">Explore</p>
            <ImRoad size={20} />
          </div>
          <div
            onClick={() => navigate("/subscription")}
            className={`flex py-4 items-center space-x-2 justify-center border-b ${
              pathname.includes("/subscription") && "bg-gray-100"
            }`}
          >
            <p className="text-lg font-medium">Free + Premium</p>
            <MdOutlineWorkspacePremium size={20} />
          </div>
          {user && (
            <div
              onClick={() => navigate("/wallet")}
              className={`flex py-4 items-center space-x-2 justify-center border-b ${
                pathname.includes("/wallet") && "bg-gray-100"
              }`}
            >
              <p className="text-lg font-medium">Wallet</p>
              <RiWallet3Line size={20} />
            </div>
          )}
          <div
            onClick={() => navigate("/art/auctionroom")}
            className={`flex py-4 items-center space-x-2 justify-center border-b ${
              pathname.includes("/auctionroom") && "bg-gray-100"
            }`}
          >
            <p className="text-lg font-medium">Auction</p>
            <div className="items-center justify-center  ">
              <Image
                src={"/icons/hammer.svg"}
                alt=""
                height={20}
                width={20}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div
            onClick={() => navigate("/art/cart")}
            className={`flex py-4 items-center space-x-2 justify-center border-b ${
              pathname.includes("/cart") && "bg-gray-100"
            }`}
          >
            <p className="text-lg font-medium">My Cart</p>
            <MdOutlineShoppingCart size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
