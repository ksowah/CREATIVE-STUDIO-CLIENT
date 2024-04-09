import { gql } from "@apollo/client";

export const NEW_LIKE_SUBSCRIPTION = gql`
subscription NewLike($designId: ID!) {
  newLike(designId: $designId) {
    _id
    designId
    likedBy {
      avatar
      email
      fullName
      username
    }
    likedAt
  }
}
`;

export const NEW_COMMENT_REPLY_SUBSCRIPTION =  gql`
  subscription Subscription($commentId: ID!) {
  newCommentReply(commentId: $commentId) {
    reply
    commentId
    repliedBy {
      _id
      avatar
      email
      fullName
      username
    }
    repliedAt
  }
}
`

export const NEW_COMMENT_SUSCRIPTION = gql`
  subscription Subscription($designId: ID!) {
  newComment(designId: $designId) {
    _id
    comment
    commentedBy {
      _id
      avatar
      email
      fullName
      username
    }
    commentedAt
    designId
  }
}
`