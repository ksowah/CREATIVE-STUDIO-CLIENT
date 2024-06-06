"use client";

import { TbEdit } from "react-icons/tb";
import { GoLock } from "react-icons/go";
import { LuBell } from "react-icons/lu";
import { CiCreditCard1 } from "react-icons/ci";
import { ReactNode, useContext } from "react";
import { MyContext } from "@/context/Context";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { PiPackage } from "react-icons/pi";


const SettingsContainer = ({ children }: { children: ReactNode }) => {
  const { appState, setAppState } = useContext(MyContext);
  const user:User = appState?.session;

  const router = useRouter();
  const pathname = usePathname();

  const signOut = () => {
    setAppState((prev: any) => ({ ...prev, session: null }));
    localStorage.removeItem("cstoken");
    router.push("/");
  };

  const baseUrl = `/profile/${user?.username}/settings`


  const Tab = ({Icon, route, title}:{route:string, title:string, Icon:any})=> {
    return (
      <div onClick={()=>router.push(`${baseUrl}/${route}`)} className="flex items-center w-full space-x-2 px-6 py-2 hover:bg-gray-100  cursor-pointer">
        <Icon size={22} color={`${pathname.endsWith(route) ? "black" : "#B1B1B1"}`} />
        <p className={`${pathname.endsWith(route) ? "text-black font-medium" : "text-[#B1B1B1]"}`}>{title}</p>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-8 pt-[10rem] mb-[4rem] ">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-[18rem] py-4 border bg-white rounded-lg ">
        <div onClick={()=>router.push(`${baseUrl}`)} className="flex items-center w-full space-x-2 px-6 py-2 hover:bg-gray-100  cursor-pointer">
          <TbEdit size={22} color={`${pathname.endsWith("settings") ? "black" : "#B1B1B1"}`} />
          <p className={`${pathname.endsWith("settings") ? "text-black font-medium" : "text-[#B1B1B1]"}`}>Edit Profile</p>
        </div>
          <Tab Icon={GoLock} route="/" title="Password" />
          <Tab Icon={LuBell} route="notifications" title="Notifications" />
          <Tab Icon={CiCreditCard1} route="/" title="Billing" />
          <Tab Icon={PiPackage} route="orders" title="Orders" />
          <Tab Icon={HiOutlineLocationMarker} route="address" title="Address" />
        </div>
        <p onClick={signOut} className="mt-4 cursor-pointer text-red-600 ">Sign out</p>
      </div>

      <div className="flex-1 bg-white rounded-lg border">{children}</div>
    </div>
  );
};

export default SettingsContainer;
