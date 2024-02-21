import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    getMe {
      user {
        email
        _id
        authType
        avatar
        fullName
        username
        userType
        verified
        subscription
      }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query Query($username: String!) {
    getUserByUsername(username: $username) {
      _id
      fullName
      email
      avatar
      username
      available
      subscription
      verified
    }
  }
`;
