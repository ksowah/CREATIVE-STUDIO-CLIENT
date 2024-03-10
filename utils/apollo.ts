import {
  split,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  createHttpLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";



const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
  ? "http://localhost:8000/graphql"
  : "https://creative-studio-ksowahsoftwares.koyeb.app/graphql"
});


const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8000/graphql",
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(async (_, { headers }) => {
  // return the headers to the context so httpLink can read them
  const token = localStorage.getItem("cstoken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});
