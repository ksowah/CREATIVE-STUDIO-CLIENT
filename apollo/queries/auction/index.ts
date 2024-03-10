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

export const GET_ACTIVE_AND_UPCOMING_AUCTIONS = gql`
  query GetActiveAndUpcomingAuctions {
  getActiveAndUpcomingAuctions {
    _id
    title
    description
    artPreview
    previewImageRef
    artImagesRef
    artImages
    category
    dimensions
    price
    artState
    auctionStartPrice
    auctionStartDate
    auctionEndDate
    artist {
      fullName
      avatar
    }
  }
}
`;
