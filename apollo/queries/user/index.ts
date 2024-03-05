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
