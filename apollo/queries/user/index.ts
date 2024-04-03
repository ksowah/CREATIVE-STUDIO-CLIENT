import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Query {
    getMe {
      user {
        _id
        fullName
        email
        avatar
        password
        authType
        userType
        available
        subscription
        verified
        bio
        username
        specialization
        phoneNumber
        website
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
      password
      authType
      userType
      available
      subscription
      verified
      bio
      username
      specialization
      phoneNumber
      website
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile($editProfileInput: EditProfileInput) {
    editProfile(editProfileInput: $editProfileInput) {
      user {
        _id
        fullName
        email
        avatar
        password
        authType
        userType
        available
        subscription
        verified
        bio
        username
        specialization
        phoneNumber
        website
      }
      token
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query Query($userId: ID!) {
    getFollowers(userId: $userId) {
      data {
        followedAt
        followedBy {
          email
          fullName
          _id
          username
          avatar
        }
      }
      numberOfFollowers
    }
  }
`;

export const GET_FOLLOWING = gql`
  query GetFollowing($userId: ID!) {
    getFollowing(userId: $userId) {
      data {
        followedBy
        followedUser {
          _id
          avatar
          email
          fullName
          username
        }
      }
      followingCount
    }
  }
`;
