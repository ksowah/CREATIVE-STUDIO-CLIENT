import { gql } from "@apollo/client";

export const GET_ALL_DESIGNS = gql`
  query GetAllDesigns {
    getAllDesigns {
      _id
      designer {
        _id
        fullName
        email
        avatar
        userType
        subscription
        username
        specialization
      }
      preview
      views
      saves
      description
      designSubscription
      designFile
      designFileRef
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
        userType
        subscription
        username
        specialization
      }
      preview
      views
      saves
      description
      designSubscription
      designFile
      designFileRef
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

export const GET_USER_DESIGNS = gql`
  query GetUserDesigns($userId: String!) {
    getUserDesigns(userId: $userId) {
      _id
      designer {
        _id
        fullName
        avatar
        subscription
        username
        specialization
      }
      preview
      views
      saves
      description
      designSubscription
      designFile
      designFileRef
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
