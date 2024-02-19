import Image from 'next/image'
import React from 'react'
import { CiHeart } from "react-icons/ci";
import { TfiSave } from "react-icons/tfi";


interface Props {
    image: string;
}

const ProfileWork = ({image}:Props) => {
  return (
    <div className='group relative cursor-pointer h-[16rem] w-[18rem] mb-8 rounded-lg overflow-hidden ' >
        <Image src={image} className='group-hover:scale-125 duration-500' fill alt='work' />

        <div className='absolute opacity-0 group-hover:opacity-90 duration-500 bottom-0 z-10 w-full h-[4rem] flex items-center justify-between px-2 bg-gradient-to-t from-blackRgba to-transparent ' >
            <p className='text-xs text-white' >E-commerce  UI design</p>

            <div className='flex items-center space-x-2' >
                <div className='flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ' >
                    <CiHeart size={20} color='#fff' />
                </div>
                <div className='flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md ' >
                    <TfiSave size={16} color='#fff' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileWork