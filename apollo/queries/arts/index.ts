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
        avatar
        subscription
        username
        specialization
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
      auctionEndDate
      auctionStartDate
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
        avatar
        subscription
        username
        specialization
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

export const GET_ART_BY_ID = gql`
  query GetArtById($artId: ID!) {
    getArtById(artId: $artId) {
      _id
      title
      description
      artist {
        _id
        fullName
        avatar
        userType
        username
        specialization
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
      auctionStartDate
      auctionEndDate
    }
  }
`;
