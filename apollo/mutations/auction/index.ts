import { gql } from "@apollo/client";

export const PLACE_BID = gql`
  mutation PlaceBid($bidAmount: Float!, $artId: ID!) {
    placeBid(bidAmount: $bidAmount, artId: $artId) {
      _id
      bidBy
      bidAt
      bidAmount
      artId
    }
  }
`;

export const EXPIRE_AUCTION = gql`
  mutation Mutation($artId: ID!) {
    expireAuction(artId: $artId)
  }
`;
