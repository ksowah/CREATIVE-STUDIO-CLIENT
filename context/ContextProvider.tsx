"use client";

import { ReactNode, useEffect, useState } from "react";
import { MyContext } from "./Context";
import { useQuery } from "@apollo/client";
import { GET_ME } from "@/apollo/queries/user";


const ContextProvider = ({children}:{children:ReactNode}) => {

    const [appState, setAppState] = useState({
        session: null,
        artUpload: {
          selectedImage: "",
          selectedImages: [],
          tile: ""
        }
    })

    const {data} = useQuery(GET_ME);

    useEffect(() => {
      setAppState((prev:any) => ({ ...prev, session: data?.getMe.user}))
    }, [data])

  return (
    <>
        <MyContext.Provider value={{appState, setAppState}}>
            {children}
        </MyContext.Provider>
    </>
  )
}

export default ContextProvider