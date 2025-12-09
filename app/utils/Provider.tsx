"use client";
import React from "react";
import NextTopLoader from "nextjs-toploader";
import client from "../../graphql/gql.setup";
import { ApolloProvider } from "@apollo/client";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <NextTopLoader showSpinner={false} color="#a7603a" />

      {children}
    </ApolloProvider>
  );
}
