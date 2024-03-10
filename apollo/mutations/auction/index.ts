import { gql } from "@apollo/client";

export const PLACE_BID = gql`
  mutation Mutation($bidAmount: Float!, $artId: ID!) {
    placeBid(bidAmount: $bidAmount, artId: $artId) {
      _id
      bidBy
      bidAt
      bidAmount
      artId
    }
  }
`;
