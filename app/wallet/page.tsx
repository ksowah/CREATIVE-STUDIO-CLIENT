"use client";

import { GET_WALLET_BALLANCE } from "@/apollo/queries/wallet";
import Container from "@/components/Container";
import Header from "@/components/Header";
import WalletContainer from "@/components/wallet/WalletContainer";
import WalletTopTab from "@/components/wallet/WalletTopTab";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@mui/material";
import React, { useEffect } from "react";

const StudioWallet = () => {
  const { data, loading, error, refetch } = useQuery(GET_WALLET_BALLANCE);

  const wallet = data?.getWalletBallance;

  useEffect(() => {
    refetch();
  }, [])
  

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
          <WalletContainer wallet={wallet}>
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
