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

export const GET_USER_ARTS = gql`
  query Query($userId: ID!) {
    getUserArtWorks(userId: $userId) {
      _id
      title
      description
      artist {
        _id
        fullName
        email
        avatar
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
      previewImageRef
      artImagesRef
      artImages
      category
      dimensions
      price
      artState
      auctionStartPrice
    }
  }
`;
