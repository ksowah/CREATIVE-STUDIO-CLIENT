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
