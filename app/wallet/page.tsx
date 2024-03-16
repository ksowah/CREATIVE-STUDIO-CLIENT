"use client"

import { GET_WALLET_BALLANCE } from "@/apollo/queries/wallet";
import Container from "@/components/Container";
import Header from "@/components/Header";
import WalletContainer from "@/components/wallet/WalletContainer";
import WalletTopTab from "@/components/wallet/WalletTopTab";
import { useQuery } from "@apollo/client";
import React from "react";


const StudioWallet = () => {

    const { data, loading } = useQuery(GET_WALLET_BALLANCE)

    const balance = data?.getWalletBallance.balance

  return (
    <main>
      <Header />

      <Container>
        <WalletContainer balance={balance} >
            <div>
               <WalletTopTab />
            </div>
        </WalletContainer>
      </Container>
    </main>
  );
};

export default StudioWallet;
