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

export const GET_DESIGN_LIKES = gql`
  query Query($designId: String!) {
    getDesignLikes(designId: $designId) {
      data {
        _id
        designId
        likedAt
        likedBy {
          fullName
          email
          username
          _id
          avatar
        }
      }
    }
  }
`;

export const GET_SAVED_DESIGNS = gql`
  query Query {
    getSavedDesigns {
      _id
      design {
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
      savedBy
      savedAt
      designer {
        _id
        avatar
        fullName
      }
    }
  }
`;

export const GET_DESIGN_COMMENTS = gql`
  query Query($designId: String!) {
    getDesignComments(designId: $designId) {
      _id
      comment
      commentedBy {
        avatar
        _id
        email
        fullName
        username
      }
      commentedAt
      designId
    }
  }
`;

export const GET_COMMENT_REPLIES = gql`
  query Query($commentId: String!) {
    getCommentReplies(commentId: $commentId) {
      reply
      commentId
      repliedBy {
        avatar
        email
        fullName
        username
      }
      repliedAt
    }
  }
`;

export const GET_DESIGNS_BY_CATEGORY = gql`
  query Query($category: String!) {
    getDesignsByCategory(category: $category) {
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
