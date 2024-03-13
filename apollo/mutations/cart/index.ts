import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation Mutation($itemId: ID!, $artist: ID!) {
    addToCart(itemId: $itemId, artist: $artist) {
      item
      user
      artist
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      item
      user
      artist
    }
  }
`;
