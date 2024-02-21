import { gql } from "@apollo/client";

export const CREATE_DESIGN = gql`
  mutation Mutation($createDesignInput: CreateDesignInput) {
    createDesign(createDesignInput: $createDesignInput) {
      _id
      designer
      preview
      views
      saves
      description
      designSubscription
      designFiles
      createdAt
      tags
      category
      designImages
      title
    }
  }
`;
