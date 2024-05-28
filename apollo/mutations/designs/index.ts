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

export const SAVE_DESIGN = gql`
  mutation Mutation($designId: String!, $designer: String) {
    saveDesign(designId: $designId, designer: $designer) {
      _id
      design
      savedBy
      savedAt
      designer
    }
  }
`;

export const UNSAVE_DESIGN = gql`
  mutation UnsaveDesign($designId: String!) {
    unsaveDesign(designId: $designId)
  }
`;

export const CREAETE_COMMENT = gql`
  mutation Mutation($designId: String!, $comment: String!) {
    createComment(designId: $designId, comment: $comment) {
      _id
      comment
      commentedBy
      commentedAt
      designId
    }
  }
`;

export const REPLY_TO_COMMENT = gql`
  mutation Mutation($commentId: String!, $reply: String!) {
    replyToComment(commentId: $commentId, reply: $reply) {
      reply
      commentId
      repliedBy
      repliedAt
    }
  }
`;

export const UPDATE_DESIGN = gql`
mutation Mutation($updateDesignInput: UpdateDesignInput) {
  updateDesign(updateDesignInput: $updateDesignInput) {
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
`