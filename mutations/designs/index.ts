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
`
