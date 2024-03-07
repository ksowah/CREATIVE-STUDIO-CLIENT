import { gql } from "@apollo/client";

export const CREATE_ART = gql`
  mutation Mutation($artInput: ArtInput) {
    createArt(artInput: $artInput) {
      _id
      title
      description
      artist
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
    }
  }
`;
