"use client";

import { ADD_DELIVERY_ADDRESS } from "@/apollo/mutations/user";
import { GET_DELIVERY_ADDRESS } from "@/apollo/queries/user";
import ButtonSolid from "@/components/ButtonSolid";
import CssTextField from "@/components/CSSTextField";
import Container from "@/components/Container";
import CoverLoader from "@/components/CoverLoader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SettingsContainer from "@/components/SettingsContainer";
import { MyContext } from "@/context/Context";
import { useMutation, useQuery } from "@apollo/client";
import { Alert } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

const Address = () => {
  const [deliveryAddress, setDeliveryAddress] = useState({
    city: "",
    street: "",
    postalCode: "",
    houseNumber: "",
    telephone: "",
  });
  const [isErrorOccured, setIsErrorOccured] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { appState } = useContext(MyContext);

  const user: User = appState?.session;

  const { data, error } = useQuery(GET_DELIVERY_ADDRESS, {
    variables: { userId: user?._id },
  });

  const address: Address = data?.getDeliveryAddress;

  const [addDeliveryAddress, { loading }] = useMutation(ADD_DELIVERY_ADDRESS);

  useEffect(() => {
    setDeliveryAddress({
      city: address?.city,
      houseNumber: address?.houseNumber,
      postalCode: address?.postalCode,
      street: address?.street,
      telephone: address?.telephone,
    });
  }, [data, user]);

  const handleInput = (e: any) => {
    setDeliveryAddress((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddDeliveryAddress = async () => {
    try {
      const { data } = await addDeliveryAddress({
        variables: {
          addressInput: deliveryAddress,
        },
      });

      if (data?.addDeliveryAddress) {
        setIsErrorOccured(false);
        setIsSuccessful(true);
      }
    } catch (error: any) {
      setIsSuccessful(false);
      setIsErrorOccured(true);
      setErrorMessage(error?.message);
    }
  };

  return (
    <div className="bg-[#F3F3F3] flex-1 min-h-screen">
      <Header />
      <Container>
        <SettingsContainer>
          {isSuccessful && (
            <Alert severity="success" className="mb-6">
              Delivery address updated successfully!
            </Alert>
          )}

          {isErrorOccured && (
            <Alert severity="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}
          <div className="relative">
          {loading && <CoverLoader />}
            <div className=" p-[2rem]">
              <h2 className="font-medium text-[1.6rem]">
                Add Shipping Address
              </h2>

              <div className="py-[4rem] space-y-6 ">
                <div>
                  <p className="text-md font-medium mb-2 "> Full Name </p>
                  <CssTextField
                    variant="outlined"
                    className="w-full"
                    placeholder="Kelvin Sowah"
                    value={user?.fullName || ""}
                    disabled
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2 "> City </p>
                  <CssTextField
                    name="city"
                    variant="outlined"
                    className="w-full"
                    error={isErrorOccured}
                    value={deliveryAddress?.city || ""}
                    onChange={(e: any) => handleInput(e)}
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2 "> Street </p>
                  <CssTextField
                    name="street"
                    variant="outlined"
                    className="w-full"
                    error={isErrorOccured}
                    value={deliveryAddress?.street || ""}
                    onChange={(e: any) => handleInput(e)}
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2 "> Postal Code </p>
                  <CssTextField
                    name="postalCode"
                    variant="outlined"
                    className="w-full"
                    error={isErrorOccured}
                    value={deliveryAddress?.postalCode || ""}
                    onChange={(e: any) => handleInput(e)}
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2 "> House Number </p>
                  <CssTextField
                    name="houseNumber"
                    variant="outlined"
                    className="w-full"
                    error={isErrorOccured}
                    value={deliveryAddress?.houseNumber || ""}
                    onChange={(e: any) => handleInput(e)}
                  />
                </div>

                <div>
                  <p className="text-md font-medium mb-2 "> Telephone </p>
                  <CssTextField
                    name="telephone"
                    variant="outlined"
                    className="w-full"
                    error={isErrorOccured}
                    value={deliveryAddress?.telephone || ""}
                    onChange={(e: any) => handleInput(e)}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-end pb-6 ">
                <ButtonSolid onClick={handleAddDeliveryAddress} title="Save Changes" />
              </div>
            </div>
          </div>
        </SettingsContainer>

        <Footer />
      </Container>
    </div>
  );
};

export default Address;
