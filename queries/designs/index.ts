import { gql } from "@apollo/client";

export const GET_ALL_DESIGNS = gql`
  query Query {
  getAllDesigns {
    _id
    designer {
      _id
      authType
      available
      avatar
      bio
      fullName
      email
      password
      phoneNumber
      specialization
      subscription
      userType
      username
      website
    }
    preview
    views
    saves
    description
    designSubscription
    designFiles
    designImages
    createdAt
    tags
    category
    title
    previewImageRef
    designImagesRef
  }
}
`;

export const GET_DESIGN_BY_ID = gql`
  query GetDesignById($designId: String!) {
  getDesignById(designId: $designId) {
    _id
    designer {
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
    preview
    views
    saves
    description
    designSubscription
    designFiles
    designImages
    createdAt
    tags
    category
    title
  }
}
`;

export const GET_USER_DESIGNS = gql`
  query GetUserDesigns($userId: String!) {
  getUserDesigns(userId: $userId) {
    _id
    designer {
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
    preview
    views
    saves
    description
    designSubscription
    designFiles
    designImages
    createdAt
    tags
    category
    title
    previewImageRef
    designImagesRef
  }
}
`;
