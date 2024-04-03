import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($registerInput: RegisterInput) {
    register(registerInput: $registerInput) {
      _id
      fullName
      email
      avatar
      password
      authType
      userType
      username
      available
      subscription
      verified
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($userId: ID!) {
    verifyUser(userId: $userId) {
      _id
      fullName
      email
      avatar
      password
      authType
      userType
      username
      available
      subscription
      verified
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      user {
        _id
        authType
        available
        avatar
        email
        fullName
        password
        subscription
        username
        verified
        userType
      }
      token
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation Mutation($followedUser: ID!) {
    follow(followedUser: $followedUser) {
      followedBy
      followedUser
      followedAt
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation Unfollow($followedUser: ID!) {
    unfollow(followedUser: $followedUser) {
      followedBy
      followedUser
      followedAt
    }
  }
`;
