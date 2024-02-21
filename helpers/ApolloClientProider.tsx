"use client";

import { client } from "@/utils/apollo";
import { ApolloProvider } from "@apollo/client";
import React from "react";

const ApolloClientProider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </>
  );
};

export default ApolloClientProider;
