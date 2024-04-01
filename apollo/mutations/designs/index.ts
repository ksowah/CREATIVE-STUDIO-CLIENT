import { gql } from "@apollo/client";

export const CREATE_DESIGN = gql`
  mutation CreateDesign($createDesignInput: CreateDesignInput) {
    createDesign(createDesignInput: $createDesignInput) {
      _id
      designer
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

export const DELETE_DESIGN = gql`
  mutation Mutation($designId: String!) {
    deleteDesign(designId: $designId)
  }
`;

export const COUNT_DESIGN_VIEWS = gql`
  mutation Mutation($designId: String!) {
    countDesignViews(designId: $designId)
  }
`;

export const LIKE_DESIGN = gql`
  mutation LikeDesign($designId: String!) {
    likeDesign(designId: $designId) {
      _id
      designId
      likedBy
      likedAt
    }
  }
`;

export const UNLIKE_DESIGN = gql`
  mutation UnlikeDesign($designId: String!) {
    unlikeDesign(designId: $designId)
  }
`;
