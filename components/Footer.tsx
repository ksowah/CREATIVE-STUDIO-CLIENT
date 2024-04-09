import React from "react";

const Footer = ({noborder}:{noborder?:boolean}) => {
  return (
    <div className={`w-full mt-[12rem] ${noborder ? "border-0" : "border-t"}`}>
      <div className="w-full space-y-6 lg:space-y-0 lg:space-x-16 flex flex-col lg:flex-row lg:items-center lg:justify-center py-[2rem] lg:py-[4rem]" >
        <ul className="space-y-1">
          <li className="font-medium text-sm text-[#53525C] mb-2">ABOUT US</li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Terms & conditions
          </li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Privacy Policy
          </li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Accessibility
          </li>
        </ul>

        <ul className="space-y-1">
          <li className="font-medium text-sm text-[#53525C] mb-2">
            ASSISTANCE
          </li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Terms & conditions
          </li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Privacy Policy
          </li>
          <li className="text-xs text-[#53525C] cursor-pointer ">
            Accessibility
          </li>
        </ul>

        <ul className="space-y-1">
          <li className="font-medium text-sm text-[#53525C] mb-2">SOCIALS</li>
          <li className="text-xs text-[#53525C] cursor-pointer ">Instagram</li>
          <li className="text-xs text-[#53525C] cursor-pointer ">Twitter</li>
          <li className="text-xs text-[#53525C] cursor-pointer ">Pintrest</li>
        </ul>
      </div>

      <p className="text-[10px] mb-8 text-[#53525C] " >@2023. All rights reserved</p>
    </div>
  );
};

export default Footer;
