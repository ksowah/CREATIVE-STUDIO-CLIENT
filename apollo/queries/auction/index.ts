import { gql } from "@apollo/client";


export const GET_ART_BIDDINGS = gql`
  query Query($artId: ID!) {
    getArtBiddings(artId: $artId) {
      _id
      bidBy {
        _id
        fullName
        username
        avatar
      }
      bidAt
      bidAmount
      artId
    }
  }
`;
