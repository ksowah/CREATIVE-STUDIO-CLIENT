"use client";

import { GET_WALLET_BALLANCE } from "@/apollo/queries/wallet";
import Container from "@/components/Container";
import Header from "@/components/Header";
import WalletContainer from "@/components/wallet/WalletContainer";
import WalletTopTab from "@/components/wallet/WalletTopTab";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@mui/material";
import React from "react";

const StudioWallet = () => {
  const { data, loading, error } = useQuery(GET_WALLET_BALLANCE);

  const balance = data?.getWalletBallance.balance;

  console.log("data balanc >>", error);

  return (
    <main>
      <Header />

      <Container>
        {loading ? (
          <div className="pt-[7rem] flex space-x-6 ">
            <div className="h-[20rem] w-[20rem] ">
              <Skeleton variant="rectangular" height={"100%"} width={"100%"} />
            </div>

            <div className="flex-1 h-[40rem]">
              <Skeleton variant="rectangular" height={"100%"} width={"100%"} />
            </div>
          </div>
        ) : (
          <WalletContainer balance={balance}>
            <div>
              <WalletTopTab />
            </div>
          </WalletContainer>
        )}
      </Container>
    </main>
  );
};

export default StudioWallet;
