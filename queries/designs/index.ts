import { gql } from "@apollo/client";

export const GET_ALL_DESIGNS = gql`
  query Query {
    getAllDesigns {
      _id
      designer {
        avatar
        email
        fullName
        username
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

export const GET_DESIGN_BY_ID = gql`
  query GetDesignById($designId: String!) {
    getDesignById(designId: $designId) {
      _id
      designer {
        fullName
        avatar
        username
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
  query Query($userId: String!) {
    getUserDesigns(userId: $userId) {
      _id
      designer {
        _id
        avatar
        fullName
        username
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
