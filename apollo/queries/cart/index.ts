import { gql } from "@apollo/client";

export const GET_CART_ITEMS = gql`
  query Query {
    getCartItems {
      item {
        _id
        title
        artist
        artPreview
        dimensions
        price
      }
      artist {
        fullName
      }
    }
  }
`;
