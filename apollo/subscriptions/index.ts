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