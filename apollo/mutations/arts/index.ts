import { gql } from "@apollo/client";

export const CREATE_ART = gql`
  mutation CreateArt($artInput: ArtInput) {
    createArt(artInput: $artInput) {
      _id
      title
      description
      artist
      artPreview
      artImages
      category
      dimensions
      price
      artState
      auctionStartPrice
      auctionStartDate
      artImagesRef
      previewImageRef
    }
  }
`;
