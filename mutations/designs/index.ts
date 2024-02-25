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
`
