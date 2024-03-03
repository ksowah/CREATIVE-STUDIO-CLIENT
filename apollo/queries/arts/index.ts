import { gql } from "@apollo/client";

export const GET_ALL_ARTS = gql`
  query Query {
    getAllArtWorks {
      _id
      title
      description
      artist {
        _id
        fullName
        email
        avatar
        password
        authType
        userType
        available
        subscription
        verified
        bio
        username
        specialization
        phoneNumber
        website
      }
      artPreview
      artImages
      category
      dimensions
      price
      artState
      auctionStartPrice
      artImagesRef
      previewImageRef
    }
  }
`;
